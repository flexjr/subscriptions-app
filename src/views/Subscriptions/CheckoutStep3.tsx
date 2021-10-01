import { useAuth0 } from "@auth0/auth0-react";
import { CardComponent } from "@chargebee/chargebee-js-react-wrapper";
import { Button, Row, Col, Alert, Skeleton, Typography } from "antd";
import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { FlexBanner, RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

const { Title } = Typography;

interface stateType {
  userIds?: any;
  subscriptionPlanType?: any;
  subscriptionPlanTypeWithBillingFrequency?: any;
}
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Chargebee: any;
  }
}

export const CheckoutStep3: React.FunctionComponent = () => {
  const location = useLocation<stateType>();
  const history = useHistory();
  const [debugData, setDebugData] = useState("Loading...");
  const [chargebeeToken, setChargebeeToken] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [primaryCard, setPrimaryCard] = useState({
    brand: null,
    last4: null,
    expiry_month: null,
    expiry_year: null,
  });
  const [title, setTitle] = useState("");
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const userIds = location.state?.userIds;
  const subscriptionPlanType = location.state?.subscriptionPlanType;
  const subscriptionPlanTypeWithBillingFrequency = location.state?.subscriptionPlanTypeWithBillingFrequency;

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
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan ${subscriptionPlanType} / billing frequency ${subscriptionPlanTypeWithBillingFrequency} / cb token ${chargebeeToken}`
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
      console.log(primaryCard);
      if (primaryCard) {
        console.log(primaryCard);
        setPrimaryCard(primaryCard);
        setIsLoadingCards(false);
        setTitle("Your Saved Payment Methods");
      } else {
        setIsLoadingCards(false);
        setTitle("Add your Flex Visa card");
      }
    };

    fetchData();
  }, []);

  const handleAddCard = async (chargebeeToken: string): Promise<void> => {
    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "openid profile email",
    });

    setIsLoadingCards(true);

    const payload = {
      token: chargebeeToken,
    };

    const addCard = await postData<{ brand; expiry_month; expiry_year; last4 }>(
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
    setIsLoadingCards(false);
  };

  const handleTokenizeCard = (): void => {
    cardRef.current.tokenize().then((data) => {
      console.log("Chargebee token", data.token);
      setChargebeeToken(data.token);
      handleAddCard(data.token);
    });
  };

  const handlePayNow = async (): Promise<void> => {
    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "openid profile email",
    });

    const checkout = await postData<{ invoice; subscription }>(`${API_URL}/subscriptions/checkout`, accessToken, signal)
      .then(({ invoice, subscription }) => {
        console.info(invoice, subscription);

        if (invoice.status) {
          history.push({
            pathname: "/flex/subscription/payment-success",
          });
        }
        return { invoice, subscription };
      })
      .catch((e) => {
        const error = JSON.parse(e.message);
        history.push({
          pathname: "/flex/subscription/payment-failed",
          state: {
            error: error, // TODO
          },
        });

        // <Redirect
        //   to={{
        //     pathname: "/flex/subscription/payment-failed",
        //     state: { error: error },
        //   }}
        // />;
        return undefined;
      });
  };

  return (
    <>
      <Title level={3}>Checkout</Title>
      <FlexBanner>You’re almost there! 😀</FlexBanner>
      <Alert
        message={debugData}
        type="info"
        banner
        style={{
          borderRadius: "10px",
          marginTop: "16px",
        }}
      />
      <div style={{ marginTop: "16px", marginBottom: "16px" }}>
        <Row gutter={16}>
          <Col span={16}>
            <RoundedCard title={title} bordered={false}>
              {isLoadingCards ? (
                <Skeleton active />
              ) : primaryCard.last4 ? (
                <>
                  <Row
                    style={{
                      paddingBottom: "16px",
                    }}
                  >
                    <Col md={6}>{primaryCard?.brand}</Col>
                    <Col md={6}>{primaryCard?.last4}</Col>
                    <Col md={6}>
                      {primaryCard?.expiry_month}/{primaryCard?.expiry_year}
                    </Col>
                    <Col md={6}>Change Payment Method</Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Button onClick={handlePayNow}>Pay Now</Button>
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
                      message="🔒 Processed securely by PCI DSS"
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
                    <Button onClick={handleTokenizeCard}>Add Payment Method</Button>
                  </Col>
                </>
              )}
            </RoundedCard>
          </Col>
          <Col span={8}>
            <RoundedCard title="Pricing Summary" bordered={false}>
              <div>To show card layout</div>
              <div>To show LIST of users as part of this checkout</div>
              <div>To get pricing summary (no. of users x chosen plan billing frequency)</div>
            </RoundedCard>
          </Col>
        </Row>
      </div>
    </>
  );
};
