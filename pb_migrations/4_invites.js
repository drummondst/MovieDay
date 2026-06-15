migrate((db) => {

  // ── event_invites collection ──
  const invites = new Collection({
    id:         "invites000000001",
    name:       "event_invites",
    type:       "base",
    listRule:   "@request.auth.id != ''",
    viewRule:   "@request.auth.id != ''",
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
  });
  db.save(invites);

  // Add fields after save
  const invites2 = db.findCollectionByNameOrId("event_invites");
  invites2.fields.add(new Field({ name: "event_id",    type: "text", required: true  }));
  invites2.fields.add(new Field({ name: "user_email",  type: "text", required: true  }));
  invites2.fields.add(new Field({ name: "invited_by",  type: "text", required: false }));
  db.save(invites2);

  // ── update events rules to check invites ──
  // List/view only if creator OR invited
  const events = db.findCollectionByNameOrId("events");
  events.listRule = "@request.auth.id != '' && (created_by_id = @request.auth.id || id ?= @collection.event_invites.event_id && @request.auth.email ?= @collection.event_invites.user_email)";
  events.viewRule = "@request.auth.id != '' && (created_by_id = @request.auth.id || id ?= @collection.event_invites.event_id && @request.auth.email ?= @collection.event_invites.user_email)";
  db.save(events);

}, (db) => {
  db.dropTable("event_invites");

  const events = db.findCollectionByNameOrId("events");
  events.listRule = "@request.auth.id != ''";
  events.viewRule = "@request.auth.id != ''";
  db.save(events);
});