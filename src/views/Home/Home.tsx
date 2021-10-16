import styled from "@emotion/styled";
import { Row, Col, Typography, Divider, Image, Skeleton } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
import { useFlex } from "../../hooks";
import { CompanyExpensesChart } from ".";

const { Title } = Typography;

const PaddedCol = styled(Col)`
  padding-left: 16px;
  padding-right: 16px;
`;

const QuickActionsWrapper = styled.div`
  padding-bottom: 32px;
  display: flex;
`;

const QuickActionsLink = styled.span`
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  color: rgb(70, 81, 88);
  margin-left: 10px;
`;

export const Home: React.FunctionComponent = () => {
  const { isOnboarded } = useFlex();
  return <>{isOnboarded == undefined ? <Skeleton active /> : <HomeContent />}</>;
};

const HomeContent: React.FunctionComponent = () => {
  const history = useHistory();
  return (
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
                      src="https://app.fxr.one/flex/static/media/physicalCard.f79f7efe.svg"
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
                      src="https://app.fxr.one/flex/static/media/virtualCard.c382fbee.svg"
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
                    <QuickActionsWrapper>
                      <img src="https://app.fxr.one/flex/static/media/Frame.fad0ea22.svg" />
                      <QuickActionsLink onClick={() => history.push("/flex/organization/members")}>
                        Invite User
                      </QuickActionsLink>
                    </QuickActionsWrapper>
                    <QuickActionsWrapper>
                      <img src="https://app.fxr.one/flex/static/media/virtualCardIcon.c4827e70.svg" />
                      <QuickActionsLink onClick={() => history.push("/flex/request-virtual-card")}>
                        Issue Virtual Card
                      </QuickActionsLink>
                    </QuickActionsWrapper>
                    <QuickActionsWrapper>
                      <img src="https://app.fxr.one/flex/static/media/physicalCardIcon.82aeb182.svg" />
                      <QuickActionsLink onClick={() => history.push("/flex/request-physical-card")}>
                        Request Physical Card
                      </QuickActionsLink>
                    </QuickActionsWrapper>
                  </Col>
                </Row>
              </Col>
            </Row>
          </RoundedCard>
        </Col>
        <Col md={8}>
          <RoundedCard>
            <Row>
              <Col md={24}>
                <Title
                  level={4}
                  style={{
                    paddingBottom: "8px",
                  }}
                >
                  Company Expenses
                </Title>
                <CompanyExpensesChart />
              </Col>
            </Row>
          </RoundedCard>
          <RoundedCard
            style={{
              marginTop: "16px",
            }}
          >
            <Row>
              <Col md={24}>
                <Title
                  level={4}
                  style={{
                    paddingBottom: "8px",
                  }}
                >
                  Explore Flex
                </Title>
              </Col>
            </Row>
            <Row>
              <Col
                md={12}
                style={{
                  textAlign: "center",
                }}
              >
                <Image
                  src="https://app.fxr.one/flex/static/media/blog-icon.c4e6abfc.svg"
                  preview={false}
                  style={{
                    cursor: "pointer",
                    height: "100px",
                  }}
                />
                <div
                  style={{
                    color: "rgb(112, 128, 144)",
                    fontSize: "1.175em",
                    fontWeight: 600,
                  }}
                >
                  Blog
                </div>
              </Col>
              <Col
                md={12}
                style={{
                  textAlign: "center",
                }}
              >
                <Image
                  src="https://app.fxr.one/flex/static/media/visa-offers-icon.94e6e160.svg"
                  preview={false}
                  style={{
                    cursor: "pointer",
                    height: "100px",
                  }}
                />
                <div
                  style={{
                    color: "rgb(112, 128, 144)",
                    fontSize: "1.175em",
                    fontWeight: 600,
                  }}
                >
                  Visa Commercial Offers
                </div>
              </Col>
            </Row>
          </RoundedCard>
          <RoundedCard
            style={{
              marginTop: "16px",
            }}
          >
            <Row>
              <Col md={24}>
                <Title
                  level={4}
                  style={{
                    paddingBottom: "8px",
                  }}
                >
                  Help and Support
                </Title>
                <div
                  style={{
                    paddingBottom: "8px",
                    color: "rgb(105, 105, 105)",
                    fontSize: "1.175em",
                    fontWeight: 600,
                  }}
                >
                  Frequently Asked Questions
                </div>
                <div
                  style={{
                    paddingBottom: "8px",
                    color: "rgb(105, 105, 105)",
                    fontSize: "1.175em",
                    fontWeight: 600,
                  }}
                >
                  Contact Us
                </div>
              </Col>
            </Row>
          </RoundedCard>
        </Col>
      </Row>
    </>
  );
};
