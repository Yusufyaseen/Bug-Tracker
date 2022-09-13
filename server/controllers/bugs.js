const { Member, MemberController } = require("../models/members.js");
const { ProjectController } = require("../models/projects.js");
const { BugController } = require("../models/bugs.js");
const { createBugValidator } = require("../utils/validators.js");
const { NoteController } = require("../models/notes.js");
const e = require("express");
const memberController = new MemberController();
const projectController = new ProjectController();
const bugController = new BugController();
const noteController = new NoteController();

const getBugs = async (req, res) => {
  try {
    const { projectId } = req.params;
    let bugs = await bugController.getBugs(projectId);
    console.log(bugs);
    bugs = await Promise.all(
      bugs.map(async (bug) => {
        bug.notes = await noteController.getNotes(bug.id);
        return bug;
      })
    );
    return res.status(200).json({ data: bugs });
  } catch (error) {
    console.log(error);
    return res.status(405).json({ message: error.message });
  }
};
const createBug = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const { projectId } = req.params;
    const { errors, valid } = createBugValidator(title, description, priority);
    if (!valid) {
      return res.status(400).send({ message: Object.values(errors)[0] });
    }

    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );

    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }
    const createdById = req.user;
    const newBug = await bugController.createBug({
      title,
      description,
      priority,
      projectId,
      createdById,
    });
    return res.status(200).json({ data: newBug });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateBug = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const { projectId, bugId } = req.params;
    const { errors, valid } = createBugValidator(title, description, priority);
    if (!valid) {
      return res.status(400).send({ message: Object.values(errors)[0] });
    }

    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );

    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }
    const updatedById = req.user;
    console.log(updatedById);
    const updatedBug = await bugController.updateBug({
      title,
      description,
      priority,
      projectId,
      updatedById,
      bugId,
    });
    if (!Boolean(updatedBug)) {
      return res.status(400).send({ message: "Invalid bug ID." });
    }
    return res.status(200).json({ data: updatedBug });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deleteBug = async (req, res) => {
  try {
    const { projectId, bugId } = req.params;
    const projectExists = await projectController.projectExist(projectId);
    if (!Boolean(projectExists)) {
      return res.status(400).json({ message: "Can not find this project." });
    }
    const targetBug = await bugController.getBug(bugId);
    if (!Boolean(targetBug)) {
      return res.status(404).send({ message: "Invalid bug ID." });
    }

    if (
      projectExists.createdbyid !== req.user ||
      targetBug.createdbyid !== req.user
    ) {
      return res.status(401).send({ message: "Access is denied." });
    }
    await bugController.deleteBug(bugId);
    return res.status(200).json({ data: "Bug is correctly removed" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const closedBug = async (req, res) => {
  try {
    console.log(req.user);
    const { projectId, bugId } = req.params;
    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );

    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }

    const targetBug = await bugController.getBug(bugId);
    if (!Boolean(targetBug)) {
      return res.status(404).send({ message: "Invalid bug ID." });
    }

    if (targetBug.isresolved == true) {
      return res
        .status(400)
        .send({ message: "Bug is already marked as closed." });
    }
    const closedBug = await bugController.closeBug(req.user, bugId);
    return res.status(201).json({ data: closedBug });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const reopenBug = async (req, res) => {
  try {
    console.log(req.user);
    const { projectId, bugId } = req.params;
    console.log(projectId);
    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );

    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }

    const targetBug = await bugController.getBug(bugId);
    if (!Boolean(targetBug)) {
      return res.status(404).send({ message: "Invalid bug ID." });
    }
    if (targetBug.isresolved == false) {
      return res
        .status(400)
        .send({ message: "Bug is already marked as opened." });
    }
    const reopenedBug = await bugController.reopenBug(req.user, bugId);
    return res.status(201).json({ data: reopenedBug });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createBug,
  updateBug,
  deleteBug,
  closedBug,
  reopenBug,
  getBugs,
};
