const uuidV4 = require("uuid/v4");

class UUID {
  static generate() {
    return uuidV4();
  }
}

module.exports = UUID;
