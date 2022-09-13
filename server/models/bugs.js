const { client } = require("../database/database.js");

class BugController {
  async getBugs(projectId) {
    try {
      const sql =
        // "select id from bugs where projectId = ($1)";
        `select bugs.id, bugs.title ,bugs.projectId, bugs.description, bugs.priority, bugs.isresolved,
         bugs.createdat, bugs.createdbyid, u1.username as createdby,
         bugs.updatedat,bugs.updatedbyid, u2.username as updatedby,
         bugs.closedat, bugs.closedbyid,u3.username as closedby,
         bugs.reopenedat,  bugs.reopenedbyid, u4.username as reopenedby 
         from bugs left join users as u1 on u1.id = bugs.createdbyid
         left join users as u2 on u2.id = bugs.updatedbyid
         left join users as u3 on u3.id = bugs.closedbyid
         left join users as u4 on u4.id = bugs.reopenedbyid where projectId = ($1)`;
      const conn = await client.connect();
      const result = await conn.query(sql, [projectId]);
      conn.release();
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.log("------------");
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createBug({ title, description, priority, projectId, createdById }) {
    try {
      const sql = `insert into bugs(title, description, priority, projectId, createdById) values($1, $2, $3, $4, $5) returning *`;
      const conn = await client.connect();
      const result = await conn.query(sql, [
        title,
        description,
        priority,
        projectId,
        createdById,
      ]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateBug({
    title,
    description,
    priority,
    projectId,
    updatedById,
    bugId,
  }) {
    try {
      const sql = `update bugs set title = ($1), description = ($2), priority = ($3), projectId = ($4), updatedById = ($5), updatedAt = now() where id = ($6) returning *`;
      const conn = await client.connect();
      const result = await conn.query(sql, [
        title,
        description,
        priority,
        projectId,
        updatedById,
        bugId,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async closeBug(closedById, bugId) {
    try {
      const sql = `update bugs set isResolved = true, closedById = ($1), closedAt = now() where id = ($2) returning *`;
      const conn = await client.connect();
      const result = await conn.query(sql, [closedById, bugId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async reopenBug(reopenedById, bugId) {
    try {
      const sql = `update bugs set isResolved = false, reopenedById = ($1), reopenedAt = now() where id = ($2) returning *`;
      const conn = await client.connect();
      const result = await conn.query(sql, [reopenedById, bugId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getBug(bugId) {
    try {
      const sql = "select * from bugs where id = ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [bugId]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deleteBug(bugId) {
    try {
      const sql = "delete from bugs where id = ($1)";
      const conn = await client.connect();
      await conn.query(sql, [bugId]);
      conn.release();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = { BugController };
