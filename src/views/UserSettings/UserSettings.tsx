import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Row, Col, Typography, Card } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";

const { Title } = Typography;

const RoundedCard = styled(Card)`
  border-radius: 10px;
`;

export const UserSettings: React.FunctionComponent = () => {
  const { user } = useAuth0();

  return (
    <>
      <Row>
        <Col md={24}>
          <Title level={3}>User Settings</Title>
        </Col>
      </Row>
      <Row>
        <Col
          md={24}
          style={{
            paddingRight: "16px",
          }}
        >
          <RoundedCard>
            <Row>
              <Col md={24}>
                <Row>
                  <Avatar size={64} src={user?.picture} />
                </Row>
              </Col>
            </Row>
          </RoundedCard>
        </Col>
      </Row>
    </>
  );
};
