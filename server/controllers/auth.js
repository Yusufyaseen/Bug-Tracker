const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { User, UserController } = require("../models/users.js");
const { registerValidator, loginValidator } = require("../utils/validators.js");

dotenv.config();
const { SECRET_KEY } = process.env;

const userController = new UserController();

const signUp = async (req, res) => {
  const { username, password } = req.body;
  const { errors, valid } = registerValidator(username, password);
  if (!valid) {
    return res.status(400).json({ message: Object.values(errors)[0] });
  }
  try {
    const existingUser = await userController.userExists(username);
    if (existingUser.length > 0) {
      return res
        .status(401)
        .send({ message: `Username '${username}' is already exists.` });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await userController.createUser(username, passwordHash);
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY
    );
    return res
      .status(201)
      .json({ id: user.id, username: user.username, token });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const { errors, valid } = loginValidator(username, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  try {
    const user = await userController.userExists(username);

    if (!user) {
      return res
        .status(401)
        .send({ message: `User: '${username}' not found.` });
    }

    const credentialsValid = await bcrypt.compare(password, user.passwordhash);
    if (!credentialsValid) {
      return res.status(401).send({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY
    );

    return res.status(201).json({
      id: user.id,
      username: user.username,
      token,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  loginUser,
};
