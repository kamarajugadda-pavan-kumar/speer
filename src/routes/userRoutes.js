// src/routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/api/auth/signup", userController.signUpUser);
router.post("/api/auth/login", userController.loginUser);

module.exports = router;
