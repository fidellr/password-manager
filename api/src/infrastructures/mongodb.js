const UserInfrastructure = require("./user-mongo");
const PasswordDataInfrastructure = require("./password-data-mongo");
const UserTokenInfrastructure = require("./user_token_mongo")

class MongoDb {
  constructor() {
    this.userInfrastructure = new UserInfrastructure();
    this.passwordDataInfrastructure = new PasswordDataInfrastructure();
    this.userTokenInfrastructure = new UserTokenInfrastructure();
  }
}

module.exports = MongoDb;
