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
      const response = await UserService.createUser(req.body);

      if (response.exito) {
        res.status(200).json({
          mensaje: response.mensaje,
        });
      } else {
        res.status(400).json({
          mensaje: response.mensaje,
        });
      }
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

      const response = await UserService.deleteUserService(id);

      if (!response.exito) {
        return res.status(404).json({
          mensaje: response.mensaje,
        });
      }

      if (response.exito) {
        return res.status(200).json({
          mensaje: response.mensaje,
        });
      }
    } catch (error) {
      console.log("ERROR AL ELIMINAR USUARIO: ", error);
      res.status(500).json({
        error: "Ocurrio un error al eliminar al usuario, intentalo más tarde.",
      });
    }
  },
  updateUserController: async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;

      const response = await UserService.updateUserService(id, userData);

      if (!response.exito) {
        return res.status(400).json({
          mensaje: response.mensaje,
        });
      }

      return res.status(200).json({
        mensaje: response.mensaje,
      });
    } catch (error) {
      console.log("ERROR AL ACTUALIZAR USUARIO: ", error);
      return res.status(500).json({
        error:
          "Ocurrio un error al actualizar el usuario, intentalo más tarde.",
      });
    }
  },
};

module.exports = UserController;
