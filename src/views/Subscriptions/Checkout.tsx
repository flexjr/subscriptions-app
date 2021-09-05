import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Button, Table, Modal, Row, Card, Col } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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

export const Checkout: React.FunctionComponent = () => {
  const location = useLocation<stateType>();
  const userIds = location.state?.userIds;

  // If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlanType: string): void => {
    const abortController = new AbortController();
    const { signal } = abortController;

    console.log(userIds, subscriptionPlanType);
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
        Select your shiny new plan!
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
                <Button type="link" key="btn_upgrade" onClick={() => handleUpgrade("Flex Pro")}>
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
