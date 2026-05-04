const { query } = require("../db/dbConfig");

const AuthModel = {
  guardarToken2FAModel: async (id_usuario, secret) => {
    const result = await query(
      "INSERT INTO login (id_usuario, dosFA_secret) VALUES ($1, $2) RETURNING *;",
      [id_usuario, secret],
    );

    return result.rows[0];
  },

  compararToken2FAModel: async (id_usuario, secret) => {
    const result = await query(
      "SELECT * FROM login WHERE id_usuario = $1 AND dosFA_secret = $2 RETURNING *",
      [id_usuario, secret],
    );

    return result.rows[0];
  },

  eliminarToken2FAModel: async (id_usuario) => {
    const result = await query(
      "DELETE FROM login WHERE id_usuario = $1 RETURNING *",
      [id_usuario],
    );
    return result.rows[0];
  },
};

module.exports = AuthModel;
