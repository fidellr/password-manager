class Configuration {
  constructor(options) {
    this.configurationInterface = options.ConfigurationInterface;
  }

  /**
   * load() is responsible for loading configuration data
   * We are loading the configuration using the interface
     Notice that we are duck typing here by assuming that interface
     that is injected has load() method
   */
  load() {
    return this.configurationInterface.load();
  }
}

module.exports = Configuration;
