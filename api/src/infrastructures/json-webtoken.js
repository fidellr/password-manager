const { sign, verify } = require("jsonwebtoken");

class Jsonwebtoken {
  static generate(options) {
    const tokenOptsInfo = {
      algorithm: "HS256",
      expiresIn: options.expiration
    };

    return sign(options.tokenPayload, options.secret, tokenOptsInfo);
  }

  static validateTokenExpiration(token, secretKey) {
    const tokenData = verify(token, secretKey);
    return tokenData;
  }
}

module.exports = Jsonwebtoken;
