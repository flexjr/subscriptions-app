import { RightOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Typography, Form, Input, Button, Checkbox, Alert } from "antd";
import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { useFlex } from "../../hooks";
import { API_URL, AUTH0_API_AUDIENCE, postData } from "../../shared";

const { Title } = Typography;

export const Onboarding: React.FunctionComponent = () => {
  const [continueIsEnabled, setContinueIsEnabled] = useState(true);
  const { getAccessTokenSilently } = useAuth0();
  const { setIsOnboarded } = useFlex();
  const history = useHistory();

  if (localStorage.getItem("isOnboarded") === "true") {
    return <Redirect to="/flex/dashboard" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any): void => {
    console.log("Form logger:", values);

    const onboardOrgAndUser = async (): Promise<{ message } | undefined> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      return await postData<{ message }>(`${API_URL}/organizations/onboarding`, accessToken, signal, values)
        .then(({ message }) => {
          localStorage.setItem("isOnboarded", "true");
          setIsOnboarded(true);
          history.go(0);
          // history.push("/flex/dashboard");
          return { message };
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });
    };

    onboardOrgAndUser();
  };

  const toggleContinue = (): void => {
    setContinueIsEnabled(!continueIsEnabled);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Row
        style={{
          marginBottom: "16px",
        }}
      >
        <Col md={24}>
          <Title level={3}>Let’s begin your journey with Flex!</Title>
        </Col>
      </Row>
      <Row>
        <Col
          md={24}
          style={{
            marginBottom: "16px",
          }}
        >
          <Alert message="This is a demo app and no KYC will be performed." type="info" banner />
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
                <Form
                  name="basic"
                  layout="vertical"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Row>
                    <Col
                      md={12}
                      style={{
                        paddingRight: "8px",
                      }}
                    >
                      <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter First Name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col
                      md={12}
                      style={{
                        paddingLeft: "8px",
                      }}
                    >
                      <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Last Name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item
                        label="Mobile Number"
                        name="mobile"
                        initialValue="+6591234567"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Mobile Number" size="large" />
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item
                        label="Registered Company Name"
                        name="companyName"
                        initialValue="Example Co Pte Ltd"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Company Name e.g. Example Co Pte Ltd" size="large" />
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item
                        label="UEN"
                        name="crn"
                        initialValue="202106812A"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Company Name e.g. Example Co Pte Ltd" size="large" />
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item name="tncs" valuePropName="checked">
                        <Checkbox defaultChecked={false} onClick={toggleContinue}>
                          I agree to the{" "}
                          <a
                            href="https://app.fxr.one/terms/terms-and-conditions-finaxar-flex-card"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            terms of use
                          </a>{" "}
                          and{" "}
                          <a href="https://app.fxr.one/privacy" target="_blank" rel="noopener noreferrer">
                            privacy policy
                          </a>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={continueIsEnabled} size="large">
                      Continue
                      <RightOutlined />
                    </Button>
                  </Form.Item>
                </Form>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
