const UserModel = require("../models/user.model");
const AppError = require("../utils/appError");
const { passwordHash } = require("../utils/hashPassword");

const UserService = {
  getAllUsers: async () => {
    const response = await UserModel.findAll();

    console.log("RESPONSE DE LISTALL SERVICE: ", response.rows);
    if (response.rows.length > 0) {
      return {
        exito: true,
        mensaje: "Usuarios listados correctamente",
        status: 200,
        data: response.rows,
      };
    }

    if (response.rows.length === 0) {
      throw new AppError("No hay usuarios registrados.", 404);
    }
  },
  findByIdService: async (id) => {
    const response = await UserModel.findByIdModel(id);

    if (response.rows.length > 0) {
      return {
        exito: true,
        mensaje: "Usuario encontrado.",
        status: 200,
        data: response.rows[0],
      };
    } else {
      throw new AppError("No se encontro al usuario.", 404);
    }
  },
  createUser: async (UserData) => {
    const password = UserData.password_hash;

    const passwordHaseada = await passwordHash(password);
    console.log("PASSWORD HASHEADA EN EL SERVICE: ", passwordHaseada);
    const data = { ...UserData, password_hash: passwordHaseada };

    const response = await UserModel.createUser(data);
    console.log("Respuesta de create user: ", response);

    if (response.rowCount > 0) {
      return {
        exito: true,
        mensaje: "Usuario creado con exito.",
        status: 200,
      };
    }

    throw new AppError(
      "Ocurrio un error en la creción del usuario, intentalo de nuevo.",
      500,
    );
  },
  deleteUserService: async (id) => {
    await UserService.findByIdService(id);

    const result = await UserModel.deleteUser(id);

    if (result.rowCount > 0) {
      const nombre = result.rows[0]?.nombre || "usuario";
      return {
        exito: true,
        mensaje: `Se ha eliminado a ${nombre} correctamente.`,
        status: 200,
      };
    }

    throw new AppError(
      "No se pudo eliminar al usuario, intentalo de nuevo.",
      500,
    );
  },
  updateUserService: async (id, userData) => {
    const idExist = await UserService.findByIdService(id);

    if (
      (idExist.data.rol === "LOCAL" || idExist.data.rol === "ADMIN") &&
      userData.rol === "REPARTIDOR"
    ) {
      userData.correo = null;
      userData.password_hash = null;
    }

    if (
      idExist.data.rol === "REPARTIDOR" &&
      !userData.rol &&
      (userData.correo || userData.password_hash)
    ) {
      throw new AppError(
        `${idExist.data.nombre} es un repartidor, no puede tener correo ni contraseña.`,
        400,
      );
    }

    if (
      idExist.data.rol === "REPARTIDOR" &&
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

    //Hashear password
    if (userData.password_hash) {
      const passwordHasheada = await passwordHash(userData.password_hash);
      userData.password_hash = passwordHasheada;
    }

    const updateUser = await UserModel.updateUserModel(id, userData);

    if (updateUser && updateUser.rowCount > 0) {
      return {
        exito: true,
        mensaje: "Usuario actualizado con exito.",
        status: 200,
        data: updateUser.rows[0],
      };
    }

    throw new AppError(
      "Ocurrio un error al actualizar el usuario, intentalo de nuevo.",
      500,
    );
  },
};

module.exports = UserService;
