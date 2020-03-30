import React from "react";
import styled from "styled-components";
import { Card } from "antd";

const LoginWrapper = styled.div`
  position: relative;
  z-index: 5;
  margin: auto;
  min-width: 150px;
  min-height: 200px;
  padding: 26px;
`;

function LoginCard({ title, children }) {
  return (
    <LoginWrapper>
      <Card title={title} bordered={false}>
        {children}
      </Card>
    </LoginWrapper>
  );
}

export default LoginCard;
