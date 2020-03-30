const mongoose = require("mongoose");
const mongodb = require("../../infrastructures/mongodb");
const Bcrypt = require("../../helpers/bcrypt");

const passwordDataMongoSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true
    },
    account_name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { collection: "password_data" }
);

passwordDataMongoSchema.pre("save", function(next) {
  const passwordData = this;
  const bcrypt = new Bcrypt();
  passwordData.mongodb = mongodb;
  try {
    if (passwordData.isModified("password")) {
      const hashed = bcrypt.encrypt(passwordData.password);
      passwordData.password = hashed;
    }
  } catch (error) {
    console.log(error);
  }
  next();
});

module.exports = mongoose.model(
  "PasswordData",
  passwordDataMongoSchema,
  "password_data"
);
