const AuthModel = require("../models/auth.model");
const UserModel = require("../models/user.model");
const AppError = require("../utils/appError");
const { passwordHash, verifyPassword } = require("../utils/hashPassword");
const { secret2FA } = require("../utils/secret2FA");

const calcularMinutos = (actual, bd) => {
  const diferencia = bd.getTime() - actual.getTime();

  return Math.ceil(diferencia / (1000 * 60));
};
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

    const horaActual = new Date();
    const horaBloqueado = comparePasswordBD.rows[0].bloqueado_hasta;

    if (horaBloqueado !== null) {
      const minutosRestantes = calcularMinutos(horaActual, horaBloqueado);

      if (minutosRestantes > 0) {
        throw new AppError(
          `Demasiados intentos, tienes que esperar ${minutosRestantes} minutos para volver a interlo.`,
          429,
        );
      }
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
    };
  },
  verificarTokenService: async (idUsuario, secret) => {
    const response = await AuthModel.compararToken2FAModel(idUsuario, secret);
    const user = await UserModel.findByIdModel(idUsuario);

    const horaActual = new Date();
    const horaBloqueado = user.rows[0].bloqueado_hasta;

    if (horaBloqueado !== null) {
      const minutosRestantes = calcularMinutos(horaActual, horaBloqueado);

      if (minutosRestantes > 0) {
        throw new AppError(
          `Demasiados intentos, tienes que esperar ${minutosRestantes} minutos para volver a interlo.`,
          429,
        );
      }
    }

    if (!response) {
      const intentos = await AuthModel.registrarIntentosModel(idUsuario);
      if (intentos.intentos_fallidos >= 5) {
        const bloqueado = await AuthModel.registrarFechaBloqueo(idUsuario);

        console.log("RESPONSE DEL BLOQUEADO EN EL SERVICE: ", bloqueado);

        const horaActual = new Date();
        const horaBloqueado = bloqueado.bloqueado_hasta;

        const minutosRestantes = calcularMinutos(horaActual, horaBloqueado);

        console.log("ENTRANDO A ELIMINAR LOS TOKENS E INTENTOS");

        const eliToken = await AuthModel.eliminarToken2FAModel(
          bloqueado.id_usuario,
        );
        const eliIntentos = await AuthModel.eliminarIntentos(
          bloqueado.id_usuario,
        );

        console.log("ID QUE LE MANDO A LOS RESET", bloqueado.id_usuario);

        console.log("TERMINANDO DE ELIMINAR LOS TOKENS E INTENTOS");
        console.log(eliToken);
        console.log(eliIntentos);

        throw new AppError(
          `Demasiados intentos, tienes que esperar ${minutosRestantes} minutos para volver a interlo.`,
          429,
        );
      }
      throw new AppError(
        "No haz solicitado un código de verificación nuevo.",
        401,
      );
    }

    const eliminarToken = await AuthModel.eliminarToken2FAModel(idUsuario);

    if (!eliminarToken) {
      throw new AppError(
        "Ocurrio un error en el proceso de verificación, intentalo de nuevo",
        500,
      );
    }

    console.log("VERIFICAR TOKEN SERVICE: ", response);
    return {
      exito: true,
      mensaje: "Inicio de sesión exitoso.",
    };
  },
};

module.exports = AuthService;
