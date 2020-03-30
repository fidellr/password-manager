const Configuration = require("../domains/configuration");

class Env {
  load() {
    const config = new Configuration();

    config.ApiVersion = process.env.API_VERSION || "1.0.0";
    config.MongodbUrl = process.env.MONGODB_URL || "mongodb://localhost:2000";
    config.NodeEnv = process.env.NODE_ENV || "development";
    config.SecretKey = process.env.SECRET_KEY || "secret";
    config.SessionExpireIn = 2 * 24 * 60 * 60;
    return config;
  }
}

module.exports = Env;
