const express = require("express");
const {
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notes.js");

const { authChecker } = require("../middlewares/authChecker.js");

const noteRouter = express.Router();

noteRouter.post("/:projectId/bugs/:bugId/notes", authChecker, createNote);
noteRouter.put("/:projectId/notes/:noteId", authChecker, updateNote);
noteRouter.delete("/:projectId/notes/:noteId", authChecker, deleteNote);

module.exports = {
  noteRouter,
};
