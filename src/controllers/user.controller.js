const UserService = require("../services/user.service");

const UserController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await UserService.getAllUsers();

      res.status(users.status).json(users);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  createUsers: async (req, res, next) => {
    try {
      const response = await UserService.createUser(req.body);

      return res.status(response.status).json(response);
    } catch (error) {
      console.log("ERROR: ", error);
      next(error);
    }
  },
  deleteUserController: async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await UserService.deleteUserService(id);

      if (response.exito) {
        return res.status(response.status).json(response);
      }
    } catch (error) {
      console.log("ERROR AL ELIMINAR USUARIO: ", error);
      next(error);
    }
  },
  updateUserController: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userData = req.body;

      const response = await UserService.updateUserService(id, userData);

      return res.status(response.status).json(response);
    } catch (error) {
      console.log("ERROR AL ACTUALIZAR USUARIO: ", error);
      next(error);
    }
  },
};

module.exports = UserController;
