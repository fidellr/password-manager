const { verify, sign } = require("jsonwebtoken");

const verifyTokenExpiration = (token = "", secretKey = "secret") => {
  try {
    if (!token.length || (secretKey && !secretKey.length)) return null;
    const tokenData = verify(token.trim(), secretKey);
    return tokenData;
  } catch (err) {
    return null;
  }
};

const generateToken = (secretKey = "secret", userId = "") => {
  if (!secretKey || !secretKey.length || !userId.length) return null;
  const tokenOptsInfo = {
    algorithm: "HS256",
    expiresIn: process.env.SESSION_LIFETIME || 2 * 24 * 60 * 60 // two days
  };
  const tokenPayload = {
    id: userId
  };

  const generatedToken = sign(tokenPayload, secretKey, tokenOptsInfo);
  if (!generateToken) return null;
  return generatedToken;
};

module.exports = {
  verifyTokenExpiration,
  generateToken
};
