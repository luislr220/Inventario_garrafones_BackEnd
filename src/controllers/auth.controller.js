const AuthService = require("../services/auth.service");
const { secret2FA } = require("../utils/secret2FA");

const authController = {
  inicioSesionController: async (req, res, next) => {
    try {
      const { correo, password_hash } = req.body;

      const response = await AuthService.inicioSesionService(
        correo,
        password_hash,
      );

      res.status(200).json(response);
    } catch (error) {
      console.log("ERROR EN EL INICIO DE SESIÓN:", error);
      next(error);
    }
  },
};

module.exports = authController;
