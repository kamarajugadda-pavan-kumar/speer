// models/notesModel.js
const db = require("../services/databaseService").dbClient;

const getAllNotesByUserId = async (userId) => {
  const query =
    "SELECT * FROM notes WHERE user_id = $1 OR note_id IN (SELECT note_id FROM shared_notes WHERE user_id = $1)";
  const values = [userId];
  const result = await db.query(query, values);
  return result.rows;
};

const getNoteByIdAndUserId = async (noteId, userId) => {
  const query =
    "SELECT * FROM notes WHERE (user_id = $1 OR note_id IN (SELECT note_id FROM shared_notes WHERE user_id = $1)) AND note_id = $2";
  const values = [userId, noteId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const createNote = async (noteData) => {
  const { userId, title, content } = noteData;
  const query =
    "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *";
  const values = [userId, title, content];
  const result = await db.query(query, values);
  return result.rows[0];
};

const updateNoteByIdAndUserId = async (noteId, userId, updatedData) => {
  const { title, content } = updatedData;
  const query =
    "UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE (user_id = $3 OR note_id IN (SELECT note_id FROM shared_notes WHERE user_id = $3)) AND note_id = $4 RETURNING *";
  const values = [title, content, userId, noteId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteNoteByIdAndUserId = async (noteId, userId) => {
  const query =
    "DELETE FROM notes WHERE (user_id = $1 OR note_id IN (SELECT note_id FROM shared_notes WHERE user_id = $1)) AND note_id = $2 RETURNING *";
  const values = [userId, noteId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const checkNoteSharingConditions = async (noteId, userId, recipientUserId) => {
  const query = `
  WITH shared_note_check AS (
    SELECT
      n.*,
      u_sharer.user_id AS sharer_user_id_exists,
      u_recipient.user_id AS recipient_user_id_exists
    FROM
      notes n
    LEFT JOIN
      users u_sharer ON n.user_id = u_sharer.user_id
    LEFT JOIN
      users u_recipient ON u_recipient.user_id = $3
    WHERE
      n.note_id = $1
      AND u_sharer.user_id = $2
  )
  SELECT
    *,
    CASE
      WHEN sharer_user_id_exists IS NULL THEN 'Note not found'
      WHEN sharer_user_id_exists IS NOT NULL AND user_id IS NULL THEN 'Permission denied'
      WHEN sharer_user_id_exists IS NOT NULL AND user_id IS NOT NULL AND recipient_user_id_exists IS NULL THEN 'Recipient user not found'
      WHEN sharer_user_id_exists IS NOT NULL AND recipient_user_id_exists IS NOT NULL AND sharer_user_id_exists = recipient_user_id_exists THEN 'cannot share with self'
      ELSE 'Ready to share'
    END AS status
  FROM
    shared_note_check;
  `;

  const values = [noteId, userId, recipientUserId];
  const result = await db.query(query, values);

  return result.rows[0] || { status: "Note not found" };
};

const shareNoteByIdAndUserId = async (noteId, recipientUserId) => {
  const query =
    "INSERT INTO shared_notes (user_id, note_id) VALUES ($1, $2) RETURNING *";
  const values = [recipientUserId, noteId];
  const result = await db.query(query, values);

  return result.rows[0];
};

const searchNotesByUserIdAndQuery = async (userId, query) => {
  try {
    const queryString = `
    SELECT n.*
    FROM notes n
    LEFT JOIN keywords k ON n.note_id = k.note_id
    WHERE n.user_id = $1 AND (LOWER(n.title) ~* $2 OR LOWER(n.content) ~* $2 OR LOWER(k.keyword) ~* $2)
    GROUP BY n.note_id
    ORDER BY n.created_at DESC;
    `;

    const values = [userId, query];
    const result = await db.query(queryString, values);

    return result.rows;
  } catch (error) {
    console.error("Error searching notes:", error);
    throw error;
  }
};

module.exports = {
  getAllNotesByUserId,
  getNoteByIdAndUserId,
  createNote,
  updateNoteByIdAndUserId,
  deleteNoteByIdAndUserId,
  checkNoteSharingConditions,
  shareNoteByIdAndUserId,
  searchNotesByUserIdAndQuery,
};
