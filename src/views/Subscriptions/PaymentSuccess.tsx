import { Button, Result, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
const { Title } = Typography;

export const PaymentSuccess: React.FunctionComponent = () => {
  return (
    <>
      <Title level={3}>Payment Success</Title>
      <RoundedCard
        style={{
          marginTop: "16px",
        }}
      >
        <Result
          status="success"
          title="🥳 Successfully Upgraded!"
          subTitle="Thank you for upgrading to Flex Pro, give us a minute or two while we prepare your account!"
          extra={[
            <Button type="primary" key="console">
              <Link to="/flex/dashboard">Go to Dashboard</Link>
            </Button>,
            <Button key="buy">
              <Link to="/flex/organization/subscriptions">Upgrade other users</Link>
            </Button>,
          ]}
        />
      </RoundedCard>
    </>
  );
};
