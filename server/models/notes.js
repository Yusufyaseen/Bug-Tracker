const { client } = require("../database/database.js");

class NoteController {
  async createNote(body, authorId, bugId) {
    try {
      const sql =
        "insert into notes(body, authorId, bugId) values($1, $2, $3) returning *";
      const conn = await client.connect();
      const result = await conn.query(sql, [body, authorId, bugId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateNote(body, noteId) {
    try {
      const sql = "update notes set body = ($1) where id = ($2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [body, noteId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteNote(noteId) {
    try {
      const sql = "delete from notes where id = ($1)";
      const conn = await client.connect();
      await conn.query(sql, [noteId]);
      conn.release();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNotes(bugId) {
    try {
      const sql =
        "select notes.*, users.username from notes inner join users on users.id = notes.authorId where bugId = ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [bugId]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getNote(noteId) {
    try {
      const sql = "select * from notes where id = ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [noteId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = {
  NoteController,
};
