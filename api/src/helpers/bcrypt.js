const Cryptr = require("cryptr");
const Env = require("../infrastructures/environment-variables");
const env = new Env();

class Bcrypt {
  constructor(password) {
    this.password = password;
    this.env = env.load();
    this.cryptr = new Cryptr(this.env.secretKey);
  }

  encrypt(password = "") {
    const encryptedPassword = this.cryptr.encrypt(password);
    if (typeof encryptedPassword === "string") {
      return encryptedPassword;
    }
    return false;
  }

  decrypt(hashedPassword = "") {
    const decryptedPassword = this.cryptr.decrypt(hashedPassword);
    if (typeof decryptedPassword === "string") {
      return decryptedPassword;
    }
    return false;
  }
}

module.exports = Bcrypt;
