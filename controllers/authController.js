const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const jimp = require("jimp");
const {nanoid} = require("nanoid");

const {User} = require("../models/user");
const {HttpError, sendEmail, cloudinary} = require("../helpers");
const {ctrlWrapper} = require("../decorators");

const {SECRET_KEY, BASE_URL} = process.env;

/// LOCAL_STORAGE ///
// const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    const verifyEmail = {
        to: email, 
        subject: "Verify Your Email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify your email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        email: newUser.email,
        password: newUser.password,
    })
}

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw HttpError(404, "User not found");
        }

    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: null});

    res.json({
        message: "Verification successful",
        })
}

const resendVerifyEmail = async (req, res) =>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(400);
    }

    if(user.verify) {
        res.status(400).json({
            message: "Verification has already been passed",
            })
    }
    const verifyEmail = {
        to: email, 
        subject: "Verify Your Email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify your email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent",
        })
}   

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if(!user.verify) {
        throw HttpError(401, "User not verifyed");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,

    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token});

    res.json({
        token,
    })
}

const getCurrent = async(req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
}

const logout = async(req, res) => {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: null});

    res.status(204).json();
}

const updateAvatar = async(req, res) => {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;

/// LOCAL_STORAGE ///
    // const filename = `${_id}_${originalname}`;
    // const resultUpload = path.join(avatarsPath, filename);
    // await fs.rename(tempUpload, resultUpload);
    // const avatarURL = path.join("avatars", filename);

await jimp
        .read(tempUpload)
        .then((avatarURL) => {
            return avatarURL.resize(250, 250)
            .write(tempUpload);
        })
        .catch((error) => {
            throw error;
        });


/// CLOUDINARY_STORAGE ///
    const fileData = await cloudinary.uploader.upload(tempUpload, {
        folder: "nodejs-homework-rest-api-avatars"
    })

    await fs.unlink(tempUpload);

    await User.findByIdAndUpdate(_id, {avatarURL: fileData.url});

    res.status(200).json({
        avatarURL: fileData.url,
    });
}


module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}