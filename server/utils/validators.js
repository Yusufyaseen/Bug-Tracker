const registerValidator = (username, password) => {
  const errors = {};
  if (
    !username ||
    username.trim() == "" ||
    username.length < 3 ||
    username.length > 20
  ) {
    errors.username =
      "Username must be over 3 characters and less than 20 characters";
  }
  if (!/^[a-zA-Z0-9-_]*$/.test(username)) {
    errors.username = "Username must have alphanumeric characters only";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be over 6 characters";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const loginValidator = (username, password) => {
  const errors = {};

  if (!username || username.trim() === "") {
    errors.username = "Username field must not be empty.";
  }

  if (!password) {
    errors.password = "Password field must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const projectNameError = (name) => {
  if (!name || name.trim() === "" || name.length > 60) {
    return "Project name length must not be more than 60.";
  }
};

const projectMembersError = (members) => {
  if (members.filter((m, i) => members.indexOf(m) !== i).length > 0) {
    return "There are dublicate members";
  }

  if (members.some((m) => m.length !== 36)) {
    return "Members array must contain valid UUIDs.";
  }
};

const createProjectValidator = (name, members) => {
  const errors = {};
  const projectName = projectNameError(name);
  const membersError = projectMembersError(members);

  if (projectName) {
    errors.name = "Project name length must not be more than 60";
  }

  if (membersError) {
    errors.members = membersError;
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const createBugValidator = (title, description, priority) => {
  const errors = {};
  const validPriorities = ["low", "medium", "high"];

  if (!title || title.trim() === "" || title.length > 60 || title.length < 3) {
    errors.title = "Title must be in range of 3-60 characters length.";
  }

  if (!description || description.trim() === "") {
    errors.description = "Description field must not be empty.";
  }

  if (!priority || !validPriorities.includes(priority)) {
    errors.priority = "Priority can only be - low, medium or high.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {
  registerValidator,
  loginValidator,
  projectMembersError,
  createProjectValidator,
  createBugValidator,
  projectNameError,
};
