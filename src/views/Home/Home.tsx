import { url } from "inspector";
import { Row, Col, Typography, Card, Divider, Image } from "antd";
import React from "react";

const { Title } = Typography;

export const Home: React.FunctionComponent = () => (
  <>
    <Row>
      <Col md={24}>
        <Title level={3}>Home</Title>
      </Col>
    </Row>
    <Row
      style={{
        marginBottom: "16px",
      }}
    >
      <Col md={24}>
        <Card
          style={{
            background:
              "left center / cover no-repeat rgb(26, 40, 49) url(https://app.fxr.one/platform/static/media/wave1366.ac1b871c.svg)",
            borderRadius: "10px",
          }}
        >
          <Row>
            <Col md={24}>
              <p
                style={{
                  color: "rgb(255, 255, 255)",
                  fontSize: "1.375em",
                }}
              >
                Total Available Funds
              </p>
              <p
                style={{
                  color: "rgb(173, 210, 200)",
                  fontSize: "1.125em",
                }}
              >
                Flex Plus Credit
              </p>
              <p
                style={{
                  color: "rgb(173, 210, 200)",
                  fontSize: "1.125em",
                }}
              >
                Business Account
              </p>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={24}>
        <Card>
          <Row>
            <Col md={14}>
              <Title level={4}>Company Cards Overview</Title>
              <Row style={{ marginRight: 580 }}>
                <Col>
                  <Image src="https://app.fxr.one/platform/static/media/physicalCard.ac5b1e0e.svg" preview={false} />
                </Col>
                <Col style={{ margin: "auto" }}>
                  <p>Physical Cards (1)</p>
                </Col>
              </Row>
            </Col>
            <Col md={10}>
              <Row>
                <Col md={1}>
                  <Divider type="vertical" style={{ height: "100%" }} />
                </Col>
                <Col md={23}>
                  <Title level={4}>Quick Actions</Title>
                  <p>Invite User</p>
                  <p>Issue Virtual Card</p>
                  <p>Request Physical Card</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </>
);
