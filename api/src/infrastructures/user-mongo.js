const UserMongo = require("../models/mongodb/user");
const Bcrypt = require("../helpers/bcrypt");

class UserInfrastructure {
  constructor() {
    this.allUser = null;
    this.existingUser = null;
    this.bcrypt = new Bcrypt();
    this.userMongo = new UserMongo();
  }

  async signUp(userPayload) {
    try {
      this.bcrypt = new Bcrypt(userPayload.password);
      const users = await this.fetch({
        email: userPayload.email
      });

      if (users.length > 0) return null;

      if (userPayload.password.length) {
        const hashedPassword = this.bcrypt.encrypt(userPayload.password);
        userPayload.password = hashedPassword;
        await this.userMongo.collection.insertOne(userPayload);
        return userPayload;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async updateUser(id) {
    const user = await this.userMongo.updateOne({ _id: id });
    return user;
  }

  async getAllUser() {
    this.allUser = await this.userMongo.collection.find({}).toArray();
    return this.allUser;
  }

  async getByEmailAndPasswordUser(email, password) {
    this.existingUser = await this.fetch({ email });
    if (this.existingUser && this.existingUser.length) {
      const decryptedMessage = this.bcrypt.decrypt(this.existingUser[0].password);
      if (password === decryptedMessage) {
        const user = this.existingUser[0];
        user.password = this.existingUser[0].password;
        return user;
      }
    }

    return null;
  }

  async logout(email) {
    this.existingUser = await this.fetch({ email });
    if (this.existingUser.length) {
      if (this.existingUsers[0].email === email) return true;
    }

    return false;
  }

  async fetch(query) {
    const data = await this.userMongo.collection.find(query).toArray();
    return data;
  }
}

module.exports = UserInfrastructure;
