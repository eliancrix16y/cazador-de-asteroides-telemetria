const TOP_LIMIT = 10;

export function createLeaderboardRepository(database) {
  return {
    findAllTop: () => findAllTop(database),
    insert: (entry) => insert(database, entry),
  };
}

function findAllTop(database) {
  const statement = database.prepare(SELECT_TOP);
  return statement.all().map(normalizeRow);
}

function insert(database, entry) {
  const statement = database.prepare(INSERT_SCORE);
  const result = statement.run(entry.playerName, entry.score, entry.waveReached, entry.averageFps);
  return Number(result.lastInsertRowid);
}

function normalizeRow(row) {
  return {
    id: row.id,
    playerName: row.player_name,
    score: row.score,
    waveReached: row.wave_reached,
    averageFps: row.avg_fps,
    createdAt: row.created_at,
  };
}

const SELECT_TOP = `
  SELECT id, player_name, score, wave_reached, avg_fps, created_at
  FROM scores
  ORDER BY score DESC
  LIMIT ${TOP_LIMIT}
`;

const INSERT_SCORE = `
  INSERT INTO scores (player_name, score, wave_reached, avg_fps)
  VALUES (?, ?, ?, ?)
`;