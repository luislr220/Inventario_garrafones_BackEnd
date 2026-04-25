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
};

module.exports = UserController;
