const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authChecker = (req, res, next) => {
  try {
    const token = req.header("authToken");
    if (!token) {
      return res
        .status(401)
        .send({ message: "No auth token found. Authorization denied." });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (!decodedToken.id) {
      return res
        .status(401)
        .send({ message: "Token verification failed. Authorization denied." });
    }

    req.user = decodedToken.id;
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = {
  authChecker,
};
