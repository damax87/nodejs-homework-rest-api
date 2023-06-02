const express = require("express");

const authController = require("../../controllers/authController")

const router = express.Router();

const {schemas} = require("../../models/user");

const {validateBody} = require("../../decorators");

router.post('/register', validateBody(schemas.registerSchema), authController.register);

router.post('/login', validateBody(schemas.loginSchema), authController.login);

module.exports = router;