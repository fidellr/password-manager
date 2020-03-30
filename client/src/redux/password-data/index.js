import { createStore } from "easy-peasy";
import app from "./app/store";
import user from "./user/store";
import passwordManager from "./password-manager/store";

const appStore = app;
const userStore = user;
const passwordManagerStore = passwordManager;
const store = createStore({
  App: appStore,
  User: userStore,
  PasswordManager: passwordManagerStore
});

export default store;
