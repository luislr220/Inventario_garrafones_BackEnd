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
      "SELECT * FROM login WHERE id_usuario = $1 AND dosFA_secret = $2;",
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
  registrarIntentosModel: async (id_usuario) => {
    console.log("ID DE INTENTOS QUE LLEGA AL MODEL: ", id_usuario);
    const result = await query(
      "UPDATE usuarios SET intentos_fallidos = COALESCE(intentos_fallidos, 0) + 1 WHERE id_usuario = $1 RETURNING *;",
      [id_usuario],
    );

    return result.rows[0];
  },

  registrarFechaBloqueo: async (id_usuario) => {
    const result = await query(
      "UPDATE usuarios SET bloqueado_hasta = CURRENT_TIMESTAMP + INTERVAL '15 minutes' WHERE id_usuario = $1 RETURNING id_usuario, bloqueado_hasta;",
      [id_usuario],
    );

    return result.rows[0];
  },
  eliminarIntentos: async (id_usuario) => {
    const result = await query(
      "UPDATE usuarios SET intentos_fallidos = 0 WHERE id_usuario = $1 RETURNING *;",
      [id_usuario],
    );

    return result.rows[0];
  },
};

module.exports = AuthModel;
