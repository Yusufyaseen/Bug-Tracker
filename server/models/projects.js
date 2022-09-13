const { client } = require("../database/database.js");
const { MemberController } = require("./members.js");

const memberController = new MemberController();

class Project {
  #name;
  #createdBy;
  constructor(name, createdBy) {
    this.#name = name;
    this.#createdBy = createdBy;
  }
  get getName() {
    return this.#name;
  }
  get getCreatedBy() {
    return this.#createdBy;
  }
}
class ProjectController {
  async createProject(project) {
    try {
      const sql =
        "INSERT INTO projects (name, createdById) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        project.getName,
        project.getCreatedBy,
      ]);
      const createdProjects = result.rows[0];
      conn.release();
      return createdProjects;
    } catch (err) {
      console.log(err);
      throw new Error(`Could not add new project`);
    }
  }

  async editProjectName(projectId, name, id) {
    try {
      const sql =
        "update projects set name = ($1) where id = ($2) and createdById = ($3) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [name, projectId, id]);
      const updatedProjects = result.rows[0];
      conn.release();
      return updatedProjects;
    } catch (err) {
      console.log(err);
      throw new Error(`Could not edit new project`);
    }
  }

  async getProjects(projectsId) {
    try {
      const sql = `select projects.*, users.username as admin from projects inner join users on users.id = projects.createdbyid where projects.id = any($1) `;
      const conn = await client.connect();
      const result = await conn.query(sql, [projectsId]);
      const exists = result.rows;
      conn.release();
      return exists;
    } catch (error) {
      console.log(error);
      throw new Error(`Could not find project`);
    }
  }

  async projectExist(projectId) {
    try {
      const sql = "select createdById from projects where id = ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [projectId]);
      const exists = result.rows[0];
      conn.release();
      return exists;
    } catch (error) {
      console.log(error);
      throw new Error(`Could not find project`);
    }
  }

  async deleteProject(projectId) {
    try {
      const sql = "delete from projects where id = ($1)";
      const conn = await client.connect();
      await conn.query(sql, [projectId]);
      conn.release();
    } catch (error) {
      console.log(error);
      throw new Error(`Could not delete project`);
    }
  }
}

module.exports = {
  Project,
  ProjectController,
};
