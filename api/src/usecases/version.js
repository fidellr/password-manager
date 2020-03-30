/**
 * Version usecase is a business logic of version
 */
const VersionDomain = require("../domains/version");

class Version {
  constructor(opts) {
    this.versionDomain = VersionDomain;
    this.versionData = opts.versionData;
  }

  static toString() {
    return "Version use case";
  }

  display() {
    const output = this.versionDomain.toString(this.versionData);
    return output;
  }
}

module.exports = Version;
