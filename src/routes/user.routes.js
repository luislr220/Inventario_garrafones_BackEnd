const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const ValidUsers = require("../middlewares/user.middleware");

router.get("/getAllUsers", UserController.getAllUsers);
router.post(
  "/createUser",
  ValidUsers.validUserData,
  UserController.createUsers,
);

module.exports = router;
