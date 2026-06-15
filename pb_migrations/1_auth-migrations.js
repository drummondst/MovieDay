/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {

  // ── nominations: add nominated_by_id field FIRST ──
  const nominations = db.findCollectionByNameOrId("nominations");
  nominations.fields.add(new Field({
    name: "nominated_by_id",
    type: "text",
    required: false,
  }));
  db.save(nominations);

  // ── votes: add user_id field FIRST ──
  const votes = db.findCollectionByNameOrId("votes");
  votes.fields.add(new Field({
    name: "user_id",
    type: "text",
    required: false,
  }));
  db.save(votes);

  // ── events: add created_by_id field FIRST ──
  const events = db.findCollectionByNameOrId("events");
  events.fields.add(new Field({
    name: "created_by_id",
    type: "text",
    required: false,
  }));
  db.save(events);

  // ── NOW set rules (fields exist) ──
  const events2 = db.findCollectionByNameOrId("events");
  events2.listRule   = "@request.auth.id != ''";
  events2.viewRule   = "@request.auth.id != ''";
  events2.createRule = "@request.auth.id != ''";
  events2.updateRule = "@request.auth.id != '' && created_by_id = @request.auth.id";
  events2.deleteRule = "@request.auth.id != '' && created_by_id = @request.auth.id";
  db.save(events2);

  const nominations2 = db.findCollectionByNameOrId("nominations");
  nominations2.listRule   = "@request.auth.id != ''";
  nominations2.viewRule   = "@request.auth.id != ''";
  nominations2.createRule = "@request.auth.id != ''";
  nominations2.updateRule = "@request.auth.id != '' && nominated_by_id = @request.auth.id";
  nominations2.deleteRule = "@request.auth.id != '' && nominated_by_id = @request.auth.id";
  db.save(nominations2);

  const votes2 = db.findCollectionByNameOrId("votes");
  votes2.listRule   = "@request.auth.id != ''";
  votes2.viewRule   = "@request.auth.id != ''";
  votes2.createRule = "@request.auth.id != ''";
  votes2.updateRule = "@request.auth.id != '' && user_id = @request.auth.id";
  votes2.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id";
  db.save(votes2);

  const settings = db.findCollectionByNameOrId("settings");
  settings.listRule   = "@request.auth.id != ''";
  settings.viewRule   = "@request.auth.id != ''";
  settings.createRule = "@request.auth.id != ''";
  settings.updateRule = "@request.auth.id != ''";
  settings.deleteRule = null;
  db.save(settings);

}, (db) => {
  for (const name of ["events","nominations","votes","settings"]) {
    const col = db.findCollectionByNameOrId(name);
    col.listRule = col.viewRule = col.createRule = col.updateRule = col.deleteRule = "";
    db.save(col);
  }
});