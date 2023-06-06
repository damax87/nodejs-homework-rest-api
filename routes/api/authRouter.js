const express = require("express");

const authController = require("../../controllers/authController")

const router = express.Router();

const {schemas} = require("../../models/registerLoginSchema");

const {validateBody, authenticate} = require("../../middleware");

router.post('/register', validateBody(schemas.registerSchema), authController.register);

router.post('/login', validateBody(schemas.loginSchema), authController.login);

router.get('/current', authenticate, authController.getCurrent);

router.post('/logout', authenticate, authController.logout);

module.exports = router;