const { User, UserController } = require("../models/users.js");

const userController = new UserController();

const getAllUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userController.getAllUSers(id);
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
};
