import { FunctionComponent } from "react";
import { Row, Col, Typography, Card, Divider, Image } from "antd";
import "./Home.css";
import styled from "@emotion/styled";

const { Title } = Typography;

export const Home: FunctionComponent = () => (
  <>
    <Row>
      <Col md={24}>
        <Title level={3}>Home</Title>
      </Col>
    </Row>
    <Row>
      <Col md={24}>
        <Card>
          <Row>
            <Col md={14}>
              <Title level={4}>Company Cards Overview</Title>
              <Row style={{marginRight: 580}}>
                <Col>
                  <Image src="https://app.fxr.one/platform/static/media/physicalCard.ac5b1e0e.svg" preview={false} />
                </Col>
                <Col style={{margin: "auto"}}>
                  <p>Physical Cards (1)</p>
                </Col>
              </Row>
            </Col>
            <Col md={10}>
              <Row>
                <Col md={1}>
                  <Divider type="vertical" style={{height: "100%"}} />
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
