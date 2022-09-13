const express = require("express");
const authRoutes = express.Router();
const { signUp, loginUser } = require("../controllers/auth.js");

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", loginUser);

module.exports = {
  authRoutes,
};
