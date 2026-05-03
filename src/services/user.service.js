const UserModel = require("../models/user.model");
const AppError = require("../utils/appError");
const { passwordHash } = require("../utils/hashPassword");

const validarCambioDeRol = (user, userData) => {
  if (
    (user.rol === "LOCAL" || user.rol === "ADMIN") &&
    userData.rol === "REPARTIDOR"
  ) {
    userData.correo = null;
    userData.password_hash = null;
  }

  if (
    user.rol === "REPARTIDOR" &&
    !userData.rol &&
    (userData.correo || userData.password_hash)
  ) {
    throw new AppError(
      `${user.nombre} es un repartidor, no puede tener correo ni contraseña.`,
      400,
    );
  }

  if (
    user.rol === "REPARTIDOR" &&
    userData.rol &&
    (userData.rol === "LOCAL" || userData.rol === "ADMIN")
  ) {
    if (!userData.correo || !userData.password_hash) {
      throw new AppError(
        `Para cambiar de repartidor a ${userData.rol.toLowerCase()}, debes proporcionar correo y contraseña.`,
        400,
      );
    }
  }
};

const UserService = {
  getAllUsers: async () => {
    const response = await UserModel.findAll();

    console.log("RESPONSE DE LISTALL SERVICE: ", response.rows);

    if (response.rows.length === 0) {
      throw new AppError("No hay usuarios registrados.", 404);
    }

    return response.rows;
  },
  findByIdService: async (id) => {
    const response = await UserModel.findByIdModel(id);

    if (response.rows.length === 0) {
      throw new AppError("No se encontro al usuario.", 404);
    }

    return response.rows[0];
  },
  createUser: async (UserData) => {
    const correoDB = await UserModel.findByCorreo(UserData.correo);

    if (correoDB.rows[0]?.correo === UserData.correo) {
      throw new AppError(
        `El correo ${UserData.correo} ya esta registrado, intenta con otro.`,
        400,
      );
    }

    const password = UserData.password_hash;

    const passwordHaseada = await passwordHash(password);
    console.log("PASSWORD HASHEADA EN EL SERVICE: ", passwordHaseada);
    const data = { ...UserData, password_hash: passwordHaseada };

    const response = await UserModel.createUser(data);
    console.log("Respuesta de create user: ", response);

    if (response.rowCount === 0) {
      throw new AppError(
        "Ocurrio un error en la creción del usuario, intentalo de nuevo.",
        500,
      );
    }

    return true;
  },
  deleteUserService: async (id) => {
    await UserService.findByIdService(id);

    const result = await UserModel.deleteUser(id);

    if (result.rowCount === 0) {
      throw new AppError(
        "No se pudo eliminar al usuario, intentalo de nuevo.",
        500,
      );
    }

    return result.rows[0];
  },
  updateUserService: async (id, userData) => {
    const correoDB = await UserModel.findByCorreo(userData.correo);

    if (correoDB.rows.length > 0) {
      if (
        correoDB.rows[0].correo === userData.correo &&
        correoDB.rows[0].id_usuario == id
      ) {
        throw new AppError(
          `El correo ${userData.correo} ya está asociado a tu cuenta.`,
          400,
        );
      }

      if (
        correoDB.rows[0].correo === userData.correo &&
        correoDB.rows[0].id_usuario != id
      ) {
        throw new AppError(
          `El correo ${userData.correo} ya está registrado, intenta con otro.`,
          400,
        );
      }
    }

    const user = await UserService.findByIdService(id);

    validarCambioDeRol(user, userData);

    //Hashear password
    if (userData.password_hash) {
      const passwordHasheada = await passwordHash(userData.password_hash);
      userData.password_hash = passwordHasheada;
    }

    const updateUser = await UserModel.updateUserModel(id, userData);

    if (updateUser.rowCount === 0) {
      throw new AppError(
        "Ocurrio un error al actualizar el usuario, intentalo de nuevo.",
        500,
      );
    }

    return updateUser.rows[0];
  },
};

module.exports = UserService;
