import { useAuth0 } from "@auth0/auth0-react";
import { CardComponent, CardNumber, CardExpiry, CardCVV } from "@chargebee/chargebee-js-react-wrapper";
import { Button, Table, Modal, Row, Card, Col, Alert, Skeleton } from "antd";
import React, { createRef, useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE } from "../../utils";
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

export const CheckoutSummary: React.FunctionComponent = () => {
  const location = useLocation<stateType>();
  const [debugData, setDebugData] = useState("Loading...");
  const [chargebeeToken, setChargebeeToken] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [primaryCard, setPrimaryCard] = useState({
    brand: null,
    last4: null,
    expiry_month: null,
    expiry_year: null,
  });
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const userIds = location.state?.userIds;
  const subscriptionPlanType = location.state?.subscriptionPlanType;
  const subscriptionPlanTypeWithBillingFrequency = location.state?.subscriptionPlanTypeWithBillingFrequency;

  const cardRef = createRef<CardComponent>();

  // You have to set window.Chargebee.init() here and NOT in index.html (see https://github.com/chargebee/chargebee-checkout-samples/blob/master/components/react-app/src/App.js)
  window.Chargebee.init({
    site: "pixely-test",
    publishableKey: "test_mNFmWUDOfA7cSzVPApbFYkUvw4Htcd1Gk", // Only need the publishable key (means read-only)
  });

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    setDebugData(
      `Debug Data: In this checkout, you intend to upgrade users ${userIds.toString()} / plan ${subscriptionPlanType} / billing frequency ${subscriptionPlanTypeWithBillingFrequency} / cb token ${chargebeeToken}`
    );

    const listPaymentMethods = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "read:current_user openid profile email",
      });

      try {
        const apiUrl = `${API_URL}/subscriptions/list_payment_methods`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`, // So that our API will know who's calling it :)
            "Content-Type": "application/json",
          },
          signal,
        });
        const data = await response.json();
        console.log(data);
        if ("cards" in data && data.cards.length > 0) {
          const primaryCard = data.cards[0]; // First card is the default, primary payment method used for auto-collection
          setPrimaryCard(primaryCard);
          setIsLoadingCards(false);
        } else {
          setIsLoadingCards(false);
        }
      } catch (e) {
        console.error(e);
      }
    };

    listPaymentMethods();
  }, [subscriptionPlanType, subscriptionPlanTypeWithBillingFrequency, userIds, chargebeeToken, getAccessTokenSilently]);

  // If userIds does not exist, then redirect back...

  const handleSaveCard = async (chargebeeToken: string) => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "read:current_user openid profile email",
    });

    console.log({ chargebee_token: chargebeeToken });

    try {
      setIsLoadingCards(true);
      const apiUrl = `${API_URL}/subscriptions/save_payment_method`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: chargebeeToken }),
        signal,
      });
      const data = await response.json();
      if ("cards" in data && data.cards.length > 0) {
        const primaryCard = data.cards[0]; // First card is the default, primary payment method used for auto-collection
        setPrimaryCard(primaryCard);
        console.log(primaryCard);
        setIsLoadingCards(false);
      } else {
        setIsLoadingCards(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const tokenizeCard = (): void => {
    cardRef.current.tokenize().then((data) => {
      console.log("Chargebee token", data.token);
      setChargebeeToken(data.token);
      handleSaveCard(data.token);
    });
  };

  return (
    <>
      <h2>Checkout</h2>
      <div
        style={{
          backgroundImage: "url(https://app.fxr.one/flex/static/media/company-name-background.5dd40cbe.svg)",
          fontWeight: "bold",
          fontSize: "22px",
          color: "rgb(255, 255, 255)",
          padding: "34px",
          lineHeight: "32px",
          letterSpacing: "0.5px",
          borderRadius: "10px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          backgroundPosition: "100% 0",
          backgroundColor: "rgb(26, 40, 49)",
        }}
      >
        You’re almost there! 😀
      </div>
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
            <RoundedCard title="Your Saved Payment Methods" bordered={false}>
              {isLoadingCards ? (
                <Skeleton />
              ) : primaryCard.last4 ? (
                <Row>
                  <Col md={6}>{primaryCard?.brand}</Col>
                  <Col md={6}>{primaryCard?.last4}</Col>
                  <Col md={6}>
                    {primaryCard?.expiry_month}/{primaryCard?.expiry_year}
                  </Col>
                  <Col md={6}>Change Payment Method</Col>
                  <Col md={6}>
                    <Button>Pay Now</Button>
                  </Col>
                </Row>
              ) : (
                <>
                  <CardComponent ref={cardRef} />
                  <Button onClick={tokenizeCard}>Add Payment Method</Button>
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
