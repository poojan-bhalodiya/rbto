const express = require("express");
const authController = require("../controller/auhController.js");

const router = express.Router();

router.post("/register",authController.createUser);

module.exports = router;
