import { CloseCircleOutlined } from "@ant-design/icons";
import { Result, Button, Typography } from "antd";

import React from "react";
import { useLocation } from "react-router";
import { RoundedCard } from "../../components/Shared";
const { Paragraph, Text, Title } = Typography;
interface stateType {
  error?: any;
}

export const PaymentFailed: React.FunctionComponent = () => {
  const location = useLocation<stateType>();
  console.log(location.state?.error);
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
          title="Submission Failed"
          subTitle="Please check and modify the following information before resubmitting."
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
                The content you submitted has the following error:
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been frozen.{" "}
              <a>Thaw immediately &gt;</a>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet eligible to apply.{" "}
              <a>Apply Unlock &gt;</a>
            </Paragraph>
          </div>
        </Result>
      </RoundedCard>
    </>
  );
};
