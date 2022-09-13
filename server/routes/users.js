const express = require("express");
const { getAllUsers } = require("../controllers/users.js");

const userRoutes = express.Router();
userRoutes.get("/:id", getAllUsers);

module.exports = {
  userRoutes,
};
