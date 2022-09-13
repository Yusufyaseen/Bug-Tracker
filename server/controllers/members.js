const { Member, MemberController } = require("../models/members.js");
const { ProjectController } = require("../models/projects.js");

const { projectMembersError } = require("../utils/validators.js");

const memberController = new MemberController();
const projectController = new ProjectController();

const addProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const newMembers = req.body.members;

    if (newMembers.length === 0) {
      return res
        .status(400)
        .send({ message: "Members field must not be an empty array." });
    }
    const projectExists = await projectController.projectExist(projectId);
    if (!Boolean(projectExists)) {
      return res.status(400).json({ message: "Can not find this project." });
    }

    if (projectExists.createdbyid !== req.user) {
      return res.status(401).send({ message: "Access is denied..." });
    }

    const memberIds = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );
    const validMembers = projectMembersError([...newMembers, ...memberIds]);
    if (validMembers) {
      return res.status(400).send({ message: validMembers });
    }

    newMembers.forEach(async (memberId) => {
      await memberController.inserMembers(new Member(projectId, memberId));
    });

    const updatedMembers = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );
    res.status(200).json({ data: updatedMembers });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const removeProjectMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const projectExists = await projectController.projectExist(projectId);
    if (!Boolean(projectExists)) {
      return res.status(400).json({ message: "Can not find this project." });
    }

    if (projectExists.createdbyid !== req.user) {
      return res.status(401).send({ message: "Access is denied..." });
    }

    if (projectExists.createdbyid === memberId) {
      return res
        .status(400)
        .send({ message: "Project creator can't be removed." });
    }
    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );
    if (!members.includes(memberId)) {
      return res.status(400).send({ message: "Member is not exist." });
    }
    await memberController.removeProjectMember(projectId, memberId);
    return res
      .status(200)
      .json({ data: "member is correctly removed from this project" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const leaveProjectAsMember = async (req, res) => {
  try {
    const { projectId } = req.params;

    const targetProject = await projectController.projectExist(projectId);

    if (!targetProject) {
      return res.status(404).send({ message: "Invalid project ID." });
    }

    if (targetProject.createdbyid === req.user) {
      return res.status(400).send({ message: "Project creator can't leave." });
    }

    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );
    if (!members.includes(req.user)) {
      return res
        .status(400)
        .send({ message: "You are not exist in this project." });
    }

    await memberController.removeProjectMember(projectId, req.user);
    return res
      .status(200)
      .json({ data: "member is correctly removed from this project" });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: error.message });
  }
};

module.exports = {
  addProjectMembers,
  removeProjectMember,
  leaveProjectAsMember,
};
