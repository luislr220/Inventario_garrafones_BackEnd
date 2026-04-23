const express = require("express");
const cors = require("cors");
require("dotenv").config();

const puerto = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor levantado");
});

app.listen(puerto, () => {
  console.log(`Puerto activo en ${puerto}`);
});
