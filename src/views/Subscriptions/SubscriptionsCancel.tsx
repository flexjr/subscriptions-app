import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Skeleton, Select, Form, Input, Row, Col, Button, Typography, Divider } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { FlexBanner, RoundedCard } from "../../components/Shared";

const { Title } = Typography;

const Field = styled(Col)`
  font-weight: 500;
`;

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
          <FlexBanner>We’re sorry to see you go... 🥺</FlexBanner>
          <Row gutter={16}>
            <Col span={16}>
              <RoundedCard style={{ marginTop: 16 }}>
                <h3>Confirm your cancellation</h3>
                <Row>
                  <Col md={24}>
                    <p>
                      Thanks for spending time with us. You’re always welcome back. Finish your cancellation below.
                      Cancellation will be effective at the end of your current billing period on{" "}
                      <span style={{ fontWeight: 500 }}>D MMMM YYYY</span>. After this date:
                    </p>
                    <ul>
                      <li>Your physical Flex Visa cards will be frozen immediately.</li>
                      <li>
                        Your virtual Flex Visa cards above the allocated limit will be frozen immediately, beginning
                        with the first card that you issued.
                      </li>
                      <li>Any advanced spend controls on existing virtual Flex Visa cards will be removed.</li>
                      <li>
                        Come back at any time. If you restart within 30 days, your frozen physical, virtual Flex Visa
                        cards and existing spend controls set will still be waiting for you.
                      </li>
                    </ul>
                  </Col>
                </Row>
                <Divider />
                <h3>You will be cancelling for</h3>
                <Row style={{ paddingBottom: "8px" }}>
                  <Field md={12}>User Account</Field>
                  <Col md={12}>example@example.com</Col>
                </Row>
                <Row style={{ paddingBottom: "8px" }}>
                  <Field md={12}>Plan Name</Field>
                  <Col md={12}>FLEX_PRO-SGD-Monthly</Col>
                </Row>
                <Row style={{ paddingBottom: "8px" }}>
                  <Field md={12}>Current Billing Cycle</Field>
                  <Col md={12}>D MMMM YYYY – D MMMM YYYY</Col>
                </Row>
                <Divider />
                <p>Before you go, we’d love to find out why</p>
                <Form name="basic" layout="vertical">
                  <Row>
                    <Col md={24}>
                      <Form.Item>
                        <Select size="large">
                          <Select.Option value="demo">It is too expensive</Select.Option>
                          <Select.Option value="demo">The free plan is just right for my business</Select.Option>
                          <Select.Option value="demo">I do not need some of the paid features</Select.Option>
                          <Select.Option value="demo">
                            I am switching to another spend management platform
                          </Select.Option>
                          <Select.Option value="demo">I am closing my business</Select.Option>
                          <Select.Option value="demo">Other reasons</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={24}>
                      <Button type="primary" htmlType="submit" size="large">
                        End my subscription on DATE
                      </Button>{" "}
                      <Button type="default" htmlType="submit" size="large">
                        Go back
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </RoundedCard>
            </Col>
            <Col span={8}>
              <RoundedCard
                style={{
                  marginTop: "16px",
                }}
              >
                <Row>
                  <Col md={24}>
                    <Title
                      level={4}
                      style={{
                        paddingBottom: "8px",
                      }}
                    >
                      Help and Support
                    </Title>
                    <div
                      style={{
                        paddingTop: "16px",
                        paddingBottom: "8px",
                        color: "rgb(105, 105, 105)",
                        fontSize: "1em",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="https://app.fxr.one/flex/static/media/question-mark-icon.df27b889.svg"
                        style={{ marginRight: "8px" }}
                      />{" "}
                      Frequently Asked Questions
                    </div>
                    <div
                      style={{
                        paddingTop: "16px",
                        paddingBottom: "8px",
                        color: "rgb(105, 105, 105)",
                        fontSize: "1em",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src="https://app.fxr.one/flex/static/media/contact-icon.3d68ac31.svg"
                        style={{ marginRight: "8px" }}
                      />{" "}
                      Contact Us
                    </div>
                  </Col>
                </Row>
              </RoundedCard>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
