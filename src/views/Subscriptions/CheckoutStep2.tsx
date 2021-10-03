import { Button, Row, Card, Col, Alert, Typography } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FlexBanner } from "../../components/Shared";
const { Title } = Typography;

interface StateType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userIds?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionPlan?: any;
}

export const CheckoutStep2: React.FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation<StateType>();
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState("Loading...");

  const userIds = location.state?.userIds;
  const subscriptionPlan = location.state?.subscriptionPlan;

  useEffect(() => {
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan ${subscriptionPlan} / billing frequency NULL`
    );
  }, [subscriptionPlan, userIds]);

  // If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlanId: string): void => {
    setLoading(true);
    setTimeout(
      () =>
        history.push({
          pathname: "/flex/subscription/checkout/summary",
          state: {
            userIds,
            subscriptionPlan: subscriptionPlan,
            subscriptionPlanId: subscriptionPlanId,
          },
        }),
      1800
    );

    console.log(userIds, subscriptionPlan, subscriptionPlanId);
  };

  return (
    <>
      <Title level={3}>Checkout</Title>
      <FlexBanner>Now... choose your billing frequency 📅</FlexBanner>
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
          <Col span={12}>
            <Card
              title="Flex Pro - Pay Monthly"
              bordered={false}
              actions={[
                <Button
                  type="link"
                  key="btn_upgrade"
                  onClick={() => handleUpgrade("FLEX_PRO-SGD-Monthly")}
                  loading={loading}
                >
                  Pay Monthly
                </Button>,
              ]}
            >
              <div>SGD 7.99 per user per month</div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="Flex Pro - Pay Yearly"
              bordered={false}
              actions={[
                <Button
                  type="link"
                  key="btn_upgrade"
                  onClick={() => handleUpgrade("FLEX_PRO-SGD-Yearly")}
                  loading={loading}
                >
                  Pay Yearly
                </Button>,
              ]}
            >
              <div>SGD 89.99 per user per year (10% discount!)</div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
