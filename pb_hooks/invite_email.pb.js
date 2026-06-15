/// <reference path="../pb_data/types.d.ts" />

// Fires when a new invite record is created
onRecordAfterCreateSuccess((e) => {
  const invite = e.record;
  const eventId   = invite.get("event_id");
  const userEmail = invite.get("user_email");

  // Look up the event
  let event;
  try {
    event = $app.findRecordById("events", eventId);
  } catch (err) {
    console.error("invite_email: could not find event", eventId, err);
    return;
  }

  const eventName    = event.get("name");
  const eventDate    = event.get("date");
  const eventTime    = event.get("time");
  const eventLocation= event.get("location");
  const createdBy    = event.get("created_by");

  // Look up the app URL from settings (falls back to a placeholder)
  let appUrl = "https://your-reelnight-url";
  try {
    const setting = $app.findFirstRecordByFilter("settings", 'key="app_url"');
    if (setting) appUrl = setting.get("value");
  } catch(_) {}

  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name:    $app.settings().meta.senderName || "ReelNight",
    },
    to: [{ address: userEmail }],
    subject: `🎬 You've been invited to ${eventName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0D0F1A;color:#F0F0F0;border-radius:12px;overflow:hidden;">
        <div style="background:#E8C547;padding:24px;text-align:center;">
          <h1 style="font-family:sans-serif;font-size:28px;color:#0D0F1A;margin:0;letter-spacing:3px;">🎬 REELNIGHT</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 8px;font-size:22px;">You're invited!</h2>
          <p style="color:#8892B0;margin:0 0 24px;">${createdBy} has invited you to a movie night.</p>

          <div style="background:#1A1D2E;border:1px solid #2A2D45;border-radius:10px;padding:20px;margin-bottom:24px;">
            <div style="font-size:20px;font-weight:700;margin-bottom:12px;">${eventName}</div>
            <div style="color:#8892B0;font-size:14px;line-height:2;">
              📅 ${eventDate} at ${eventTime}<br>
              📍 ${eventLocation}
            </div>
          </div>

          <p style="color:#8892B0;font-size:14px;margin-bottom:24px;">
            Sign in to nominate movies and vote on what to watch.
          </p>

          <a href="${appUrl}" style="display:inline-block;background:#E8C547;color:#0D0F1A;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:15px;">
            Open ReelNight →
          </a>
        </div>
      </div>
    `,
  });

  try {
    $app.newMailClient().send(message);
    console.log("invite_email: sent to", userEmail);
  } catch (err) {
    console.error("invite_email: failed to send to", userEmail, err);
  }
}, "event_invites");
