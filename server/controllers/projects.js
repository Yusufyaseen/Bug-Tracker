const { Member, MemberController } = require("../models/members.js");
const { Project, ProjectController } = require("../models/projects.js");
const {
  createProjectValidator,
  projectNameError,
} = require("../utils/validators.js");

const projectController = new ProjectController();
const memberController = new MemberController();

const getProjects = async (req, res) => {
  try {
    let projectsId = await memberController.getUserProjects(req.user); // getting projects where the user is in.
    projectsId = projectsId.map((project) => project.projectid);
    let getProjects = await projectController.getProjects(projectsId); // contents of all projects.
    getProjects = await Promise.all(
      getProjects.map(async (project) => {
        project.members = await memberController.getMembers(project.id);
        return project;
      })
    );
    // for (let project of getProjects) {
    //   project.members = await memberController.getMembers(project.id);
    // }

    return res.status(200).json({ data: getProjects });
  } catch (error) {
    console.log(error.message);
    return res.status(409).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const memberIds = req.body.members
      ? [req.user, ...req.body.members]
      : [req.user];
    const { errors, valid } = createProjectValidator(name, memberIds);
    if (!valid) {
      return res.status(400).json({ message: Object.values(errors)[0] });
    }
    const createdProject = await projectController.createProject(
      new Project(name, req.user)
    );
    memberIds.forEach(async (memberId) => {
      await memberController.inserMembers(
        new Member(createdProject.id, memberId)
      );
    });
    return res.status(200).json({ data: createdProject });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const editProjectName = async (req, res) => {
  try {
    const { name } = req.body;
    const { projectId } = req.params;
    const nameValidation = projectNameError(name);

    if (nameValidation) {
      return res.status(400).json({ message: nameValidation });
    }
    const updatedProjectName = await projectController.editProjectName(
      projectId,
      name,
      req.user
    );
    if (!Boolean(updatedProjectName)) {
      return res.status(400).json({ message: "Can not update projects name" });
    }
    return res.status(200).json({ data: updatedProjectName });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const projectExists = await projectController.projectExist(projectId);
    if (!Boolean(projectExists)) {
      return res.status(400).json({ message: "Can not find this project." });
    }
    if (projectExists.createdbyid !== req.user) {
      return res
        .status(400)
        .json({ message: "This user is not permited to delete this project." });
    }
    await memberController.deleteMembers(projectId);
    await projectController.deleteProject(projectId);
    return res.status(200).json({ data: "Project is correctly deleted" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
module.exports = {
  createProject,
  editProjectName,
  getProjects,
  deleteProject,
};
