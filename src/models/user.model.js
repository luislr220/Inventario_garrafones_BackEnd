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
    console.log("MODEL DEL FIND BY ID: ", result);
    return result;
  },
  createUser: async (userData) => {
    const { nombre, rol, correo, password_hash } = userData;

    console.log("USERDATA EN EL MODEL: ", userData);

    const result = await query(
      "INSERT INTO usuarios (nombre,rol,correo,password_hash) VALUES($1, $2, $3, $4)",
      [nombre, rol, correo, password_hash],
    );

    return result;
  },
  deleteUser: async (id) => {
    const result = await query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING nombre",
      [id],
    );
    return result;
  },
  updateUserModel: async (id, userData) => {
    const keys = Object.keys(userData);
    if (keys.length === 0) return null;

    const setClause = keys
      .map((keys, index) => `${keys} = $${index + 1}`)
      .join(", ");

    const values = Object.values(userData);
    values.push(id);

    const queryUpdate = `UPDATE usuarios SET ${setClause} WHERE id_usuario = $${values.length} RETURNING *`;

    const result = await query(queryUpdate, values);

    return result;
  },
};

module.exports = UserModel;
