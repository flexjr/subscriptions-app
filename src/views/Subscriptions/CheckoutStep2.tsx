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
  const [isLoading, setIsLoading] = useState({
    PAY_MONTHLY: false,
    PAY_YEARLY: false,
  });
  const [isDisabled, setIsDisabled] = useState({
    PAY_MONTHLY: false,
    PAY_YEARLY: false,
  });
  const [debugData, setDebugData] = useState("Loading...");

  const userIds = location.state?.userIds;
  const subscriptionPlan = location.state?.subscriptionPlan;

  useEffect(() => {
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan ${subscriptionPlan} / billing frequency NULL`
    );
  }, [subscriptionPlan, userIds]);

  let prettySubscriptionPlanTitle = "";
  if (subscriptionPlan === "FLEX_PRO") {
    prettySubscriptionPlanTitle = "Flex Pro";
  } else if (subscriptionPlan === "FLEX_PREMIUM") {
    prettySubscriptionPlanTitle = "Flex Premium";
  } else {
    prettySubscriptionPlanTitle = "";
  }

  // If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlanId: string): void => {
    setIsLoading({
      PAY_MONTHLY: subscriptionPlanId.indexOf("Monthly") > 0,
      PAY_YEARLY: subscriptionPlanId.indexOf("Yearly") > 0,
    });
    setIsDisabled({
      PAY_MONTHLY: subscriptionPlanId.indexOf("Monthly") < 0,
      PAY_YEARLY: subscriptionPlanId.indexOf("Yearly") < 0,
    });
    console.log(subscriptionPlanId.indexOf("Monthly"));
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
              title={`${prettySubscriptionPlanTitle} - Pay Monthly`}
              bordered={false}
              actions={[
                <Button
                  type="link"
                  key="btn_upgrade"
                  onClick={() => handleUpgrade(`${subscriptionPlan}-SGD-Monthly`)}
                  loading={isLoading.PAY_MONTHLY}
                  disabled={isDisabled.PAY_MONTHLY}
                  data-cy="pay-monthly-button"
                >
                  Pay Monthly
                </Button>,
              ]}
            >
              <div>
                SGD <code>AMOUNT_SLOT_1</code> per user, per month
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title={`${prettySubscriptionPlanTitle} - Pay Yearly`}
              bordered={false}
              actions={[
                <Button
                  type="link"
                  key="btn_upgrade"
                  onClick={() => handleUpgrade(`${subscriptionPlan}-SGD-Yearly`)}
                  loading={isLoading.PAY_YEARLY}
                  disabled={isDisabled.PAY_YEARLY}
                  data-cy="pay-yearly-button"
                >
                  Pay Yearly
                </Button>,
              ]}
            >
              <div>
                SGD <code>AMOUNT_SLOT_2</code> per user, per month billed annually
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
