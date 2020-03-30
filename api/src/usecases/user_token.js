const { verifyTokenExpiration } = require("../helpers/jwt");

class UserToken {
  constructor(opts) {
    this.configurationData = opts.ConfigurationData;
    this.databaseAdapter = opts.DatabaseAdapter;
    this.authenticationInterface = opts.AuthenticationInterface;
  }

  async verifyTokenExpiration(opts) {
    if (!opts && typeof opts === "undefined")
      throw new Error("Missing parameter");

    const tokenData = verifyTokenExpiration(opts.token, opts.secretKey);
    if (tokenData instanceof Object) {
      if (userId === opts.userId) {
        return tokenData;
      }
    }

    return null;
  }

  async addUserTokenData(opts) {
    const stringifiedUserId = opts.user_id.toString();
    const payload = {
      user_id: stringifiedUserId,
      token: this.authenticationInterface.getNewWebToken({
        tokenPayload: {
          id: stringifiedUserId
        },
        secret: this.configurationData.SecretKey,
        expiration: this.configurationData.sessionExpireIn
      })
    };

    await this.databaseAdapter.addUserTokenData(payload);
    return payload;
  }

  async getUserTokenByUserId(userId = "") {
    const isValidObjectId = userId.match(/^[0-9a-fA-F]{24}$/);
    if (!isValidObjectId) return null;
    const userTokenData = await this.databaseAdapter.getUserTokenByUserId(
      userId
    );
    return userTokenData;
  }

  async getUserTokenByTokenId(tokenId) {
    const userTokenData = await this.databaseAdapter.getUserTokenByTokenId(
      tokenId
    );
    return userTokenData;
  }

  async removeUserTokenByUserId(userId) {
    const isValidObjectId = userId.match(/^[0-9a-fA-F]{24}$/);
    if (!isValidObjectId) return false;
    const isDeleted = await this.databaseAdapter.removeUserTokenByUserId(
      userId
    );
    return isDeleted;
  }
}

module.exports = UserToken;
