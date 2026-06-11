/// <reference path="../pb_data/types.d.ts" />
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
    indexes: [
      "CREATE UNIQUE INDEX idx_settings_key ON settings (key)"
    ],
  });
  db.save(settings);
}, (db) => {
  db.dropTable("settings");
});