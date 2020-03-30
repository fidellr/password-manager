class WebServer {
  constructor(opts) {
    this.versionInteractor = opts.versionInteractor;
  }

  displayApiVersion() {
    return this.versionInteractor.display();
  }

  static toString() {
    return "WebServer Interfaces";
  }
}

module.exports = WebServer;
