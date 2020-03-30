class User {
  constructor(databaseAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  async saveUser(user) {
    user = await this.databaseAdapter.saveUser(user);
    return user;
  }

  async getAllUser() {
    return await this.databaseAdapter.getAllUser();
  }

  async getByEmailAndPassword(email, password) {
    const user = await this.databaseAdapter.getByEmailAndPassword(
      email,
      password
    );
    return user;
  }

  async isUserExists(email, password) {
    return await this.databaseAdapter.isUserExists(email, password);
  }
}

module.exports = User;
