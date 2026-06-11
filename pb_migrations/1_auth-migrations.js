/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {

  // ── events ──
  const events = db.findCollectionByNameOrId("events");
  events.listRule   = "@request.auth.id != ''";
  events.viewRule   = "@request.auth.id != ''";
  events.createRule = "@request.auth.id != ''";
  events.updateRule = "@request.auth.id != '' && created_by = @request.auth.name";
  events.deleteRule = "@request.auth.id != '' && created_by = @request.auth.name";
  db.save(events);

  // ── nominations ──
  const nominations = db.findCollectionByNameOrId("nominations");
  nominations.listRule   = "@request.auth.id != ''";
  nominations.viewRule   = "@request.auth.id != ''";
  nominations.createRule = "@request.auth.id != ''";
  nominations.updateRule = "@request.auth.id != '' && nominated_by_id = @request.auth.id";
  nominations.deleteRule = "@request.auth.id != '' && nominated_by_id = @request.auth.id";
  db.save(nominations);

  // ── votes ──
  const votes = db.findCollectionByNameOrId("votes");
  votes.listRule   = "@request.auth.id != ''";
  votes.viewRule   = "@request.auth.id != ''";
  votes.createRule = "@request.auth.id != ''";
  votes.updateRule = "@request.auth.id != '' && user_id = @request.auth.id";
  votes.deleteRule = "@request.auth.id != '' && user_id = @request.auth.id";
  db.save(votes);

  // ── settings ──
  const settings = db.findCollectionByNameOrId("settings");
  settings.listRule   = "@request.auth.id != ''";
  settings.viewRule   = "@request.auth.id != ''";
  settings.createRule = "@request.auth.id != ''";
  settings.updateRule = "@request.auth.id != ''";
  settings.deleteRule = null;
  db.save(settings);

  // ── update nominations schema: add nominated_by_id ──
  nominations.schema.addField(new SchemaField({
    name: "nominated_by_id",
    type: "text",
    required: false,
  }));
  db.save(nominations);

  // ── update votes schema: add user_id ──
  votes.schema.addField(new SchemaField({
    name: "user_id",
    type: "text",
    required: false,
  }));
  db.save(votes);

}, (db) => {
  // down - reopen all rules
  for (const name of ["events","nominations","votes","settings"]) {
    const col = db.findCollectionByNameOrId(name);
    col.listRule = col.viewRule = col.createRule = col.updateRule = col.deleteRule = "";
    db.save(col);
  }
});