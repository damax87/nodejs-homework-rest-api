const {Schema, model} = require("mongoose");
const {handleMongooseError} = require("../helpers");

// eslint-disable-next-line no-useless-escape
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: emailRegexp,
      },

    password: {
        type: String,
        required: [true, 'Password is required'],
      },
      
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      
    token: {
        type: String,
        default: null,
      },

    avatarURL: {
        type: String,
        required: true,
      },

    verify: {
        type: Boolean,
        default: false,
      },

    verificationToken: {
        type: String,
        default: null,
        required: [true, 'Verify token is required'],
      },
}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError);

  const User = model("user", userSchema);

  module.exports = {
    User,
  }