const mongoose = require("mongoose");
const mongo = require("../models/mongodb/user_token");
const { generateToken } = require("../helpers/jwt");

class UserTokenInfrastructure {
  constructor() {}

  async addUserTokenData(tokenData) {
    try {
      if (typeof tokenData !== "object") return null;
      const existingToken = await this.fetch({ user_id: tokenData.user_id });
      if (existingToken.length) {
        const res = await mongo.collection.updateOne(
          {
            user_id: tokenData.user_id
          },
          {
            $set: tokenData
          }
        );
        return res;
      }

      const res = await mongo.collection.insertOne(tokenData);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  async getUserTokenByUserId(userId) {
    try {
      const trimmedUserId = userId.trim();
      const existingToken = await mongo.collection.findOne({
        user_id: trimmedUserId
      });

      if (!existingToken) return null;
      const newToken = await generateToken(
        process.env.SECRET_KEY,
        trimmedUserId
      );
      let updatedUserToken = await this.updateUserTokenByTokenId(
        existingToken._id,
        {
          token: newToken
        }
      );

      if (!updatedUserToken.result.ok) return null;
      const newUserToken = await this.fetch({ _id: existingToken._id });

      return newUserToken[0];
    } catch (err) {
      console.log(err);
    }
  }

  async getUserTokenByTokenId(tokenId) {
    try {
      if (typeof tokenId !== "string") return null;
      const existingToken = await this.fetch({
        _id: mongoose.Types.ObjectId(tokenId)
      });
      if (!existingToken.length) return null;
      const updatedUserToken = this.updateUserTokenByTokenId(tokenId, {
        user_id: existingToken[0].user_id,
        token: existingToken[0].token
      });
      return updatedUserToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async updateUserTokenByTokenId(tokenId, payload) {
    try {
      if (typeof tokenId !== "object" || typeof payload !== "object")
        return null;
      const updatedUserToken = await mongo.collection.updateOne(
        {
          _id: tokenId
        },
        { $set: payload }
      );

      if (!updatedUserToken.result.ok) return null;
      return updatedUserToken;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async removeUserTokenByUserId(userId) {
    try {
      if (typeof userId !== "string") return true;
      const isDeleted = await mongo.collection.deleteOne({ user_id: userId });
      return isDeleted.result.ok;
    } catch (err) {}
  }

  async fetch(query, limit = 10) {
    const data = await mongo.collection
      .find(query)
      .limit(limit)
      .toArray();

    return data;
  }
}

module.exports = UserTokenInfrastructure;
