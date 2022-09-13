const express = require("express");
const {
  createBug,
  updateBug,
  deleteBug,
  closedBug,
  reopenBug,
  getBugs,
} = require("../controllers/bugs.js");
const { authChecker } = require("../middlewares/authChecker.js");

const bugRouter = express.Router();

bugRouter.get("/:projectId/bugs", authChecker, getBugs);
bugRouter.post("/:projectId/bugs", authChecker, createBug);
bugRouter.put("/:projectId/bugs/:bugId", authChecker, updateBug);
bugRouter.delete("/:projectId/bugs/:bugId", authChecker, deleteBug);
bugRouter.put("/:projectId/bugs/:bugId/close", authChecker, closedBug);
bugRouter.put("/:projectId/bugs/:bugId/reopen", authChecker, reopenBug);
module.exports = {
  bugRouter,
};
