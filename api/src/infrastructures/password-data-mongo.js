const passwordDataMongo = require("../models/mongodb/password-data");
const UserMongo = require("../models/mongodb/user");
const mongoose = require("mongoose");
const Bcrypt = require("../helpers/bcrypt");

class PasswordDataInfrastructure {
  constructor() {
    this.passwordDataMongo = new passwordDataMongo();
    this.userMongo = new UserMongo();
    this.allPasswordData = null;
    this.bcrypt = new Bcrypt();
  }

  async addPasswordData(passwordData, userId) {
    try {
      const { account_name, username, password } = passwordData;
      const existingUser = await this.userMongo.collection.findOne({
        _id: mongoose.Types.ObjectId(userId)
      });
      if (!existingUser) return null;

      const existingPasswordData = await this.fetch({
        username
      });

      if (existingPasswordData && existingPasswordData.length) {
        return null;
      }

      const encryptedMessage = this.bcrypt.encrypt(password);
      passwordData.password = encryptedMessage;

      await this.passwordDataMongo.collection.insertOne(passwordData);
      return passwordData;
    } catch (err) {
      console.error(err);
    }
  }

  async updateByIdPasswordData(id, passwordData) {
    try {
      const encryptedMessage = this.bcrypt.encrypt(passwordData.password);
      const _id = mongoose.Types.ObjectId(id);
      let existingPasswordData = await this.passwordDataMongo.collection.findOne(
        {
          _id
        }
      );

      if (existingPasswordData) {
        passwordData.password = encryptedMessage;
        existingPasswordData = { ...passwordData, ...existingPasswordData };
        const res = await this.passwordDataMongo.collection.updateOne(
          { _id },
          { $set: passwordData },
          { multi: true, new: true }
        );
        if (res.ok) return existingPasswordData;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async removeByIdPasswordData(id) {
    try {
      const {
        deletedCount
      } = await this.passwordDataMongo.collection.deleteOne({
        _id: mongoose.Types.ObjectId(id)
      });
      if (deletedCount === 1) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAllPasswordData(userId) {
    this.allPasswordData = await this.fetch({ user_id: userId });
    return this.allPasswordData;
  }

  async getPasswordDataByUsernameAndPassword(
    username = "",
    password = "",
    userId
  ) {
    const decryptedMessage = this.bcrypt.decrypt(password);
    let passwordData = await this.fetch({
      username: username,
      user_id: userId
    });

    if (passwordData.length) {
      const exisingDecryptedPassword = this.bcrypt.decrypt(
        passwordData[0].password
      );
      if (
        exisingDecryptedPassword &&
        exisingDecryptedPassword !== decryptedMessage
      )
        return null;
      const payload = {
        ...passwordData[0],
        password: exisingDecryptedPassword
      };

      return payload;
    }

    return null;
  }

  async fetch(query) {
    const data = await this.passwordDataMongo.collection.find(query).toArray();
    return data;
  }
}

module.exports = PasswordDataInfrastructure;
