import { RightOutlined } from "@ant-design/icons";
import { Row, Col, Typography, Form, Input, Button } from "antd";
import React from "react";
import { API_URL, AUTH0_DOMAIN } from "../../shared";

const { Title } = Typography;

export const Onboarding: React.FunctionComponent = () => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    console.log("Success:", values);

    const abortController = new AbortController();
    const { signal } = abortController;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const postOnboardingData = async () => {
      try {
        const apiUrl = `${API_URL}/users/onboarding`;
        const response = await fetch(apiUrl, {
          signal,
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`, // So that our API will know who's calling it :)
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values), // POST-ed data
        });
        const data = await response.json();
        return data;
      } catch (e) {
        console.error(e.message);
      }
    };

    postOnboardingData().then(() => {
      const state = params.get("state");
      window.location.href = `${AUTH0_DOMAIN}/continue?state=${state}`;
    });

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Row
        style={{
          marginBottom: "40px",
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
                    <Col md={24}>
                      <Form.Item
                        label="Company Name"
                        name="companyName"
                        initialValue="Example Co Pte Ltd"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Company Name e.g. Example Co Pte Ltd" />
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item
                        label="UEN"
                        name="crn"
                        initialValue="202106812A"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Company Name e.g. Example Co Pte Ltd" />
                      </Form.Item>
                    </Col>
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
                        <Input placeholder="Enter First Name" />
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
                        <Input placeholder="Enter Last Name" />
                      </Form.Item>
                    </Col>
                    <Col md={24}>
                      <Form.Item
                        label="Mobile Number"
                        name="mobile"
                        initialValue="+6591234567"
                        rules={[{ required: true, message: "This field is required" }]}
                      >
                        <Input placeholder="Enter Mobile Number" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
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
