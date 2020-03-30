const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
const { verifyTokenExpiration } = require("../helpers/jwt");

class ExpressServer {
  constructor(options) {
    this.app = express();
    this.token = "";
    this.databaseInterface = options.databaseInterface;
    this.webserverInterface = options.webServerInterface;
    this.userInteractor = options.userInteractor;
    this.passwordManagerInteractor = options.passwordManagerInteractor;
    this.userTokenInteractor = options.userTokenInteractor;
    this.tokenData = null;

    const corsOpts = {
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: "Content-Type,Authorization"
    };
    this.app.use(cors(corsOpts));
    this.app.use(express.json());
    this.app.use(timeout(5000), bodyParser.urlencoded({ extended: true }));
  }

  static toString() {
    return "Express server infra";
  }

  async forceToLogin(req, res, next) {
    const header = await req.header("Authorization");
    if (!header) {
      return res
        .status(403)
        .send({ message: "Unauthorized user, please login" });
    }

    if (header) {
      const token = await header.replace("Bearer", "");
      if (!token || !token.length) {
        return res
          .status(403)
          .send({ message: "Unauthorized user, please login" });
      }

      const tokenData = verifyTokenExpiration(token);
      if (!tokenData) {
        req.tokenData = null;
        next();
      }

      req.tokenData = tokenData;
    }

    next();
  }

  start() {
    this.app.get("/", async (_, res) => {
      const version = this.webserverInterface.displayApiVersion();
      res.status(200).send(version);
    });

    /**
     * User HTTP Delivery
     */
    this.app.post("/sign-up", async (req, res) => {
      const body = req.body;
      if (!body) return res.status(403).send({ message: "required body" });
      const newUser = await this.userInteractor.signUp(body);
      if (!newUser) {
        return res.status(403).send({ message: "User is exists" });
      }

      const newUserToken = await this.userTokenInteractor.addUserTokenData({
        user_id: newUser._id
      });

      res.setHeader("Authorization", `Bearer ${newUserToken.token}`);
      res.status(200).send(newUser);
    });

    this.app.post("/sign-in", async (req, res) => {
      const body = req.body;
      if (!body) return res.status(403).send({ message: "required body" });

      const existingUser = await this.userInteractor.signIn(body);
      if (existingUser) {
        const existingUserToken = await this.userTokenInteractor.getUserTokenByUserId(
          existingUser._id.toString()
        );

        if (!existingUserToken) {
          const newUserToken = await this.userTokenInteractor.addUserTokenData({
            user_id: existingUser._id.toString()
          });
          if (!newUserToken)
            return res.status(500).send({ message: "failed to create token" });

          res.setHeader("Authorization", `Bearer ${newUserToken.token}`);
          return res.status(200).send(existingUser);
        }

        res.setHeader("Authorization", `Bearer ${existingUserToken.token}`);
        return res.status(200).send(existingUser);
      }

      res.status(404).send({ message: "Unregistered user" });
    });

    this.app.get("/all-user", this.forceToLogin, async (req, res) => {
      const email = req.query.email;
      const password = req.query.password;
      let users = null;
      const currentUser = await this.userTokenInteractor.getUserTokenByUserId(
        req.tokenData.id
      );
      if (!email || !email.length || !password || !password.length) {
        if (!currentUser)
          return res.status(403).send({ message: "Unknown user token" });
        users = await this.userInteractor.getAllUser();
        res.setHeader("Authorization", `Bearer ${currentUser.token}`);
        return res.status(200).send(users);
      }

      users = await this.userInteractor.getByEmailAndPasswordUser(
        email,
        password
      );
      if (!users) {
        return res.status(404).send({ message: "User not found" });
      }

      res.setHeader("Authorization", `Bearer ${currentUser.token}`);
      return res.status(503).send({ message: "Failed to request" });
    });

    this.app.post("/logout", this.forceToLogin, async (req, res) => {
      if (!req.tokenData)
        return res.status(403).send({ message: "Missing / Incorrect token" });

      const isLogout = await this.userTokenInteractor.removeUserTokenByUserId(
        req.tokenData.id
      );
      if (!isLogout) {
        return res
          .status(404)
          .send({ message: "Incorrect ID / Unregister user" });
      }

      return res.status(200).send();
    });
    /**
     *  Password Data HTTP Delivery
     */
    this.app.post("/add-password-data", this.forceToLogin, async (req, res) => {
      //** TODO: RESTRICT DUPLICATE DATA (USERNAME) **//
      if (!req.tokenData)
        return res.status(403).send({ message: "Missing / incorrect token" });

      const currentUserTokenData = await this.userTokenInteractor.getUserTokenByUserId(
        req.tokenData.id
      );
      if (!currentUserTokenData)
        return res.status(403).send({ message: "Unknown user token" });

      let passwordData = null;
      const body = req.body;

      if (!body) {
        return res.status(403).send({ message: "Required body" });
      }

      const accountName = body.account_name;
      const username = body.username;
      const password = body.password;

      if (
        !accountName ||
        !accountName.length ||
        !username ||
        !username.length ||
        !password ||
        !password.length
      ) {
        return res.status(400).send({ message: "Missing values" });
      }

      passwordData = await this.passwordManagerInteractor.addPasswordData(
        body,
        req.tokenData.id
      );
      if (!passwordData) {
        return res
          .status(409)
          .send({ message: "Your requested data is exists" });
      }

      res.setHeader("Authorization", `Bearer ${currentUserTokenData.token}`);
      return res.status(200).send(passwordData);
    });

    this.app.get("/all-password-data", this.forceToLogin, async (req, res) => {
      if (!req.tokenData)
        return res.status(403).send({ message: "Missing / incorrect token" });

      const currentUserTokenData = await this.userTokenInteractor.getUserTokenByUserId(
        req.tokenData.id
      );
      if (!currentUserTokenData)
        return res.status(403).send({ message: "Unknown user token" });

      const query = req.query;
      const username = query.username;
      const password = query.password;
      if (username || password) {
        const passwordData = await this.passwordManagerInteractor.getPasswordDataByUsernameAndPassword(
          username,
          password,
          req.tokenData.id
        );
        if (!passwordData) return res.status(200).send([]);
        if (passwordData.length > 0) {
          res.setHeader(
            "Authorization",
            `Bearer ${currentUserTokenData.token}`
          );
          return res.status(200).send(passwordData[0]);
        }

        res.setHeader("Authorization", `Bearer ${currentUserTokenData.token}`);
        return res.status(200).send(passwordData);
      }

      const passwordData = await this.passwordManagerInteractor.getAllPasswordData(req.tokenData.id);

      res.setHeader("Authorization", `Bearer ${currentUserTokenData.token}`);
      return res.status(200).send(passwordData);
    });

    this.app.put(
      "/password-data/:password_id",
      this.forceToLogin,
      async (req, res) => {
        if (!req.tokenData)
          return res.status(403).send({ message: "Missing / incorrect token" });

        const currentUser = await this.userTokenInteractor.getUserTokenByUserId(
          req.tokenData.id
        );
        if (!currentUser)
          return res.status(403).send({ message: "Unknown user token" });

        const passwordDataId = req.params.password_id;
        const body = req.body;
        if (passwordDataId && passwordDataId.length && body) {
          const passwordData = await this.passwordManagerInteractor.updateByIdPasswordData(
            passwordDataId,
            body
          );
          if (passwordData) {
            res.setHeader("Authorization", `Bearer ${currentUser.token}`);
            return res.status(200).send(passwordData);
          }
          res.setHeader("Authorization", `Bearer ${currentUser.token}`);
          return res.status(200).send({});
        }

        return res.status(403).send({ message: "Missing password data's id" });
      }
    );

    this.app.delete(
      "/password-data/:id",
      this.forceToLogin,
      async (req, res) => {
        if (!req.tokenData)
          return res.status(403).send({ message: "Missing / incorrect token" });

        const currentUser = await this.userTokenInteractor.getUserTokenByUserId(
          req.tokenData.id
        );
        if (!currentUser)
          return res.status(403).send({ message: "Unknown user token" });

        const id = req.params.id;
        if (id && id.length) {
          const isRemoved = await this.passwordManagerInteractor.removeByIdPasswordData(
            id
          );
          if (isRemoved) {
            res.setHeader("Authorization", `Bearer ${currentUser.token}`);
            return res.status(200).send();
          }
          return res
            .status(403)
            .send({ message: "Cannot find requested data" });
        }
      }
    );

    this.app.listen(3001, () => {
      console.log("Password-generator app listening on port 3001!");
    });
  }
}

module.exports = ExpressServer;
