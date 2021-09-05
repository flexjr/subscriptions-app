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

export const CheckoutSummary: React.FunctionComponent = () => {
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
        You’re almost there! 😀
      </div>

      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Pricing Summary"
              bordered={false}
              actions={[
                <Button type="link" disabled key="btn_current">
                  Checkout
                </Button>,
              ]}
            >
              <div>To show card layout</div>
              <div>To show LIST of users as part of this checkout</div>
              <div>To get pricing summary (no. of users x chosen plan billing frequency)</div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
