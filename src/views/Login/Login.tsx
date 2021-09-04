import { RightOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Typography, Form, Input, Button } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

export const Login: React.FunctionComponent = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const history = useHistory();

  if (isAuthenticated) {
    history.push("/home");
  }

  return (
    <>
      <Row
        style={{
          marginBottom: "40px",
        }}
      >
        <Col md={24}>
          <Title level={3}>Welcome back to Flex!</Title>
        </Col>
      </Row>
      <Row>
        <Col
          md={24}
          style={{
            paddingRight: "16px",
          }}
        >
          <Row>
            <Col md={24}>
              <Row>
                <Button type="primary" htmlType="submit" key="login" onClick={() => loginWithRedirect()}>
                  Login
                  <RightOutlined />
                </Button>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
