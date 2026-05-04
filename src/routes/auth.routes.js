const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/inicioSesion", AuthController.inicioSesionController);

module.exports = router;
