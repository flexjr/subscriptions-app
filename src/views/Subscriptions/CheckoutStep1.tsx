import { CheckOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Button, Row, Col, Alert, Typography, Tag } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FlexBanner } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../../shared";
const { Title } = Typography;
const GreenCheckedOutline = styled(CheckOutlined)`
  color: #52c41a;
  padding-right: 8px;
`;

const FlexSubscriptionPlanCard = styled.div`
  padding: 16px;
  border-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(255, 255, 255);

  &.flex-pro {
    background: linear-gradient(to bottom, #2ddca1 8px, white 7px 100%);
  }

  &.flex-premium {
    background: linear-gradient(to bottom, #1f9a70 8px, white 7px 100%);
  }
`;

const FlexSubscriptionPlanTitle = styled.div`
  font-size: 1.375rem;
  font-weight: 400;
  margin-bottom: 16px;
  flex-grow: 0;
  display: flex;
  align-items: center;
`;

const FlexSubscriptionPlanSupportingTitle = styled.div`
  font-size: 1rem;
  font-weight: normal;
  color: #646f79;
  padding-bottom: 24px;
  height: 80px;
`;

const FlexSubscriptionPlanPrice = styled.div`
  font-size: 1.875rem;
  font-weight: 500;
  margin-bottom: 16px;
  flex-grow: 0;
`;

const FlexSubscriptionPlanPriceText = styled.div`
  font-size: 0.8rem;
  font-weight: normal;
  color: #646f79;
`;

const FlexSubscriptionUpgradeButton = styled(Button)`
  margin-bottom: 16px;

  &.flex-pro {
    background: #2ddca1;
    border-color: #2ddca1;
  }
  &.flex-pro:hover {
    background: #76e8c2;
    border-color: #76e8c2;
  }

  &.flex-premium {
    background: #1f9a70;
    border-color: #1f9a70;
  }
  &.flex-premium:hover {
    background: #37d7a0;
    border-color: #37d7a0;
  }
`;

const FlexSubscriptionPlanContent = styled.div`
  font-size: 1rem;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const FlexSubscriptionBenefitsTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 16px;
  color: #273240;
`;

const FlexSubscriptionBenefits = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexSubscriptionBenefitsItem = styled(Row)`
  font-size: 0.875rem;
  align-items: center;
  margin-bottom: 8px;
`;

interface StateType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userIds?: any;
}

export const CheckoutStep1: React.FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation<StateType>();
  const [isLoading, setIsLoading] = useState({
    FLEX_STARTER: false,
    FLEX_PRO: false,
    FLEX_PREMIUM: false,
  });
  const [isDisabled, setIsDisabled] = useState({
    FLEX_STARTER: false,
    FLEX_PRO: false,
    FLEX_PREMIUM: false,
  });
  const [debugData, setDebugData] = useState("Loading...");
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  const userIds = location.state?.userIds;

  // TODO: If userIds does not exist, then redirect back...

  const handleUpgrade = (subscriptionPlan: string): void => {
    setIsLoading({
      FLEX_STARTER: subscriptionPlan === "FLEX_STARTER",
      FLEX_PRO: subscriptionPlan === "FLEX_PRO",
      FLEX_PREMIUM: subscriptionPlan === "FLEX_PREMIUM",
    });
    setIsDisabled({
      FLEX_STARTER: subscriptionPlan !== "FLEX_STARTER",
      FLEX_PRO: subscriptionPlan !== "FLEX_PRO",
      FLEX_PREMIUM: subscriptionPlan !== "FLEX_PREMIUM",
    });

    setTimeout(
      () =>
        history.push({
          pathname: "/flex/subscription/checkout/billing-frequency",
          state: {
            userIds: userIds,
            subscriptionPlan: subscriptionPlan,
          },
        }),
      2800
    );
  };

  useEffect(() => {
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan NULL / billing frequency NULL`
    );

    const fetchData = async (): Promise<void> => {
      const userId = userIds[0]; // We should assume all users are on the same plan currently. Previous page should check.

      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      await getData<{ result }>(
        `${API_URL}/subscriptions/list_subscription/${userId}?paid_only=false`,
        accessToken,
        signal
      )
        .then(({ result }) => {
          const formattedPlan = result.subscription_plan.split("-")[0];
          console.log(formattedPlan);
          setCurrentSubscriptionPlan(formattedPlan);
          return result;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });
    };

    fetchData();
  }, [getAccessTokenSilently, userIds]);

  return (
    <>
      <Title level={3}>Checkout</Title>
      <FlexBanner>Select your shiny new plan! 🎉</FlexBanner>
      {process.env.NODE_ENV === "development" && (
        <Alert
          message={debugData}
          type="info"
          banner
          style={{
            borderRadius: "10px",
            marginTop: "16px",
          }}
        />
      )}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={8}>
            <FlexSubscriptionPlanCard>
              <div>
                <FlexSubscriptionPlanTitle>Flex Starter</FlexSubscriptionPlanTitle>
                <FlexSubscriptionPlanSupportingTitle>
                  For small teams that are just getting started with our spend management platform.
                </FlexSubscriptionPlanSupportingTitle>
                <FlexSubscriptionPlanPrice>
                  Free
                  <FlexSubscriptionPlanPriceText>Free forever</FlexSubscriptionPlanPriceText>
                  <FlexSubscriptionPlanPriceText>&nbsp;</FlexSubscriptionPlanPriceText>
                </FlexSubscriptionPlanPrice>
                <FlexSubscriptionUpgradeButton size="large" block disabled={currentSubscriptionPlan === "FLEX_STARTER"}>
                  {currentSubscriptionPlan === "FLEX_STARTER" && "You’re on this plan"}
                  {currentSubscriptionPlan === "FLEX_PRO" && "Downgrade"}
                  {currentSubscriptionPlan === "FLEX_PREMIUM" && "Downgrade"}
                </FlexSubscriptionUpgradeButton>
                <FlexSubscriptionPlanContent>
                  <FlexSubscriptionBenefits>
                    <FlexSubscriptionBenefitsTitle>Manage your company’s payments with:</FlexSubscriptionBenefitsTitle>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> 10 virtual Visa cards
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Accounting software integrations
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> SGD 3,000 Flex PLUS Credit Line
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Basic spend controls
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Live customer support
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> 1.5% FX fee
                    </FlexSubscriptionBenefitsItem>
                  </FlexSubscriptionBenefits>
                </FlexSubscriptionPlanContent>
              </div>
            </FlexSubscriptionPlanCard>
          </Col>
          <Col span={8}>
            <FlexSubscriptionPlanCard className="flex-pro">
              <div>
                <FlexSubscriptionPlanTitle>
                  Flex Pro&nbsp;{currentSubscriptionPlan !== "FLEX_PREMIUM" && <Tag color="#2ddca1">Recommended</Tag>}
                </FlexSubscriptionPlanTitle>
                <FlexSubscriptionPlanSupportingTitle>
                  For small teams that require advanced spend controls.
                </FlexSubscriptionPlanSupportingTitle>
                <FlexSubscriptionPlanPrice>
                  <span style={{ fontSize: "1rem", verticalAlign: "top" }}>SGD</span> 7.49
                  <FlexSubscriptionPlanPriceText>Per user, per month billed annually</FlexSubscriptionPlanPriceText>
                  <FlexSubscriptionPlanPriceText>SGD 7.99 billed monthly</FlexSubscriptionPlanPriceText>
                </FlexSubscriptionPlanPrice>
                <FlexSubscriptionUpgradeButton
                  type="primary"
                  size="large"
                  block
                  loading={isLoading.FLEX_PRO}
                  onClick={() => handleUpgrade("FLEX_PRO")}
                  className={currentSubscriptionPlan === "FLEX_PRO" || isDisabled.FLEX_PRO ? "" : "flex-pro"}
                  disabled={currentSubscriptionPlan === "FLEX_PRO" || isDisabled.FLEX_PRO}
                >
                  {currentSubscriptionPlan === "FLEX_STARTER" && "Upgrade"}
                  {currentSubscriptionPlan === "FLEX_PRO" && "You’re on this plan"}
                  {currentSubscriptionPlan === "FLEX_PREMIUM" && "Downgrade"}
                </FlexSubscriptionUpgradeButton>
                <FlexSubscriptionPlanContent>
                  <FlexSubscriptionBenefits>
                    <FlexSubscriptionBenefitsTitle>Everything in Starter, plus:</FlexSubscriptionBenefitsTitle>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline />1 physical Visa Card
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Unlimited virtual Visa Cards
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Receipt capture
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Advanced spend controls
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> Premium support with assigned RM
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> 1.0% FX fee
                    </FlexSubscriptionBenefitsItem>
                  </FlexSubscriptionBenefits>
                </FlexSubscriptionPlanContent>
              </div>
            </FlexSubscriptionPlanCard>
          </Col>
          <Col span={8}>
            <FlexSubscriptionPlanCard className="flex-premium">
              <div>
                <FlexSubscriptionPlanTitle>Flex Premium</FlexSubscriptionPlanTitle>
                <FlexSubscriptionPlanSupportingTitle>
                  For larger teams that perform more fund transfers per month.
                </FlexSubscriptionPlanSupportingTitle>
                <FlexSubscriptionPlanPrice>
                  <span style={{ fontSize: "1rem", verticalAlign: "top" }}>SGD</span> 12.99
                  <FlexSubscriptionPlanPriceText>Per user, per month billed annually</FlexSubscriptionPlanPriceText>
                  <FlexSubscriptionPlanPriceText>SGD 14.99 billed monthly</FlexSubscriptionPlanPriceText>
                </FlexSubscriptionPlanPrice>
                <FlexSubscriptionUpgradeButton
                  type="primary"
                  size="large"
                  block
                  loading={isLoading.FLEX_PREMIUM}
                  onClick={() => handleUpgrade("FLEX_PREMIUM")}
                  className={
                    currentSubscriptionPlan === "FLEX_PREMIUM" || isDisabled.FLEX_PREMIUM ? "" : "flex-premium"
                  }
                  disabled={currentSubscriptionPlan === "FLEX_PREMIUM" || isDisabled.FLEX_PREMIUM}
                >
                  {currentSubscriptionPlan === "FLEX_PREMIUM" ? "You’re on this plan" : "Upgrade"}
                </FlexSubscriptionUpgradeButton>
                <FlexSubscriptionPlanContent>
                  <FlexSubscriptionBenefits>
                    <FlexSubscriptionBenefitsTitle>Everything in Pro, plus:</FlexSubscriptionBenefitsTitle>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline />5 physical Visa Cards
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> 0.5% FX fee
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> 50 free FAST transfers per month
                    </FlexSubscriptionBenefitsItem>
                    <FlexSubscriptionBenefitsItem>
                      <GreenCheckedOutline /> 5 free ATM withdrawals per month
                    </FlexSubscriptionBenefitsItem>
                  </FlexSubscriptionBenefits>
                </FlexSubscriptionPlanContent>
              </div>
            </FlexSubscriptionPlanCard>
          </Col>
        </Row>
      </div>
    </>
  );
};
