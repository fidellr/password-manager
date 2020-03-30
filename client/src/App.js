import React, { useState, useEffect, useCallback } from "react";
import { Route, Redirect } from "react-router-dom";
import routes from "./routes";
import { useStoreState, useStoreActions } from "easy-peasy";
import { get } from "js-cookie";
import "antd/dist/antd.css";

function App(props) {
  const appAddCurrentPathAction = useStoreActions(
    actions => actions.App.addCurrentPath
  );
  const appAddScreenWidthAction = useStoreActions(
    actions => actions.App.addScreenWidth
  );
  const appAddScreenHeightAction = useStoreActions(
    actions => actions.App.addScreenHeight
  );
  const appDetectBrowserDevice = useStoreActions(
    actions => actions.App.getCurrentBrowserDevice
  );
  const userAddProfile = useStoreActions(actions => actions.User.addProfile);
  const userAddToken = useStoreActions(actions => actions.User.addToken);

  const userState = useStoreState(state => state.User.data);
  const userTokenState = useStoreState(state => state.User.token);
  const appScreenHeightState = useStoreState(state => state.App.screen_height);
  const appScreenWidthState = useStoreState(state => state.App.screen_width);

  const [isLoggedIn, setLogin] = useState(false);
  const initConfig = useCallback(() => {
    if (
      window === true ||
      appScreenHeightState < 1 ||
      appScreenWidthState < 1
    ) {
      appDetectBrowserDevice();
      appAddCurrentPathAction(window.location.pathname);
      appAddScreenHeightAction(window.innerHeight);
      appAddScreenWidthAction(window.innerWidth);
    }
  }, [
    appAddCurrentPathAction,
    appAddScreenHeightAction,
    appAddScreenWidthAction,
    appDetectBrowserDevice,
    appScreenHeightState,
    appScreenWidthState
  ]);

  useEffect(() => {
    initConfig();
    window.addEventListener("resize", initConfig);

    const userCookie = get("xen-user");
    const isUserSignedIn = !userTokenState && userCookie && userCookie.length;
    if (isUserSignedIn) {
      const user = JSON.parse(userCookie);
      const { _id, email, password, account_name } = user.data;
      userAddProfile({ _id, email, password, account_name });
      userAddToken(user.token);
      setLogin(true);
      return;
    }

    if (userState._id.length < 1 && !userTokenState && !userCookie) {
      setLogin(false);
      return;
    }

    return () => {
      window.removeEventListener("resize", initConfig);
    };
  }, [initConfig, userAddProfile, userAddToken, userState, userTokenState]);

  useEffect(() => {
    if (userTokenState) {
      setLogin(true);
    }
  }, [userTokenState]);

  const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/sign-in", state: { from: props.location } }}
          />
        )
      }
    />
  );

  const PublicRoute = ({ component: Component, isLoggedIn, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        !isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );

  return (
    <main className="main">
      {routes.map((route, i) =>
        route.isPrivate ? (
          <PrivateRoute
            key={`${route.path}-${i}`}
            isLoggedIn={isLoggedIn}
            {...route}
          />
        ) : (
          <PublicRoute
            key={`${route.path}-${i}`}
            isLoggedIn={isLoggedIn}
            {...route}
          />
        )
      )}
    </main>
  );
}

export default App;
