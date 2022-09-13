const { client } = require("../database/database.js");

class Member {
  #projectId;
  #memberId;
  constructor(pId, mId) {
    this.#projectId = pId;
    this.#memberId = mId;
  }
  get getProjectId() {
    return this.#projectId;
  }
  get getMemberId() {
    return this.#memberId;
  }
}
class MemberController {
  async inserMembers(member) {
    try {
      const sql =
        "INSERT INTO members (projectId, memberId) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        member.getProjectId,
        member.getMemberId,
      ]);
      conn.release();
    } catch (err) {
      console.log(err);
      throw new Error(`Could not add new member`);
    }
  }

  async deleteMembers(projectId) {
    try {
      const sql = "delete from members where projectId = ($1)";
      const conn = await client.connect();
      await conn.query(sql, [projectId]);
      conn.release();
    } catch (err) {
      console.log(err);
      throw new Error(`Could not delete members`);
    }
  }

  async getUserProjects(memberId) {
    try {
      const sql = "select projectId from members where memberId = ($1)";
      const conn = await client.connect();
      const res = await conn.query(sql, [memberId]);
      conn.release();
      return res.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Could not get memberIds.!");
    }
  }
  async getMembers(projectId) {
    try {
      const sql =
        "select members.memberid, members.joinedat , users.username from members inner join users on users.id = members.memberId where members.projectid = ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [projectId]);
      conn.release();
      return result.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Could not get memberIds.!");
    }
  }
  async getMemberIds(projectId) {
    try {
      const sql = "select memberId from members where projectId = ($1)";
      const conn = await client.connect();
      const res = await conn.query(sql, [projectId]);
      conn.release();
      return res.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Could not get memberIds.!");
    }
  }

  async removeProjectMember(projectId, memberId) {
    try {
      const sql =
        "delete from members where projectId = ($1) and memberId = ($2)";
      const conn = await client.connect();
      await conn.query(sql, [projectId, memberId]);
      conn.release();
    } catch (error) {
      throw new Error("Can not remove project member");
    }
  }
}

module.exports = {
  Member,
  MemberController,
};
