/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {

  // ── events ──
  const events = new Collection({
    id: "events0000000001",
    name: "events",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    schema: [
      { name: "name",       type: "text",   required: true  },
      { name: "date",       type: "text",   required: true  },
      { name: "time",       type: "text",   required: true  },
      { name: "location",   type: "text",   required: true  },
      { name: "num_movies", type: "number", required: true  },
      { name: "vote_end",   type: "text",   required: false },
      { name: "created_by", type: "text",   required: false },
    ],
  });

  // ── nominations ──
  const nominations = new Collection({
    id: "nominations000001",
    name: "nominations",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    schema: [
      { name: "event_id",     type: "text",   required: true  },
      { name: "tmdb_id",      type: "number", required: true  },
      { name: "title",        type: "text",   required: true  },
      { name: "year",         type: "text",   required: false },
      { name: "poster",       type: "text",   required: false },
      { name: "overview",     type: "text",   required: false },
      { name: "genres",       type: "json",   required: false },
      { name: "trailer_key",  type: "text",   required: false },
      { name: "nominated_by", type: "text",   required: false },
    ],
  });

  db.save(events);
  db.save(nominations);
}, (db) => {
  db.dropTable("nominations");
  db.dropTable("events");
});
