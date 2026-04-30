const UserService = require("../services/user.service");

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserService.getAllUsers();

      if (users.rows.length === 0) {
        res.status(200).json({ mensaje: "No hay usuarios registrados." });
        return;
      }

      res.status(200).json({ mensaje: "Usuarios listados", data: users.rows });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Ocurrio un error al obtener todos los usuarios." });
    }
  },
  createUsers: async (req, res) => {
    try {
      await UserService.createUser(req.body);
      res.status(200).json({
        mensaje: "Usuario creado con exito",
      });
    } catch (error) {
      console.log("ERROR: ", error);
      res.status(500).json({
        error: "Ocurrio un error al crear al usuario, intentalo más tarde.",
      });
    }
  },
  deleteUserController: async (req, res) => {
    try {
      const { id } = req.params;

      const idExist = await UserService.findByIdService(id);
      if (!idExist) {
        return res.status(404).json({
          error: "No se encontro al usuario que se quiere eliminar.",
        });
      }

      const response = await UserService.deleteUserService(id);
      console.log("RESPONSE DELETE: ", response);
      res.status(200).json({
        mensaje: `El usuario ${response.usuario.rows[0]} fue eliminado con exito.`,
      });
    } catch (error) {
      console.log("ERROR AL ELIMINAR USUARIO: ", error.message);
      res.status(500).json({
        error: "Ocurrio un error al eliminar al usuario, intentalo más tarde.",
      });
    }
  },
};

module.exports = UserController;
