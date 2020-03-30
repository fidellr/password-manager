class Configuration {
  constructor(opts) {
      this.configurationAdapter = opts.ConfigurationAdapter;
  }

  load() {
      return this.configurationAdapter.load();
  }
}

module.exports = Configuration;
