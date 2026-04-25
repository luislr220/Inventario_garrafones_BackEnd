require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("Conexión con la bd establecida.");
});

pool.on("error", (e) => {
  console.log("Ocurrio un error al intentar conectarse a la db: ", e);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
