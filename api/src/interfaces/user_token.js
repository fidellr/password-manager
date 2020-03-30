class UserToken {
  constructor(databaseAdapter) {
    this.databaseAdapter = databaseAdapter;
  }

  async addUserTokenData(opts) {
    const tokenData = await this.databaseAdapter.addUserTokenData(opts);
    return tokenData;
  }

  async getUserTokenByUserId(userId) {
    const tokenData = await this.databaseAdapter.getUserTokenByUserId(userId);
    return tokenData;
  }

  async getUserTokenByTokenId(tokenId) {
    const tokenData = await this.databaseAdapter.getUserTokenByTokenId(tokenId);
    return tokenData;
  }

  async removeUserTokenByUserId(userId) {
    const isDeleted = await this.databaseAdapter.removeUserTokenByUserId(
      userId
    );
    return isDeleted;
  }
}

module.exports = UserToken;
