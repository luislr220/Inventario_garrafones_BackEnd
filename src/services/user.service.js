const UserModel = require("../models/user.model");

const UserService = {
  getAllUsers: async () => {
    return UserModel.findAll();
  },
  findByIdService: async (id) => {
    return UserModel.findByIdModel(id);
  },
  createUser: async (UserData) => {
    return await UserModel.createUser(UserData);
  },
  deleteUserService: async (id) => {
    return await UserModel.deleteUser(id);
  },
};

module.exports = UserService;
