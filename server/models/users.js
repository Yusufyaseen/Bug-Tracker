const { client } = require("../database/database.js");

class User {
  constructor(username, passwordhash) {
    this.username = username;
    this.passwordhash = passwordhash;
  }
}
class UserController {
  async createUser(username, password) {
    try {
      const sql =
        "INSERT INTO users (username, passwordHash) VALUES($1, $2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [username, password]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(`Could not add new user`);
    }
  }

  async getAllUSers(id) {
    try {
      const sql = "select * from users where id != ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const users = result.rows;
      conn.release();
      return users;
    } catch (err) {
      console.log(err);
      throw new Error(`Could not get all users`);
    }
  }

  async userExists(username) {
    try {
      const sql = "select * from users where username = ($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [username]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      console.log(err);
      throw new Error(
        `Could not get a specific username ${title}. Error: ${err}`
      );
    }
  }
}

module.exports = {
  User,
  UserController,
};
