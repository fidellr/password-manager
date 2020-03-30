class Authentication {
  constructor(options) {
    this.uniqueIdAdapter = options.UniqueIdAdapter;
    this.webTokenAdapter = options.WebTokenAdapter;
  }

  getNewUserId() {
    return this.uniqueIdAdapter.generate();
  }

  validateTokenExpiration(token, secretKey) {
    return this.webTokenAdapter.validateTokenExpiration(token, secretKey);
  }

  getNewWebToken(options) {
    return this.webTokenAdapter.generate(options);
  }
}

module.exports = Authentication;
