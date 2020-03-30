const mongoose = require("mongoose");
const userMongoModel = require("../models/mongodb/user");
const UserDatabaseInterface = require("./user");
const PasswordDatabaseInterface = require("./password-manager");
const UserTokenDatabaseInterface = require("./user_token");

class Database {
  constructor(opts) {
    this.db = null;
    this._connect();
    this._createCollection();
    this.databaseAdapter = opts.DatabaseAdapter;
    this.userMongoModel = userMongoModel;
    this.userInterfaces = new UserDatabaseInterface(this.databaseAdapter);
    this.passwordDataInterfaces = new PasswordDatabaseInterface(
      this.databaseAdapter
    );
    this.userTokenInterfaces = new UserTokenDatabaseInterface(
      this.databaseAdapter
    );
  }

  _connect() {
    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Database connection successful");
        this.db = mongoose.connection;
      })
      .catch(err => console.log(`Database connection error \n[ERROR]: ${err}`));
  }

  _createCollection() {
    this.db = mongoose.connection;
    if (Object.keys(this.db.collections).length > 0) return;

    this.userMongoModel.createCollection();
  }
}

module.exports = Database;
