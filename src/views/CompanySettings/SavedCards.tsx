import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Typography, Card, Modal, Image, Button } from "antd";
import React, { useState, useEffect } from "react";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../../shared";

const { Title } = Typography;

interface Card {
  brand: string;
  customer_id: string;
  expiry_month: number;
  expiry_year: number;
  gateway_account_id: string;
  id: string;
  last4: string;
}

export const SavedCards: React.FunctionComponent = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [hostedPaymentMethodPageUrl, setHostedPaymentMethodPageUrl] = useState("");
  const [iframeRefresh, setIframeRefresh] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async (): Promise<void> => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      // Get cards
      await getData<{ cards } | undefined>(`${API_URL}/subscriptions/list_saved_payment_methods`, accessToken, signal)
        .then((data) => {
          console.info(data);
          setSavedCards(data?.cards);
          return data;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });
    };

    fetchData();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCard = (): void => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const getHostedPaymentMethodPageUrl = async (): Promise<void> => {
      try {
        const apiUrl = `${API_URL}/chargebee/payment_source/customer/manage?id=4851`;
        const response = await fetch(apiUrl, {
          signal,
        });
        const data = await response.json();
        setHostedPaymentMethodPageUrl(data.url);
        setIframeRefresh(iframeRefresh + 1);

        console.log(data.url);
        setIsModalVisible(true);
      } catch (e) {
        return undefined;
      }
    };

    getHostedPaymentMethodPageUrl();
  };

  return (
    <>
      <Row>
        <Col md={24}>
          <Title level={3}>Saved Cards</Title>
        </Col>
      </Row>
      <Row>
        <Col md={24}>
          <Row style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={handleAddCard}>
              Add Card
            </Button>
          </Row>
        </Col>
        <Col md={24}>
          <Row>
            {savedCards ? (
              savedCards.map((card) => (
                <Card
                  key={card["id"]}
                  style={{
                    borderRadius: "10px",
                    marginRight: "16px",
                  }}
                >
                  <Row>
                    <Col md={24}>
                      <Row>
                        <Col>
                          <Image
                            src="https://app.fxr.one/platform/static/media/physicalCard.ac5b1e0e.svg"
                            preview={false}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={24}>
                      <Row>
                        <Col md={24}>
                          <div>{card["brand"]}</div>
                          <div>Ending in {card["last4"]}</div>
                          <div>
                            Expiry {card["expiry_month"]}/{card["expiry_year"]}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <>No saved cards found! Would you like to add one?</>
            )}
          </Row>
        </Col>
      </Row>
      <Modal title="Add Card" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <iframe src={hostedPaymentMethodPageUrl} key={iframeRefresh} height="500" width="100%" frameBorder="0" />
      </Modal>
    </>
  );
};
