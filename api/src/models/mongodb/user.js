const mongoose = require("mongoose");
const mongodb = require("../../infrastructures/mongodb");
const Bcrypt = require("../../helpers/bcrypt");

const userMongoSchema = new mongoose.Schema(
  {
    account_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { collection: "user" }
);

userMongoSchema.pre("save", function(next) {
  var user = this;
  var bcrypt = new Bcrypt();
  user.mongodb = mongodb;
  try {
    if (user.isModified(user.password)) return next();
    var hashed = bcrypt.encrypt(user.password);
    user.password = hashed;
    next(user);
  } catch (error) {
    console.log(error);
    next(user);
  }
});

module.exports = mongoose.model("User", userMongoSchema, "user");
