const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
//Añadir un const con el middleware {} = require...

router.get("/getAllUsers", UserController.getAllUsers);

module.exports = router;
