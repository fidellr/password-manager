const EnvironmentVariables = require("./infrastructures/environment-variables");
const ExpressWebServer = require("./infrastructures/express-server");
const JsonWebToken = require("./infrastructures/json-webtoken");
const MongoDb = require("./infrastructures/mongodb");
const UUID = require("./infrastructures/uuid");

const AuthenticationInterface = require("./interfaces/authentication");
const ConfigurationInterface = require("./interfaces/configuration");
const DatabaseInterface = require("./interfaces/database");
const WebServerInterface = require("./interfaces/webserver");

const ConfigurationInteractor = require("./usecases/configuration");
const VersionInteractor = require("./usecases/version");
const UserInteractor = require("./usecases/user");
const PasswordManagerInteractor = require("./usecases/password-manager");
const UserTokenInteractor = require("./usecases/user_token");

const environmentVariables = new EnvironmentVariables();
const configurationInterface = new ConfigurationInterface({
  ConfigurationAdapter: environmentVariables
});
const configurationInteractor = new ConfigurationInteractor({
  ConfigurationInterface: configurationInterface
});

const configurationData = configurationInteractor.load();
const authenticationInterface = new AuthenticationInterface({
  UniqueIdAdapter: UUID,
  WebTokenAdapter: JsonWebToken
});
const mongoDb = new MongoDb();
const databaseInterface = new DatabaseInterface({
  DatabaseAdapter: mongoDb
});

const userInteractor = new UserInteractor({
  ConfigurationData: configurationData,
  AuthenticationInterface: authenticationInterface,
  DatabaseAdapter: databaseInterface.databaseAdapter.userInfrastructure
});

const passwordManagerInteractor = new PasswordManagerInteractor({
  ConfigurationData: configurationData,
  DatabaseAdapter: databaseInterface.databaseAdapter.passwordDataInfrastructure
});

const userTokenInteractor = new UserTokenInteractor({
  ConfigurationData: configurationData,
  DatabaseAdapter: databaseInterface.databaseAdapter.userTokenInfrastructure,
  AuthenticationInterface: authenticationInterface
});

const versionInteractor = new VersionInteractor({
  versionData: configurationData.apiVersion
});
const webserverInterface = new WebServerInterface({
  versionInteractor: versionInteractor
});

const expressWebServer = new ExpressWebServer({
  webServerInterface: webserverInterface,
  userInteractor: userInteractor,
  passwordManagerInteractor: passwordManagerInteractor,
  userTokenInteractor: userTokenInteractor,
  databaseInterface: databaseInterface
});
expressWebServer.start();
