const { Member, MemberController } = require("../models/members.js");
const { ProjectController } = require("../models/projects.js");
const { BugController } = require("../models/bugs.js");
const { NoteController } = require("../models/notes.js");

const memberController = new MemberController();
const projectController = new ProjectController();
const bugController = new BugController();
const noteController = new NoteController();
const createNote = async (req, res) => {
  try {
    const { body } = req.body;
    const { projectId, bugId } = req.params;
    if (!body || body.trim() === "") {
      return res
        .status(400)
        .send({ message: "Note body field must not be empty." });
    }

    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );

    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }

    const createdNote = await noteController.createNote(body, req.user, bugId);
    return res.status(200).json({ data: createdNote });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { body } = req.body;
    const { projectId, noteId } = req.params;
    if (!body || body.trim() === "") {
      return res
        .status(400)
        .send({ message: "Note body field must not be empty." });
    }

    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );

    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }

    const targetNote = await noteController.getNote(noteId);

    if (!Boolean(targetNote)) {
      return res.status(404).send({ message: "Invalid note ID." });
    }
    if (targetNote.authorid !== req.user) {
      return res.status(401).send({ message: "Access is denied." });
    }
    const updatedNote = await noteController.updateNote(body, noteId);
    return res.status(200).json({ data: updatedNote });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { projectId, noteId } = req.params;

    const projectExists = await projectController.projectExist(projectId);
    if (!Boolean(projectExists)) {
      return res.status(400).json({ message: "Can not find this project." });
    }

    const members = (await memberController.getMemberIds(projectId)).map(
      (member) => member.memberid
    );
    if (!members.includes(req.user)) {
      return res.status(400).send({ message: "Access is denied.!" });
    }

    const targetNote = await noteController.getNote(noteId);

    if (!Boolean(targetNote)) {
      return res.status(404).send({ message: "Invalid note ID." });
    }
    if (
      targetNote.authorid !== req.user ||
      projectExists.createdbyid !== req.user
    ) {
      return res.status(401).send({ message: "Access is denied." });
    }
    await noteController.deleteNote(noteId);
    return res.status(200).json({ data: "Note is correctly deleted" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
module.exports = {
  createNote,
  updateNote,
  deleteNote,
};
