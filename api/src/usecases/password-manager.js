const PasswordManagerDomain = require("../domains/password-manager");

class PasswordManager {
  constructor(opts) {
    this.configurationData = opts.ConfigurationData;
    this.databaseInterface = opts.DatabaseAdapter;
  }

  async addPasswordData(opts, userId) {
    if (!opts && typeof opts !== "undefined") {
      throw new Error("Missing password data information");
    }

    if (
      !opts.username.length ||
      !opts.password.length ||
      !opts.account_name.length
    ) {
      throw new Error("Missing password data information");
    }

    const passwordData = new PasswordManagerDomain();
    passwordData.username = opts.username;
    passwordData.password = opts.password;
    passwordData.account_name = opts.account_name;
    passwordData.user_id = userId;

    const addedData = await this.databaseInterface.addPasswordData(
      passwordData,
      userId
    );

    return addedData;
  }

  async updateByIdPasswordData(id, passwordData) {
    let passwordDataDomain = new PasswordManagerDomain(passwordData);
    passwordDataDomain = await this.databaseInterface.updateByIdPasswordData(
      id,
      passwordData
    );
    return passwordDataDomain;
  }

  async removeByIdPasswordData(id) {
    const isRemoved = await this.databaseInterface.removeByIdPasswordData(id);
    if (isRemoved) {
      return true;
    }

    return false;
  }

  async getAllPasswordData(userId) {
    return await this.databaseInterface.getAllPasswordData(userId);
  }

  async getPasswordDataByUsernameAndPassword(username, password, userId) {
    this.passwordData = await this.databaseInterface.getPasswordDataByUsernameAndPassword(
      username,
      password,
      userId
    );
    return this.passwordData;
  }
}

module.exports = PasswordManager;
