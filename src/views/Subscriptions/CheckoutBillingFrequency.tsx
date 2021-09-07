import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Button, Table, Modal, Row, Card, Col, Alert } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { API_URL, AUTH0_API_AUDIENCE } from "../../utils";

const GreenCheckedOutline = styled(CheckOutlined)`
  color: #52c41a;
`;

const RedCloseOutlined = styled(CloseOutlined)`
  color: #f5222d;
`;

interface stateType {
  userIds?: any;
  subscriptionPlanType?: any;
}

export const CheckoutBillingFrequency: React.FunctionComponent = () => {
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
      1000
    );

    console.log(userIds, subscriptionPlanType, subscriptionPlanTypeWithBillingFrequency);
  };

  return (
    <>
      <h2>Checkout</h2>
      <div
        style={{
          backgroundImage: "url(https://app.fxr.one/flex/static/media/company-name-background.5dd40cbe.svg)",
          fontWeight: "bold",
          fontSize: "22px",
          color: "rgb(255, 255, 255)",
          padding: "34px",
          lineHeight: "32px",
          letterSpacing: "0.5px",
          borderRadius: "10px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          backgroundPosition: "100% 0",
          backgroundColor: "rgb(26, 40, 49)",
        }}
      >
        Now... choose your billing frequency 📅
      </div>
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
