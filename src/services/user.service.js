const UserModel = require("../models/user.model");

const UserService = {
  getAllUsers: async () => {
    return UserModel.findAll();
  },

  createUser: async (UserData) => {
    return await UserModel.createUser(UserData);
  },
};

module.exports = UserService;
