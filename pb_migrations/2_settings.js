migrate((db) => {

  db.importCollections([
    {
      id: "votes00000000001",
      name: "votes",
      type: "base",
      schema: [
        { name: "nomination_id", type: "text", required: true },
        { name: "event_id", type: "text", required: true },
        { name: "username", type: "text", required: true },
        { name: "score", type: "number", required: true },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_vote_unique ON votes (nomination_id, username)"
      ]
    },
    {
      id: "settings00000001",
      name: "settings",
      type: "base",
      schema: [
        { name: "key", type: "text", required: true },
        { name: "value", type: "text", required: true }
      ],
      indexes: [
        "CREATE INDEX idx_settings_key ON settings (key)"
      ]
    }
  ]);

});