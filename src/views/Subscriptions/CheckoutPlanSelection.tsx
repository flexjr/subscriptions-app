import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Button, Table, Modal, Row, Card, Col } from "antd";
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
}

export const CheckoutPlanSelection: React.FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation<stateType>();
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const userIds = location.state?.userIds;

  // TODO: If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlanType: string): void => {
    console.log(userIds, subscriptionPlanType);
    setLoading(true);
    setTimeout(
      () =>
        history.push({
          pathname: "/platform/subscription/checkout/billing_frequency",
          state: {
            userIds: userIds,
            subscriptionPlanType: subscriptionPlanType,
          },
        }),
      1000
    );
  };

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const createChargebeeCustomerIfNotExists = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "read:current_user openid profile email",
      });

      try {
        const apiUrl = `${API_URL}/subscriptions/chargebee_customer`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`, // So that our API will know who's calling it :)
            "Content-Type": "application/json",
          },
          signal,
        });
        const data = await response.json();
        console.log(data);
      } catch (e) {
        console.error(e.message);
      }
    };

    createChargebeeCustomerIfNotExists();
  }, [getAccessTokenSilently]);

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
        Select your shiny new plan! 🎉
      </div>

      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
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
              extra={<>$7.99 per user per month</>}
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
