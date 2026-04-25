const UserModel = require("../models/user.model");

const UserService = {
  getAllUsers: async () => {
    return UserModel.findAll();
  },
};

module.exports = UserService;
