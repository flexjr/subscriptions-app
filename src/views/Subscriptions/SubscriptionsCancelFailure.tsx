import { CloseCircleOutlined } from "@ant-design/icons";
import { Result, Button, Typography } from "antd";

import React from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
const { Paragraph, Text, Title } = Typography;
interface stateType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

export const SubscriptionsCancelFailure: React.FunctionComponent = () => {
  const location = useLocation<stateType>();
  const error = location.state?.error;
  const errorMessage = error?.message;
  const errorDebug = error?.debug;
  return (
    <>
      <Title level={3}>Payment Failed</Title>
      <RoundedCard
        style={{
          marginTop: "16px",
        }}
      >
        <Result
          status="error"
          title="Payment Failed"
          subTitle={errorMessage}
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        >
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                The payment failed because:
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" /> {errorDebug}{" "}
              <Link to="/flex/organization/subscriptions">Try again &gt;</Link>
            </Paragraph>
          </div>
        </Result>
      </RoundedCard>
    </>
  );
};
