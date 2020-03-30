import React, { useState, useEffect } from "react";
import styled from "styled-components";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { Layout } from "antd";
import { useStoreActions, useStoreState } from "easy-peasy";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  padding: 16px;
  z-index: 5;
  background: lightblue;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15) !important;
  & p {
    margin: 0;
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100%;
  padding: 24px 16px;
`;

const Paragraph = styled.p`
  color: ${props => props.color};
  font-size: ${props => (!props.fontSize ? "16px" : props.fontSize)};
  cursor: pointer;
`;

export default function LayoutContainer({ children }) {
  const [isMounted, setMounted] = useState(false);
  const logoutUserActions = useStoreActions(actions => actions.User.logoutApi);
  const resetPasswordData = useStoreActions(
    actions => actions.PasswordManager.resetPasswordData
  );
  const userTokenState = useStoreState(state => state.User.token);

  const handleLogout = async () => {
    if (!userTokenState || userTokenState.length < 1) return null;
    await logoutUserActions(userTokenState);
    await resetPasswordData();
  };

  useEffect(() => {
    nprogress.configure({ showSpinner: false });
    nprogress.start();
    if (!isMounted) {
      setMounted(true);
      return;
    }

    if (nprogress.isRendered()) {
      nprogress.done(true);
    }

    return () => {
      setMounted(false);
      nprogress.done();
      nprogress.remove();
    };
  }, [isMounted]);

  return (
    <>
      <Header className="headerLayout">
        <Paragraph>Password Manager</Paragraph>
        {userTokenState && <Paragraph onClick={handleLogout}>Logout</Paragraph>}
      </Header>
      <StyledLayout>{children}</StyledLayout>
    </>
  );
}
