import { RightOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Typography, Button } from "antd";
import React from "react";
import { useState } from "react";

const { Title } = Typography;

export const Login: React.FunctionComponent = () => {
  const { loginWithRedirect } = useAuth0();
  const [loading, setLoading] = useState(false);

  const handleAuth0Login = (): void => {
    setLoading(true);
    loginWithRedirect();
  };

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
