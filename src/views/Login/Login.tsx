import { RightOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Typography, Button } from "antd";
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

export const Login: React.FunctionComponent = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleAuth0Login = (): void => {
    setLoading(true);
    loginWithRedirect();
  };

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
          <Title level={3} id="login-title">
            Welcome back to Flex!
          </Title>
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
                <Button
                  id="login-button"
                  type="primary"
                  htmlType="submit"
                  key="login"
                  loading={loading}
                  onClick={() => handleAuth0Login()}
                >
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
