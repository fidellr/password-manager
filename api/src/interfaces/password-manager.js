class PasswordData {
  constructor(databaseAdapter) {
    this.databaseAdapter = databaseAdapter.passwordDataInfrastructure;
  }

  async addPasswordData(passwordData, userId) {
    return await this.databaseAdapter.addPasswordData(passwordData, userId);
  }

  async updatePasswordData(id, passwordData) {
    return await this.databaseAdapter.updateByIdPasswordData(id, passwordData);
  }

  async removeByIdPasswordData(id) {
    return await this.databaseAdapter.removeByIdPasswordData(id);
  }

  async getAllPasswordData(userId) {
    return await this.databaseAdapter.getAllPasswordData(userId);
  }

  async getPasswordDataByUsernameAndPassword(username, password, userId) {
    return await this.databaseAdapter.getPasswordDataByUsernameAndPassword(
      username,
      password,
      userId
    );
  }
}

module.exports = PasswordData;
