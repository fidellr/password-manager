/**
 * User usecases is a business logic of user
 */
const UserDomain = require("../domains/user.js");

class User {
  constructor(opts) {
    this.databaseAdapter = opts.DatabaseAdapter;
    this.configurationData = opts.ConfigurationData;
    this.authenticationInterface = opts.AuthenticationInterface;
  }

  async signUp(options) {
    if (!options && typeof options === "undefined") {
      throw new Error("Missing (Email) user information");
    }

    if (!options.email.length || !options.password.length) {
      throw new Error("Missing Email and/or password information");
    }

    let user = new UserDomain();
    user.email = options.email;
    user.password = options.password;
    user.account_name = options.account_name;

    user = await this.databaseAdapter.signUp(user);
    return user;
  }

  async signIn(payload) {
    let existingUser = await this.getByEmailAndPasswordUser(
      payload.email,
      payload.password
    );

    if (existingUser) {
      return existingUser;
    }

    return null;
  }

  async getAllUser() {
    const allUser = await this.databaseAdapter.getAllUser();
    return allUser;
  }

  async getByEmailAndPasswordUser(email, password) {
    const userLocal = await this.databaseAdapter.getByEmailAndPasswordUser(
      email,
      password
    );
    return userLocal;
  }

  // Get number of seconds until token is expired
  // This is will be used in the "expiresIn" options
  // when creating the JWT token
  // More info: https://tools.ietf.org/html/rfc7519#section-4.1.4
  // eslint-disable-next-line class-methods-use-this
  expiresOneYearFromNow() {
    const now = new Date();
    const nowInMilliseconds = now.getTime();

    const nextYearInMilliseconds = new Date(
      new Date().setFullYear(now.getFullYear() + 1)
    ).getTime();

    return (nextYearInMilliseconds - nowInMilliseconds) / 1000;
  }

  expiresTwoDayFromNow() {
    return this.configurationData.sessionExpireIn;
  }

  static toString() {
    return "User interactor";
  }
}

module.exports = User;
