/// <reference path="../pb_data/types.d.ts" />

// Runs every 5 minutes, finds events whose voting just closed,
// and emails all invited users with the results.

cronAdd("voting_closed_check", "*/5 * * * *", () => {
  const now     = new Date();
  const fiveMin = new Date(now.getTime() - 5 * 60 * 1000);

  // Find events where vote_end is within the last 5 minutes
  // (so we catch it in exactly one cron window)
  const nowStr     = now.toISOString().replace("T", " ").substring(0, 19);
  const fiveMinStr = fiveMin.toISOString().replace("T", " ").substring(0, 19);

  let events;
  try {
    events = $app.findRecordsByFilter(
      "events",
      `vote_end >= "${fiveMinStr}" && vote_end <= "${nowStr}"`,
      "-created", 50, 0
    );
  } catch (err) {
    console.error("voting_closed: error fetching events", err);
    return;
  }

  if (!events || events.length === 0) return;

  let appUrl = "https://your-reelnight-url";
  try {
    const setting = $app.findFirstRecordByFilter("settings", 'key="app_url"');
    if (setting) appUrl = setting.get("value");
  } catch(_) {}

  for (const event of events) {
    const eventId   = event.id;
    const eventName = event.get("name");
    const numMovies = event.get("num_movies") || 1;

    // Get all nominations for this event
    let nominations;
    try {
      nominations = $app.findRecordsByFilter(
        "nominations", `event_id = "${eventId}"`, "-created", 200, 0
      );
    } catch(_) { nominations = []; }

    // Get all votes for this event
    let votes;
    try {
      votes = $app.findRecordsByFilter(
        "votes", `event_id = "${eventId}"`, "-created", 500, 0
      );
    } catch(_) { votes = []; }

    // Calculate averages
    const avgScores = {};
    for (const nom of nominations) {
      const nomVotes = votes.filter(v => v.get("nomination_id") === nom.id);
      if (nomVotes.length === 0) { avgScores[nom.id] = 0; continue; }
      avgScores[nom.id] = nomVotes.reduce((sum, v) => sum + v.get("score"), 0) / nomVotes.length;
    }

    // Sort by average score descending
    const sorted = [...nominations].sort((a, b) => (avgScores[b.id] || 0) - (avgScores[a.id] || 0));
    const winners = sorted.slice(0, numMovies);

    // Build winners HTML for email
    const medals = ["🏆", "🥈", "🥉"];
    const winnersHtml = winners.map((w, i) => `
      <div style="display:flex;align-items:center;gap:12px;background:#1A1D2E;border:1px solid #2A2D45;border-radius:8px;padding:14px;margin-bottom:10px;">
        <span style="font-size:28px">${medals[i] || "🎬"}</span>
        <div>
          <div style="font-weight:700;font-size:16px;">${w.get("title")} ${w.get("year") ? "("+w.get("year")+")" : ""}</div>
          <div style="color:#E8C547;font-size:13px;">Avg score: ${(avgScores[w.id] || 0).toFixed(1)} / 10</div>
        </div>
      </div>`).join("");

    // Get all invited emails + the creator
    let inviteEmails = [];
    try {
      const invites = $app.findRecordsByFilter(
        "event_invites", `event_id = "${eventId}"`, "-created", 100, 0
      );
      inviteEmails = invites.map(i => i.get("user_email"));
    } catch(_) {}

    const creatorEmail = event.get("created_by_email") || "";
    const allEmails    = [...new Set([...inviteEmails, creatorEmail].filter(Boolean))];

    if (allEmails.length === 0) {
      console.log("voting_closed: no emails to notify for event", eventId);
      continue;
    }

    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name:    $app.settings().meta.senderName || "ReelNight",
      },
      to: allEmails.map(a => ({ address: a })),
      subject: `🏆 Voting is closed — ${eventName} results are in!`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0D0F1A;color:#F0F0F0;border-radius:12px;overflow:hidden;">
          <div style="background:#E8C547;padding:24px;text-align:center;">
            <h1 style="font-family:sans-serif;font-size:28px;color:#0D0F1A;margin:0;letter-spacing:3px;">🎬 REELNIGHT</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="margin:0 0 8px;font-size:22px;">Voting is closed!</h2>
            <p style="color:#8892B0;margin:0 0 24px;">
              Here ${winners.length === 1 ? "is" : "are"} the winner${winners.length === 1 ? "" : "s"} for <strong style="color:#F0F0F0">${eventName}</strong>:
            </p>

            ${winnersHtml || `<p style="color:#8892B0">No nominations were made for this event.</p>`}

            <p style="color:#8892B0;font-size:14px;margin-top:24px;margin-bottom:24px;">
              See the full results and all scores on ReelNight.
            </p>

            <a href="${appUrl}" style="display:inline-block;background:#E8C547;color:#0D0F1A;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:15px;">
              View Results →
            </a>
          </div>
        </div>
      `,
    });

    try {
      $app.newMailClient().send(message);
      console.log("voting_closed: results email sent for event", eventId, "to", allEmails.length, "recipients");
    } catch (err) {
      console.error("voting_closed: failed to send for event", eventId, err);
    }
  }
});
