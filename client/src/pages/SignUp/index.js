import React, { useState } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import LayoutContainer from "../../containers/Layout";
import LoginCard from "../../components/LoginCard";
import { Input, Button } from "antd";
import styled from "styled-components";

const ErrorReport = styled.div`
  border: 1px solid red;
  border-radius: 2px;
  margin-bottom: 16px;
  padding: 16px;
  color: red;
`;

function SignUp() {
  const [isError, setError] = useState(false);
  const [userLocal, setUser] = useState({});
  const userState = useStoreState(state => state.User);
  const signingUpUserApi = useStoreActions(
    actions => actions.User.addProfileApi
  );

  const handleChange = (key, value) => {
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

  const handleSubmitSignUp = async () => {
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
      await signingUpUserApi(userLocal);
    } catch (err) {
      console.log(err);
    }
  };

  const loading =
    userState !== null && userState.loading.is_loading === true ? true : false;

  return (
    <LayoutContainer>
      <LoginCard title="Sign Up">
        {isError && (
          <ErrorReport>Cannot enter empty field, please check again.</ErrorReport>
        )}
        <Input
          style={{ marginBottom: "16px" }}
          placeholder="Email"
          onChange={e => handleChange("email", e.target.value)}
          required
        />
        <Input
          placeholder="Account Name"
          onChange={e => handleChange("account_name", e.target.value)}
          required
        />
        <Input.Password
          style={{ margin: "16px 0" }}
          placeholder="Password"
          onChange={e => handleChange("password", e.target.value)}
          required
        />
        <Button loading={loading} type="default" onClick={handleSubmitSignUp}>
          Sign Up
        </Button>
      </LoginCard>
    </LayoutContainer>
  );
}

export default SignUp;
