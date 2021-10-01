import { Button, Row, Card, Col, Alert, Typography } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FlexBanner } from "../../components/Shared";
const { Title } = Typography;

interface stateType {
  userIds?: any;
  subscriptionPlanType?: any;
}

export const CheckoutStep2: React.FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation<stateType>();
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState("Loading...");

  const userIds = location.state?.userIds;
  const subscriptionPlanType = location.state?.subscriptionPlanType;

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan ${subscriptionPlanType} / billing frequency NULL`
    );
  }, [subscriptionPlanType, userIds]);

  // If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlanTypeWithBillingFrequency: string): void => {
    setLoading(true);
    setTimeout(
      () =>
        history.push({
          pathname: "/flex/subscription/checkout/summary",
          state: {
            userIds,
            subscriptionPlanType,
            subscriptionPlanTypeWithBillingFrequency,
          },
        }),
      1800
    );

    console.log(userIds, subscriptionPlanType, subscriptionPlanTypeWithBillingFrequency);
  };

  return (
    <>
      <Title level={3}>Checkout</Title>
      <FlexBanner>Now... choose your billing frequency 📅</FlexBanner>
      <Alert
        message={debugData}
        type="info"
        banner
        style={{
          borderRadius: "10px",
          marginTop: "16px",
        }}
      />
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
              <div>SGD 89.99 per user per year (x% discount!)</div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
