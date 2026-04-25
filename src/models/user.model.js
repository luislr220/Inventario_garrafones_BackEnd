const { query } = require("../db/dbConfig");

const UserModel = {
  findAll: async () => {
    const result = await query("SELECT * FROM usuarios;");
    return result;
  },

  createUser: async (userData) => {
    const { nombre, rol, correo, password_hash } = userData;
    console.log("NOMBRE EN EL MODEL: ", nombre);
    const result = await query(
      "INSERT INTO usuarios (nombre,rol,correo,password_hash) VALUES($1, $2, $3, $4)",
      [nombre, rol, correo, password_hash],
    );

    return result;
  },
};

module.exports = UserModel;
