import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Row, Card, Col, Alert, Typography } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FlexBanner } from "../../components/Shared";
const { Title } = Typography;
const GreenCheckedOutline = styled(CheckOutlined)`
  color: #52c41a;
`;

const RedCloseOutlined = styled(CloseOutlined)`
  color: #f5222d;
`;

const FlexSubscriptionPlanCard = styled.div`
  padding: 16px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(255, 255, 255);
`;

const FlexSubscriptionPlanTitle = styled.div`
  font-size: 24px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 24px;
  flex-grow: 0;
`;

interface StateType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userIds?: any;
}

export const CheckoutStep1: React.FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation<StateType>();
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState("Loading...");

  const userIds = location.state?.userIds;

  // TODO: If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlan: string): void => {
    setLoading(true);
    setTimeout(
      () =>
        history.push({
          pathname: "/flex/subscription/checkout/billing-frequency",
          state: {
            userIds: userIds,
            subscriptionPlan: subscriptionPlan,
          },
        }),
      2800
    );
  };

  useEffect(() => {
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan NULL / billing frequency NULL`
    );
  }, [userIds]);

  return (
    <>
      <Title level={3}>Checkout</Title>
      <FlexBanner>Select your shiny new plan! 🎉</FlexBanner>
      {process.env.NODE_ENV === "development" && (
        <Alert
          message={debugData}
          type="info"
          banner
          style={{
            borderRadius: "10px",
            marginTop: "16px",
          }}
        />
      )}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <FlexSubscriptionPlanCard>
              <div>
                <FlexSubscriptionPlanTitle>Flex Starter</FlexSubscriptionPlanTitle>
                <div
                  style={{
                    fontSize: "32px",
                    textAlign: "center",
                    fontWeight: 600,
                    marginBottom: "16px",
                    flexGrow: 0,
                  }}
                >
                  SGD 7.99
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "normal",
                    }}
                  >
                    /month
                  </span>
                </div>
              </div>
            </FlexSubscriptionPlanCard>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title="Flex Starter"
              bordered={false}
              actions={[
                <Button type="link" disabled key="btn_current">
                  You’re on this plan
                </Button>,
              ]}
            >
              <div>Free!</div>
              <div>
                <RedCloseOutlined /> No Physical Visa Cards
              </div>
              <div>
                <GreenCheckedOutline /> 10 Virtual Visa Cards
              </div>
              <div>
                <GreenCheckedOutline /> Accounting Software Integrations
              </div>
              <div>
                <GreenCheckedOutline /> S$3,000 Flex Plus Credit Line
              </div>
              <div>
                <GreenCheckedOutline /> Basic Spend Controls
              </div>
              <div>
                <GreenCheckedOutline /> Live Customer Support
              </div>
              <div>
                <GreenCheckedOutline /> 1.5% FX Fee
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Flex Pro"
              bordered={false}
              actions={[
                <Button type="link" key="btn_upgrade" onClick={() => handleUpgrade("FLEX_PRO")} loading={loading}>
                  Upgrade
                </Button>,
              ]}
            >
              <div>SGD 7.49 per user per month</div>
              <div>
                <GreenCheckedOutline />1 Physical Visa Card
              </div>
              <div>
                <GreenCheckedOutline /> Unlimited Virtual Visa Cards
              </div>
              <div>
                <GreenCheckedOutline /> Accounting Software Integrations
              </div>
              <div>
                <GreenCheckedOutline /> S$3,000 Flex Plus Credit Line
              </div>
              <div>
                <GreenCheckedOutline /> Advanced Spend Controls
              </div>
              <div>
                <GreenCheckedOutline /> Premium Support with Assigned RM
              </div>
              <div>
                <GreenCheckedOutline /> 1.0% FX Fee
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Flex Premium"
              bordered={false}
              actions={[
                <Button type="link" key="btn_upgrade" onClick={() => handleUpgrade("FLEX_PREMIUM")} loading={loading}>
                  Upgrade
                </Button>,
              ]}
            >
              <div>From SGD 13.49 per user per month</div>
              <div>
                <GreenCheckedOutline />5 Physical Visa Cards
              </div>
              <div>
                <GreenCheckedOutline /> Unlimited Virtual Visa Cards
              </div>
              <div>
                <GreenCheckedOutline /> Accounting Software Integrations
              </div>
              <div>
                <GreenCheckedOutline /> S$3,000 Flex Plus Credit Line
              </div>
              <div>
                <GreenCheckedOutline /> Advanced Spend Controls
              </div>
              <div>
                <GreenCheckedOutline /> Premium Support with Assigned RM
              </div>
              <div>
                <GreenCheckedOutline /> 0.5% FX Fee
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
