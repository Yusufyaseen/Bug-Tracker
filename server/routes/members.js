const express = require("express");
const {
  addProjectMembers,
  removeProjectMember,
  leaveProjectAsMember,
} = require("../controllers/members.js");

const { authChecker } = require("../middlewares/authChecker.js");

const memberRoutes = express.Router();

memberRoutes.post("/:projectId/members", authChecker, addProjectMembers);
memberRoutes.delete(
  "/:projectId/members/:memberId",
  authChecker,
  removeProjectMember
);
memberRoutes.post(
  "/:projectId/members/leave",
  authChecker,
  leaveProjectAsMember
);
module.exports = { memberRoutes };
