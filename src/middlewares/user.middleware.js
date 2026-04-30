const UserService = require("../services/user.service");

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

    //Validación de correo
  }

  next();
}

module.exports = { validUserData };
