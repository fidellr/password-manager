class Config {
  get MongodbUrl() {
    return this.mongodbUrl;
  }
  set MongodbUrl(url) {
    this.mongodbUrl = url;
  }

  get NodeEnv() {
    return this.nodeEnv;
  }
  set NodeEnv(environment) {
    this.nodeEnv = environment;
  }

  set SecretKey(secretKey) {
    this.secretKey = secretKey;
  }
  get SecretKey() {
    return this.secretKey;
  }

  set ApiVersion(apiVersion) {
    this.apiVersion = apiVersion;
  }

  get ApiVersion() {
    return this.apiVersion;
  }

  set SessionExpireIn(exp) {
    this.sessionExpireIn = exp;
  }

  get SessionExpireIn() {
    return this.sessionExpireIn;
  }

  /**
   * toString() print out all the configuration data in easy to read format
   */
  toString() {
    const output = {
      MongodbUrl: this.mongodbUrl,
      NodeEnv: this.nodeEnv,
      SecretKey: this.secretKey,
      ApiVersion: this.apiVersion,
      SessionExpireIn: this.sessionExpireIn
    };

    return JSON.stringify(output, null, 2);
  }
}

module.exports = Config;
