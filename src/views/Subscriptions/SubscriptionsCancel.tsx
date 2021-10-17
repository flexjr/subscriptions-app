import { useAuth0 } from "@auth0/auth0-react";
import { Skeleton, Form, Input, Row, Col, Button, Typography } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { FlexBanner, RoundedCard } from "../../components/Shared";

const { Title } = Typography;

export const SubscriptionsCancel: React.FunctionComponent = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      // const { signal } = abortController;

      // const accessToken = await getAccessTokenSilently({
      //   audience: AUTH0_API_AUDIENCE,
      //   scope: "openid profile email",
      // });

      setIsPageLoading(false);

      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  }, [getAccessTokenSilently]);

  return (
    <>
      <Title level={3}>Cancel Subscription</Title>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <FlexBanner>We're sorry to see you go... 🥺</FlexBanner>
          <RoundedCard style={{ marginTop: 16 }}>
            <h3>Confirm your cancellation</h3>
            <p>We will send an invitation email that is valid for 7 days</p>
            <div>Details</div>
            <Form name="basic" layout="vertical">
              <Row>
                <Col
                  md={5}
                  style={{
                    paddingRight: "16px",
                  }}
                >
                  <Form.Item name="firstName" rules={[{ required: true, message: "This field is required" }]}>
                    <Input placeholder="Enter First Name Here" type="text" size="large" />
                  </Form.Item>
                </Col>
                <Col
                  md={5}
                  style={{
                    paddingRight: "16px",
                  }}
                >
                  <Form.Item name="lastName" rules={[{ required: true, message: "This field is required" }]}>
                    <Input placeholder="Enter Last Name here" type="text" size="large" />
                  </Form.Item>
                </Col>
                <Col
                  md={10}
                  style={{
                    paddingRight: "16px",
                  }}
                >
                  <Form.Item name="email" rules={[{ required: true, message: "This field is required" }]}>
                    <Input placeholder="Enter User Email here" type="email" size="large" />
                  </Form.Item>
                </Col>
                <Col md={4}>
                  <Button type="primary" htmlType="submit" size="large">
                    Invite
                  </Button>
                </Col>
              </Row>
            </Form>
          </RoundedCard>
        </>
      )}
    </>
  );
};
