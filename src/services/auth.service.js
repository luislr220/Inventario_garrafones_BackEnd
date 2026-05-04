const AuthModel = require("../models/auth.model");
const UserModel = require("../models/user.model");
const AppError = require("../utils/appError");
const { passwordHash, verifyPassword } = require("../utils/hashPassword");
const { secret2FA } = require("../utils/secret2FA");

const AuthService = {
  inicioSesionService: async (correo, password_hash) => {
    const comparePasswordBD = await UserModel.findByCorreo(correo);

    console.log("INICIO SESIÓN SERVICE: ", comparePasswordBD.rows[0]);

    if (!comparePasswordBD || comparePasswordBD.length === 0) {
      throw new AppError("Correo o contraseña incorrectos.", 401);
    }

    if (comparePasswordBD.rows[0].correo !== correo) {
      throw new AppError("Correo o contraseña incorrectos.", 401);
    }

    const passwordDecrypt = await verifyPassword(
      password_hash,
      comparePasswordBD.rows[0].password_hash,
    );

    if (!passwordDecrypt) {
      throw new AppError("Correo o contraseña incorrectos.", 401);
    }

    const idUsuario = comparePasswordBD.rows[0].id_usuario;

    const secret = secret2FA();

    const responseToken2FA = await AuthModel.guardarToken2FAModel(
      idUsuario,
      secret,
    );

    if (!responseToken2FA) {
      throw new AppError(
        "Ocurrio un error al generar el codigo de verificación",
        500,
      );
    }

    return {
      exito: true,
      mensaje: "Se ha enviado un código de verificación a tu correo.",
      data: responseToken2FA.dosFA_secret,
    };
  },
};

module.exports = AuthService;
