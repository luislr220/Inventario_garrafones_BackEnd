const { query } = require("../db/dbConfig");
const { passwordHash } = require("../utils/hashPassword");

const UserModel = {
  findAll: async () => {
    const result = await query("SELECT * FROM usuarios;");
    return result;
  },
  findByIdModel: async (id) => {
    const result = await query("SELECT * FROM usuarios WHERE id_usuario = $1", [
      id,
    ]);
    return result.length > 0;
  },
  createUser: async (userData) => {
    const { nombre, rol, correo, password_hash } = userData;

    const passwordHaseada = await passwordHash(password_hash);

    const result = await query(
      "INSERT INTO usuarios (nombre,rol,correo,password_hash) VALUES($1, $2, $3, $4)",
      [nombre, rol, correo, passwordHaseada],
    );

    return result;
  },
  deleteUser: async (id) => {
    const result = await query("DELETE FROM usuarios WHERE id_usuario = $1", [
      id,
    ]);
    console.log("MODEL DELETE: ", result);
    return result;
  },
};

module.exports = UserModel;
