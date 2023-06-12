const express = require("express");

const authController = require("../../controllers/authController")

const router = express.Router();

const {schemas} = require("../../models/registerLoginSchema");

const {validateBody, authenticate, upload} = require("../../middleware");

router.post('/register', validateBody(schemas.registerSchema), authController.register);

router.get('/verify/:verificationToken', authController.verifyEmail);

router.post('/verify', validateBody(schemas.verifyEmailSchema), authController.resendVerifyEmail);

router.post('/login', validateBody(schemas.loginSchema), authController.login);

router.get('/current', authenticate, authController.getCurrent);

router.post('/logout', authenticate, authController.logout);

router.patch('/avatars', authenticate, upload.single("avatar"), authController.updateAvatar);

module.exports = router;