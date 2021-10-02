import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
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

interface stateType {
  userIds?: any;
}

export const CheckoutStep1: React.FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation<stateType>();
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState("Loading...");

  const userIds = location.state?.userIds;

  // TODO: If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlan: string): void => {
    console.log(userIds, subscriptionPlan);
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
    const abortController = new AbortController();
    const { signal } = abortController;
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
        {/* <Row gutter={16}>
          <Col span={12}>
            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "rgba(255, 255, 255)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "24px",
                    textAlign: "center",
                    fontWeight: 600,
                    marginBottom: "24px",
                    flexGrow: 0,
                  }}
                >
                  Flex Starter
                </div>
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
            </div>
          </Col>
        </Row> */}
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Flex Starter"
              bordered={false}
              extra={<>Free!</>}
              actions={[
                <Button type="link" disabled key="btn_current">
                  You’re on this plan
                </Button>,
              ]}
            >
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
          <Col span={12}>
            <Card
              title="Flex Pro"
              bordered={false}
              extra={<>SGD 7.99 per user per month</>}
              actions={[
                <Button type="link" key="btn_upgrade" onClick={() => handleUpgrade("FLEX_PRO")} loading={loading}>
                  Upgrade
                </Button>,
              ]}
            >
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
        </Row>
      </div>
    </>
  );
};
