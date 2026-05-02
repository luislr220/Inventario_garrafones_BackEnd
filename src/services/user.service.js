const UserModel = require("../models/user.model");
const { passwordHash } = require("../utils/hashPassword");

const UserService = {
  getAllUsers: async () => {
    return UserModel.findAll();
  },
  findByIdService: async (id) => {
    const response = await UserModel.findByIdModel(id);

    if (response.rows.length > 0) {
      return {
        exito: true,
        mensaje: "Usuario encontrado.",
        data: response.rows[0],
      };
    } else {
      return {
        exito: false,
        mensaje: "No se encontro al usuario.",
      };
    }
  },
  createUser: async (UserData) => {
    const password = UserData.password_hash;

    const passwordHaseada = await passwordHash(password);
    console.log("PASSWORD HASHEADA EN EL SERVICE: ", passwordHaseada);
    const data = { ...UserData, passwordHaseada };

    const response = await UserModel.createUser(data);
    console.log("Respuesta de create user: ", response);

    if (response.rowCount > 0) {
      return {
        exito: true,
        mensaje: "Usuario creado con exito.",
      };
    } else {
      return {
        exito: false,
        mensaje: "Ocurrio un error al crear el usuario, vuelve a intentarlo",
      };
    }
  },
  deleteUserService: async (id) => {
    const idExist = await UserService.findByIdService(id);
    console.log("ID EXITS: ", idExist);
    if (!idExist) {
      return {
        exito: false,
        mensaje: "No se encontro al usuario que se quiere eliminar.",
      };
    }

    const result = await UserModel.deleteUser(id);

    if (result.rowCount > 0) {
      const nombre = result.rows[0]?.nombre || "usuario";
      return {
        exito: true,
        mensaje: `Se ha eliminado a ${nombre} correctamente.`,
      };
    }

    return {
      exito: false,
      mensaje: "Ocurrio un error, intentalo de nuevo.",
    };
  },
  updateUserService: async (id, userData) => {
    const idExist = await UserService.findByIdService(id);

    if (!idExist.exito) {
      return {
        exito: false,
        mensaje: idExist.mensaje,
      };
    }

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
      return {
        exito: false,
        mensaje: `${idExist.data.nombre} es un repartidor, no puede tener correo ni contraseña.`,
      };
    }

    if (
      idExist.data.rol === "REPARTIDOR" &&
      userData.rol &&
      (userData.rol === "LOCAL" || userData.rol === "ADMIN")
    ) {
      if (!userData.correo || !userData.password_hash) {
        return {
          exito: false,
          mensaje: `Para cambiar de repartidor a ${userData.rol.toLowerCase()}, debes proporcionar correo y contraseña.`,
        };
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
        data: updateUser.rows[0],
      };
    }
    return {
      exito: false,
      mensaje: "Ocurrio un error al actualizar el usuario, intentalo de nuevo.",
    };
  },
};

module.exports = UserService;
