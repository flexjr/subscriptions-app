import { Button, Result, Typography } from "antd";
import React from "react";
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
          title="Successfully Purchased Cloud Server ECS!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        />
      </RoundedCard>
    </>
  );
};
