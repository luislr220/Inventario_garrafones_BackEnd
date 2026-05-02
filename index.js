const express = require("express");
const cors = require("cors");
const db = require("./src/db/dbConfig.js");
require("dotenv").config();
const userRoutes = require("./src/routes/user.routes.js");
const globalErrorHandler = require("./src/middlewares/errorMiddleware.js");

const puerto = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor levantado");
});

app.use("/users", userRoutes);


app.use(globalErrorHandler);
app.listen(puerto, () => {
  console.log(`Puerto activo en ${puerto}`);
});
