import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { Input, Button } from "antd";
import LayoutContainer from "../../containers/Layout";
import LoginCard from "../../components/LoginCard";
import styled from "styled-components";

const ErrorReport = styled.div`
  border: 1px solid red;
  border-radius: 2px;
  margin-bottom: 16px;
  padding: 16px;
  color: red;
`;

function SignIn() {
  const [isError, setError] = useState(false);
  const [userLocal, setUser] = useState({});
  const userState = useStoreState(state => state.User);
  const signingInUserApi = useStoreActions(actions => actions.User.signInApi);
  const loadingUserActions = useStoreActions(
    actions => actions.User.loading.setLoading
  );

  const handleSubmitLogin = async () => {
    if (!Object.keys(userLocal).length) {
      setError(true);
      return;
    }

    for (const key in userLocal) {
      if (userLocal.hasOwnProperty(key)) {
        if (userLocal[key].length < 1) {
          setError(true);
          return;
        }
      }
    }

    try {
      await signingInUserApi(userLocal);
      if (isError) setError(false);
    } catch (error) {
      setError(true);
      loadingUserActions(false);
    }
  };

  const handleChange = (value, key) => {
    switch (key) {
      case "email":
        setUser({ ...userLocal, email: value });
        return;
      case "password":
        setUser({ ...userLocal, password: value });
        return;
      case "account_name":
        setUser({ ...userLocal, account_name: value });
        return;
      default:
        return;
    }
  };

  const loading =
    userState !== null && userState.loading.is_loading === true ? true : false;

  return (
    <LayoutContainer>
      <LoginCard title="Sign In">
        {isError && (
          <ErrorReport>Wrong email / password, please try again.</ErrorReport>
        )}
        <Input
          placeholder="Email"
          onChange={e => handleChange(e.target.value, "email")}
          onPressEnter={handleSubmitLogin}
          required
        />
        <Input.Password
          style={{ margin: "16px 0" }}
          placeholder="Password"
          onChange={e => handleChange(e.target.value, "password")}
          onPressEnter={handleSubmitLogin}
          required
        />
        <Button loading={loading} type="default" onClick={handleSubmitLogin}>
          Sign In
        </Button>
        <Link to="/sign-up">
          <Button type="link">Don't have an account yet?</Button>
        </Link>
      </LoginCard>
    </LayoutContainer>
  );
}

export default SignIn;
