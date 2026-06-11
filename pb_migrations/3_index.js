migrate((db) => {
  db.execute(`
    CREATE UNIQUE INDEX idx_vote_unique
    ON votes (nomination_id, username)
  `);
});