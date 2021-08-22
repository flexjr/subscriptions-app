import styled from "@emotion/styled";
import { Row, Col, Typography, Card, Divider, Image } from "antd";
import React from "react";

const { Title } = Typography;

const RoundedCard = styled(Card)`
  border-radius: 10px;
`;

const PaddedCol = styled(Col)`
  padding-left: 16px;
  padding-right: 16px;
`;

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
        <RoundedCard
          style={{
            background:
              "left center / cover no-repeat rgb(26, 40, 49) url(https://app.fxr.one/platform/static/media/wave1366.ac1b871c.svg)",
          }}
        >
          <Row
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <PaddedCol
              style={{
                paddingLeft: "8px",
                paddingRight: "8px",
              }}
            >
              <div
                style={{
                  color: "rgb(255, 255, 255)",
                  fontSize: "1.375em",
                  fontWeight: 700,
                  paddingBottom: "8px",
                }}
              >
                Total Available Funds
              </div>
              <div
                style={{
                  color: "rgb(173, 210, 200)",
                  fontSize: "1.125em",
                  fontWeight: 500,
                }}
              >
                Flex Plus Credit
              </div>
              <div
                style={{
                  color: "rgb(173, 210, 200)",
                  fontSize: "1.125em",
                  fontWeight: 500,
                }}
              >
                Business Account
              </div>
            </PaddedCol>
            <PaddedCol>
              <div
                style={{
                  color: "rgb(255, 255, 255)",
                  fontSize: "1.375em",
                  fontWeight: 700,
                  paddingBottom: "8px",
                }}
              >
                2,995.43 SGD
              </div>
              <div
                style={{
                  color: "rgb(173, 210, 200)",
                  fontSize: "1.125em",
                  fontWeight: 500,
                }}
              >
                2,995.43 SGD
              </div>
              <div
                style={{
                  color: "rgb(173, 210, 200)",
                  fontSize: "1.125em",
                  fontWeight: 500,
                }}
              >
                0.00 SGD
              </div>
            </PaddedCol>
            <PaddedCol>
              <Divider type="vertical" style={{ height: "12vh", background: "rgba(255, 255, 255, 0.8)" }} />
            </PaddedCol>
            <PaddedCol
              style={{
                textAlign: "center",
              }}
            >
              <Image
                src="https://app.fxr.one/platform/static/media/DepositFunds.ad83df9b.svg"
                preview={false}
                style={{
                  marginBottom: "5px",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  color: "rgb(255, 255, 255)",
                  fontSize: "1.175em",
                  fontWeight: 700,
                  paddingBottom: "8px",
                }}
              >
                Deposit Funds
              </div>
            </PaddedCol>
            <PaddedCol
              style={{
                textAlign: "center",
              }}
            >
              <Image
                src="https://app.fxr.one/platform/static/media/IncreaseCreditLimit.ee27d978.svg"
                preview={false}
                style={{
                  marginBottom: "5px",
                  cursor: "pointer",
                }}
              />
              <div
                style={{
                  color: "rgb(255, 255, 255)",
                  fontSize: "1.175em",
                  fontWeight: 700,
                  paddingBottom: "8px",
                }}
              >
                Increase Credit Line
              </div>
            </PaddedCol>
          </Row>
        </RoundedCard>
      </Col>
    </Row>
    <Row>
      <Col
        md={16}
        style={{
          paddingRight: "16px",
        }}
      >
        <RoundedCard>
          <Row>
            <Col md={14}>
              <Title
                level={4}
                style={{
                  paddingBottom: "8px",
                }}
              >
                Company Cards Overview
              </Title>
              <Row
                style={{
                  paddingBottom: "8px",
                }}
              >
                <Col>
                  <Image
                    src="https://app.fxr.one/platform/static/media/physicalCard.ac5b1e0e.svg"
                    preview={false}
                    style={{
                      minHeight: "74px",
                      minWidth: "125px",
                    }}
                  />
                </Col>
                <Col style={{ margin: "auto 20px" }}>
                  <div
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Physical Cards{" "}
                    <span
                      style={{
                        color: "rgb(48, 231, 169)",
                      }}
                    >
                      (1)
                    </span>
                  </div>
                  <div>View All</div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Image
                    src="https://app.fxr.one/platform/static/media/virtualCard.6b309051.svg"
                    preview={false}
                    style={{
                      minHeight: "74px",
                      minWidth: "125px",
                    }}
                  />
                </Col>
                <Col style={{ margin: "auto 20px" }}>
                  <div
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Virtual Cards{" "}
                    <span
                      style={{
                        color: "rgb(48, 231, 169)",
                      }}
                    >
                      (1)
                    </span>
                  </div>
                  <div>View All</div>
                </Col>
              </Row>
            </Col>
            <Col md={10}>
              <Row>
                <Col md={1}>
                  <Divider type="vertical" style={{ height: "32vh" }} />
                </Col>
                <Col
                  md={23}
                  style={{
                    paddingLeft: "16px",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      paddingBottom: "8px",
                    }}
                  >
                    Quick Actions
                  </Title>
                  <div
                    style={{
                      paddingBottom: "8px",
                    }}
                  >
                    Invite User
                  </div>
                  <div
                    style={{
                      paddingBottom: "8px",
                    }}
                  >
                    Issue Virtual Card
                  </div>
                  <div
                    style={{
                      paddingBottom: "8px",
                    }}
                  >
                    Request Physical Card
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </RoundedCard>
      </Col>
      <Col md={8}>
        <RoundedCard>
          <Row>
            <Col md={14}>
              <Title
                level={4}
                style={{
                  paddingBottom: "8px",
                }}
              >
                Company Expenses
              </Title>
              <Row
                style={{
                  paddingBottom: "8px",
                }}
              />
            </Col>
          </Row>
        </RoundedCard>
      </Col>
    </Row>
  </>
);
