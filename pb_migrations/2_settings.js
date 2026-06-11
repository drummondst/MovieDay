
migrate((db) => {
  const settings = new Collection({
    id: "settings000000001",
    name: "settings",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: `@request.auth.id != ""`,
    updateRule: `@request.auth.id != ""`,
    deleteRule: null,
    schema: [
      { name: "key",   type: "text", required: true },
      { name: "value", type: "text", required: true },
    ],
  });
  db.save(settings);
}, (db) => {
  db.dropTable("settings");
});