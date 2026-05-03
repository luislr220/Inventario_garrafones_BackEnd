const UserService = require("../services/user.service");

const UserController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        exito: true,
        mensaje: "Usuarios listados correctamente",
        data: users,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  createUsers: async (req, res, next) => {
    try {
      await UserService.createUser(req.body);

      return res
        .status(201)
        .json({ exito: true, mensaje: "Usuario creado con exito." });
    } catch (error) {
      console.log("ERROR: ", error);
      next(error);
    }
  },
  deleteUserController: async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await UserService.deleteUserService(id);

      return res.status(200).json({
        exito: true,
        mensaje: `Se ha eliminado a ${response.nombre} correctamente.`,
      });
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

      return res
        .status(200)
        .json({
          exito: true,
          mensaje: "Usuario actualizado con exito.",
          data: response,
        });
    } catch (error) {
      console.log("ERROR AL ACTUALIZAR USUARIO: ", error);
      next(error);
    }
  },
};

module.exports = UserController;
