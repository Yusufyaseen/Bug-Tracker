const express = require("express");
const {
  createProject,
  editProjectName,
  deleteProject,
  getProjects,
} = require("../controllers/projects.js");
const { authChecker } = require("../middlewares/authChecker.js");

const projectRoutes = express.Router();

projectRoutes.get("/", authChecker, getProjects);
projectRoutes.post("/", authChecker, createProject);
projectRoutes.put("/:projectId", authChecker, editProjectName);
projectRoutes.delete("/:projectId", authChecker, deleteProject);
module.exports = { projectRoutes };
