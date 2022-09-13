const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();
const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_DB, POSTGRES_PASSWORD } =
  process.env;
const client = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
});
// client.connect((err) => {
//   if (err) {
//     console.log("ERRORRRR");
//     throw err;
//   }
//   console.log("Connected!");
// });

module.exports = {
  client,
};
