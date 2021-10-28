import { useAuth0 } from "@auth0/auth0-react";
import { Row, Col, Typography, Card, Modal, Image, Button } from "antd";
import React, { useState, useEffect } from "react";
import { RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../../shared";

const { Title } = Typography;

const Iframe = ({ src, height, width }): JSX.Element => {
  return (
    <div>
      <iframe
        src={src}
        height={height}
        width={width}
        style={{
          border: "none",
        }}
        scrolling="no"
      />
    </div>
  );
};

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
  const [addCardUrl, setAddCardUrl] = useState("");
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

  const handleAddCard = async (): Promise<void> => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "openid profile email",
    });

    const getAddCardUrl = async (): Promise<void> => {
      try {
        await getData<{ access_url } | undefined>(`${API_URL}/subscriptions/chargebee/add_card`, accessToken, signal)
          .then((data) => {
            setAddCardUrl(data?.access_url);
            return data;
          })
          .catch((error) => {
            console.error(error);
            return undefined;
          });
        setIframeRefresh(iframeRefresh + 1);

        setIsModalVisible(true);
      } catch (e) {
        return undefined;
      }
    };

    getAddCardUrl();
  };

  return (
    <RoundedCard style={{ marginTop: 16 }}>
      <Row>
        <Col md={24}>
          <Row style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={handleAddCard}>
              Add Card
            </Button>
          </Row>
        </Col>
        <Col md={24}>
          <Row gutter={2}>
            {savedCards ? (
              savedCards.map((card) => (
                <>
                  <Card
                    key={card["id"]}
                    style={{
                      borderRadius: "10px",
                      marginRight: "16px",
                      boxShadow: "0 7px 30px -10px rgba(150, 170, 180, 0.65)",
                      backgroundImage: "https://app.fxr.one/flex/static/media/physicalCard.f79f7efe.svg",
                    }}
                  >
                    <Row>
                      <Col md={24}>
                        <Row>
                          <Col>
                            <Image
                              src="https://app.fxr.one/flex/static/media/physicalCard.f79f7efe.svg"
                              preview={false}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md={24}>
                        <Row>
                          <Col md={24}>
                            <div>
                              {card["brand"]} ending {card["last4"]}
                            </div>
                            <div>
                              expiry {card["expiry_month"]}/{card["expiry_year"]}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </>
              ))
            ) : (
              <>No saved cards found! Would you like to add one?</>
            )}
          </Row>
        </Col>
      </Row>
      <Modal title="Add Card" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Iframe src={addCardUrl} width="100%" height="500px" />
      </Modal>
    </RoundedCard>
  );
};
