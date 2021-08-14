import { useState, useEffect, FunctionComponent } from "react";
import { Row, Col, Typography, Card, Modal, Image, Button } from "antd";
import { API_URL } from "../../utils";

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

const Iframe = (src) => {
  return <iframe src={src} />;
};

export const SavedCards: FunctionComponent = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [hostedPaymentMethodPageUrl, setHostedPaymentMethodPageUrl] = useState("https://pixely-test.chargebee.com/pages/v3/IWLnz17EscuSuqfLGZre8Z0DDl7EwCIxN/");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const getSavedCards = async () => {
      try {
        const apiUrl = `${API_URL}/chargebee/payment_source/customer?id=4851`;
        const response = await fetch(apiUrl, {
          signal,
        });
        const data = await response.json();
        setSavedCards(data.cards);
      } catch (e) {
        console.error(e.message);
      }
    };

    getSavedCards();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const handleAddCard = () => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const getHostedPaymentMethodPageUrl = async () => {
      try {
        const apiUrl = `${API_URL}/chargebee/payment_source/customer/manage?id=4851`;
        const response = await fetch(apiUrl, {
          signal,
        });
        const data = await response.json();
        setHostedPaymentMethodPageUrl(data.url);
        console.log(data.url);
        setIsModalVisible(true);
      } catch (e) {
        console.error(e.message);
      }
    };

    getHostedPaymentMethodPageUrl();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };

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
            {savedCards.map((card) => (
              <Card key={card["id"]}>
                <Row>
                  <Col md={24}>
                    <Title level={4}>Saved Card</Title>
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
                        <p>{card["brand"]}</p>
                        <p>Ending in {card["last4"]}</p>
                        <p>
                          Expiry {card["expiry_month"]}/{card["expiry_year"]}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            ))}
          </Row>
        </Col>
      </Row>
      <Modal title="Add Card" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <iframe src="https://pixely-test.chargebee.com/pages/v3/IWLnz17EscuSuqfLGZre8Z0DDl7EwCIxN/" width="500" height="800" frameBorder="0" />
      </Modal>
    </>
  );
};
