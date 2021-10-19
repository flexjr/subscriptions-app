import { Button, Result, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
const { Title } = Typography;

export const SubscriptionsCancelSuccess: React.FunctionComponent = () => {
  return (
    <>
      <Title level={3}>Cancel Success</Title>
      <RoundedCard
        style={{
          marginTop: "16px",
        }}
      >
        <Result
          status="success"
          title="🥳 Successfully cancelled!"
          subTitle="Your subscription benefits will last till the last day of your current billing cycle."
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
