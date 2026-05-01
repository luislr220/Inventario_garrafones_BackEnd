const UserModel = require("../models/user.model");
const { passwordHash } = require("../utils/hashPassword");

const UserService = {
  getAllUsers: async () => {
    return UserModel.findAll();
  },
  findByIdService: async (id) => {
    const response = await UserModel.findByIdModel(id);

    return response.rows.length > 0;
  },
  createUser: async (UserData) => {
    const password = UserData.password_hash;

    const passwordHaseada = await passwordHash(password);
    console.log("PASSWORD HASHEADA EN EL SERVICE: ", passwordHaseada);
    const data = { ...UserData, passwordHaseada };

    return await UserModel.createUser(data);
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
};

module.exports = UserService;
