import { Row, Col, Typography, Alert } from "antd";
import React from "react";

const { Title } = Typography;

export const PlaceholderPage: React.FunctionComponent = () => {
  return (
    <>
      <Row>
        <Col md={24}>
          <Title level={3}>Placeholder Page</Title>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <Alert
            message="This feature you clicked on is just a placeholder, and is not part of our project scope."
            type="warning"
            banner
            style={{
              borderRadius: "10px",
              marginTop: "16px",
            }}
          />
        </Col>
      </Row>
    </>
  );
};
