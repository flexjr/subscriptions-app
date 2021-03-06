import { useAuth0 } from "@auth0/auth0-react";
import { CardComponent } from "@chargebee/chargebee-js-react-wrapper";
import styled from "@emotion/styled";
import { Button, Row, Col, Alert, Skeleton, Typography, Divider, Drawer } from "antd";
import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FlexBanner, RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";
import { PaymentMethods } from "./PaymentMethods";

const { Title } = Typography;

interface StateType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userIds?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionPlan?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptionPlanId?: any;
}
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Chargebee: any;
  }
}

const PaymentMethodDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    height: 500px !important;
  }
`;

export const CheckoutStep3: React.FunctionComponent = () => {
  const location = useLocation<StateType>();
  const history = useHistory();
  const [debugData, setDebugData] = useState("Loading...");
  const [errorMessage, setErrorMessage] = useState("");
  const [chargebeeToken, setChargebeeToken] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [primaryCard, setPrimaryCard] = useState({
    brand: null,
    last4: null,
    expiry_month: null,
    expiry_year: null,
  });
  const [title, setTitle] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState({
    card: true,
    pricing: true,
  });
  const [usersList, setUsersList] = useState([]);
  const [estimate, setEstimate] = useState({
    unit_price: null,
    credits_applied: null,
    estimated_total_price: null,
    frequency: null,
    friendly_name: null,
  });
  const [isPayNowButtonLoading, setIsPayNowButtonLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const handleOk = (): void => {
    setIsModalVisible(false);
    setIsLoading({
      ...isLoading,
      card: true,
    });
    setRefreshCount(refreshCount + 1);
  };

  const userIds = location.state?.userIds;
  const subscriptionPlan = location.state?.subscriptionPlan;
  const subscriptionPlanId = location.state?.subscriptionPlanId;

  const cardRef = createRef<CardComponent>();

  const abortController = new AbortController();
  const { signal } = abortController;

  // You have to set window.Chargebee.init() here and NOT in index.html (see https://github.com/chargebee/chargebee-checkout-samples/blob/master/components/react-app/src/App.js)
  window.Chargebee.init({
    site: "pixely-test",
    publishableKey: "test_mNFmWUDOfA7cSzVPApbFYkUvw4Htcd1Gk", // Only need the publishable key (means read-only)
  });

  useEffect(() => {
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan ${subscriptionPlan} / billing frequency ${subscriptionPlanId} / cb token ${chargebeeToken}`
    );

    const fetchData = async (): Promise<void> => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const primaryCard = await getData<{ brand; last4; expiry_month; expiry_year } | undefined>(
        `${API_URL}/subscriptions/list_primary_card`,
        accessToken,
        signal
      )
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      if (primaryCard) {
        setPrimaryCard(primaryCard);
        setTitle("Your Saved Payment Methods");
      } else {
        setTitle("Add your Flex Visa card");
      }
      setIsLoading({
        ...isLoading,
        card: false,
      });

      const payloadEstimate = {
        userIds: userIds,
        subscriptionPlan: subscriptionPlan,
        subscriptionPlanId: subscriptionPlanId,
      };

      // estimateSubscriptionPricing
      await postData<{ unit_price; credits_applied; estimated_total_price; frequency; friendly_name }>(
        `${API_URL}/subscriptions/estimate_checkout`,
        accessToken,
        signal,
        payloadEstimate
      ).then((data) => {
        setEstimate(data);
        setIsLoading({
          card: false,
          pricing: false,
        });
        return data;
      });

      const payloadUserIds = {
        userIds: userIds,
      };

      // getUsersEmails
      await postData<{ data } | undefined>(
        `${API_URL}/users/users_by_user_ids`,
        accessToken,
        signal,
        payloadUserIds
      ).then((data) => {
        setUsersList(data?.data);
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  const handleAddCard = async (chargebeeToken: string): Promise<void> => {
    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "openid profile email",
    });

    setIsLoading({
      ...isLoading,
      card: true,
    });

    const payload = {
      token: chargebeeToken,
    };

    // addCard
    await postData<{ brand; expiry_month; expiry_year; last4 }>(
      `${API_URL}/subscriptions/save_payment_method`,
      accessToken,
      signal,
      payload
    )
      .then((data) => {
        setPrimaryCard(data);
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });
    setIsLoading({
      ...isLoading,
      card: false,
    });
  };

  const handleTokenizeCard = (): void => {
    cardRef.current.tokenize().then((data) => {
      setChargebeeToken(data.token);
      handleAddCard(data.token);
    });
  };

  const handlePayNow = async (): Promise<void> => {
    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "openid profile email",
    });

    const values = {
      userIds: userIds,
      subscriptionPlan: subscriptionPlan,
      subscriptionPlanId: subscriptionPlanId,
    };
    setIsPayNowButtonLoading(true);

    // Checkout
    await postData<{ status; result }>(`${API_URL}/subscriptions/checkout`, accessToken, signal, values)
      .then(({ status, result }) => {
        console.info(status, result);

        if (status == "success") {
          history.push({
            pathname: "/flex/subscription/payment-success",
          });
        }

        setIsPayNowButtonLoading(false);
        return true;
      })
      .catch((e) => {
        const error = JSON.parse(e.message);

        if (process.env.NODE_ENV === "development") {
          setErrorMessage(error.message + " " + error.debug);
        } else {
          history.push({
            pathname: "/flex/subscription/payment-failed",
            state: {
              error: error, // TODO
            },
          });
        }

        setIsPayNowButtonLoading(false);
        return undefined;
      });
  };

  const handleChangePaymentMethod = async (): Promise<void> => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Title level={3}>Checkout</Title>
      <FlexBanner>You???re almost there! ????</FlexBanner>
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
      {errorMessage !== "" && (
        <Alert
          message={errorMessage}
          type="error"
          banner
          style={{
            borderRadius: "10px",
            marginTop: "16px",
          }}
        />
      )}
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={16}>
            <RoundedCard title={title} bordered={false}>
              {isLoading.card ? (
                <Skeleton active />
              ) : primaryCard.last4 ? (
                <>
                  <Row
                    style={{
                      paddingBottom: "16px",
                    }}
                  >
                    <Col md={6} data-cy="saved-card">
                      {primaryCard?.brand}
                    </Col>
                    <Col md={6} data-cy="saved-card-last4">
                      ???????????? {primaryCard?.last4}
                    </Col>
                    <Col md={6}>
                      {primaryCard?.expiry_month}/{primaryCard?.expiry_year}
                    </Col>
                    <Col md={6}>
                      <Button type="link" size="small" onClick={() => handleChangePaymentMethod()}>
                        Change Payment Method
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Button onClick={handlePayNow} loading={isPayNowButtonLoading}>
                        Pay Now
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Col
                    md={24}
                    style={{
                      paddingBottom: "16px",
                    }}
                  >
                    <Alert
                      message="???? Processed securely by PCI DSS"
                      type="info"
                      showIcon={false}
                      banner
                      style={{
                        borderRadius: "10px",
                        marginBottom: "16px",
                      }}
                    />
                    <CardComponent ref={cardRef} />
                  </Col>
                  <Col md={24}>
                    <Button onClick={handleTokenizeCard} role="submit">
                      Add Payment Method
                    </Button>
                  </Col>
                </>
              )}
            </RoundedCard>
          </Col>
          <Col span={8}>
            <RoundedCard title="Pricing Summary" bordered={false}>
              {isLoading.pricing ? (
                <Skeleton active />
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                      data-cy="upgrade-plan"
                    >
                      {estimate.friendly_name}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                      data-cy="upgrade-unit-price"
                    >
                      SGD {estimate.unit_price}
                    </div>
                  </div>
                  <div>
                    <ol>
                      {usersList ? (
                        usersList.map((user) => (
                          <li key={user["id"]} data-cy={`upgrade-list-${user["id"]}`}>
                            {user["email"]}
                          </li>
                        ))
                      ) : (
                        <>Error</>
                      )}
                    </ol>
                  </div>

                  {estimate.credits_applied !== 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        Credits applied
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        ???SGD {estimate.credits_applied}
                      </div>
                    </div>
                  )}
                  <Divider />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      Total (per {estimate.frequency})
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.2rem",
                      }}
                    >
                      SGD {estimate.estimated_total_price}
                    </div>
                  </div>
                  <Divider />
                  <div
                    style={{
                      fontSize: "0.65rem",
                    }}
                    data-cy="upgrade-tncs"
                  >
                    You will be charged SGD {estimate.estimated_total_price}/{estimate.frequency} immediately when you
                    click ???Pay Now???. Your paid subscription will automatically renew until you cancel it. You can cancel
                    at any time but only after 3 months (when paying monthly) by visiting the Subscriptions tab. By
                    clicking ???Pay Now???, you agree to our{" "}
                    <a href="https://app.fxr.one/originate/terms" target="_blank" rel="noopener noreferrer">
                      terms of use
                    </a>{" "}
                    and{" "}
                    <a href="https://app.fxr.one/originate/privacy" target="_blank" rel="noopener noreferrer">
                      privacy policy
                    </a>
                    .
                  </div>
                </>
              )}
            </RoundedCard>
          </Col>
        </Row>
        <PaymentMethodDrawer
          title="Change Payment Method"
          placement="bottom"
          visible={isModalVisible}
          onClose={handleOk}
        >
          <PaymentMethods />
        </PaymentMethodDrawer>
      </div>
    </>
  );
};
