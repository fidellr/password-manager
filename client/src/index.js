import React from "react";
import ReactDOM from "react-dom";
import { StyleSheetManager } from "styled-components";
import { Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "easy-peasy";
import store from "./redux/password-data";
import App from "./App.js";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

function Init() {
  const history = createBrowserHistory();
  return (
    <BrowserRouter history={history}>
      <StyleSheetManager>
        <Switch>
          <StoreProvider store={store}>
            <App />
          </StoreProvider>
        </Switch>
      </StyleSheetManager>
    </BrowserRouter>
  );
}
ReactDOM.render(<Init />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
