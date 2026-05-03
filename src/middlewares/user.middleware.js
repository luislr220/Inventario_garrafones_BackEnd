const UserService = require("../services/user.service");
const isEmailValid = require("../utils/validarCorreo");

//Validaciones de entrada
async function validUserData(req, res, next) {
  const { nombre, rol, correo, password_hash } = req.body;

  if (!nombre || !rol) {
    return res.status(400).json({
      error: "El nombre y el rol son requeridos",
    });
  }

  const validRoles = ["ADMIN", "LOCAL", "REPARTIDOR"];
  if (!validRoles.includes(rol)) {
    return res.status(400).json({
      error: "El rol es invalido, ingresa un rol valido.",
    });
  }

  if (nombre.length > 100) {
    return res
      .status(400)
      .json({ error: "El nombre no debe ser mayor a 100 caracteres." });
  }

  if (rol === "REPARTIDOR") {
    return res.status(400).json({
      error: "El repartidor no puede tener correo y contraseña.",
    });
  }

  if (rol === "ADMIN" || rol === "LOCAL") {
    if (!correo || !password_hash) {
      return res.status(400).json({
        error:
          "El empleado local y administrador requieren correo y contraseña",
      });
    }

    const validCorreo = isEmailValid(correo);
    if (!validCorreo) {
      return res.status(400).json({
        error:
          "El correo no es valido, ingresa un correo valido. Ejemplo: usuario@dominio.com",
      });
    }
  }

  next();
}

async function validUserDelete(req, res, next) {
  const { id } = req.params;

  const parseId = Number.parseInt(id);
  if (Number.isNaN(parseId) || parseId <= 0) {
    return res.status(400).json({
      error: "El ID proporcionado no es un formato válido.",
    });
  }

  next();
}

async function validUserUpdate(req, res, next) {
  const { id } = req.params;
  const { nombre, rol, correo, password_hash } = req.body;

  const parseId = Number.parseInt(id);
  if (Number.isNaN(parseId) || parseId <= 0) {
    return res.status(400).json({
      error: "El ID proporcionado no es un formato válido.",
    });
  }

  if (nombre && nombre.length > 100) {
    return res.status(400).json({
      error: "El nombre no debe ser mayor a 100 caracteres.",
    });
  }

  const validRoles = ["ADMIN", "LOCAL", "REPARTIDOR"];
  if (rol && !validRoles.includes(rol)) {
    return res.status(400).json({
      error: "El rol es invalido, ingresa un rol valido.",
    });
  }

  if (correo && password_hash) {
    if (rol === "REPARTIDOR") {
      return res.status(400).json({
        error: "El repartidor no puede tener correo y contraseña.",
      });
    }

    const validCorreo = isEmailValid(correo);
    if (!validCorreo) {
      return res.status(400).json({
        error:
          "El correo no es valido, ingresa un correo valido. Ejemplo: usuario@dominio.com",
      });
    }
  }

  next();
}

module.exports = { validUserData, validUserDelete, validUserUpdate };
