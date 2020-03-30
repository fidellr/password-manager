const mongoose = require("mongoose");

const userTokenMongoSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    },
    user_id: {
      type: String,
      required: true
    }
  },
  { collection: "user_token" }
);

module.exports = mongoose.model(
  "UserToken",
  userTokenMongoSchema,
  "user_token"
);
