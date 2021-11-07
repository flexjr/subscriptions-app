import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Row, Col, Card, Modal, Image, Button, Skeleton, Tooltip, notification } from "antd";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { RoundedCard, SavedCardBackup, SavedCardPrimary } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

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

const RoundedCardsWithActions = styled(RoundedCard)`
  .ant-card-actions {
    border-radius: 0 0 10px 10px;
  }
`;

interface Card {
  brand: string;
  customer_id: string;
  expiry_month: number;
  expiry_year: number;
  gateway_account_id: string;
  id: string;
  last4: string;
}

interface FlexSavedCardsLabelProps {
  cardStatus: string | undefined;
}

const FlexSavedCardsLabel: React.FunctionComponent<FlexSavedCardsLabelProps> = ({ cardStatus }) => {
  if (cardStatus == "primary") {
    return <SavedCardPrimary label="Primary" />;
  } else if (cardStatus == "backup") {
    return <SavedCardBackup label="Backup" />;
  } else {
    return <></>;
  }
};

export const PaymentMethods: React.FunctionComponent = () => {
  const [savedCards, setSavedCards] = useState([]);
  const [isLoading, setIsLoading] = useState({
    cardsList: true,
    addCardButton: false,
  });
  const [addCardUrl, setAddCardUrl] = useState("");
  const [iframeRefresh, setIframeRefresh] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const { getAccessTokenSilently } = useAuth0();

  const handleOk = (): void => {
    setIsModalVisible(false);
    setIsLoading({
      ...isLoading,
      cardsList: true,
    });
    setRefreshCount(refreshCount + 1);
    setAddCardUrl("");
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
    setIsLoading({
      ...isLoading,
      cardsList: true,
    });
    setRefreshCount(refreshCount + 1);
    setAddCardUrl("");
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
          setIsLoading({
            ...isLoading,
            cardsList: false,
          });
          return data;
        })
        .catch((error) => {
          console.error(error);
          setIsLoading({
            ...isLoading,
            cardsList: false,
          });
          return undefined;
        });
    };

    fetchData();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCount]);

  const handleAddCard = async (): Promise<void> => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const accessToken = await getAccessTokenSilently({
      audience: AUTH0_API_AUDIENCE,
      scope: "openid profile email",
    });

    setIsLoading({
      ...isLoading,
      addCardButton: true,
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

        setIsLoading({
          ...isLoading,
          addCardButton: false,
        });

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
            <Button type="primary" onClick={handleAddCard} loading={isLoading.addCardButton}>
              Add Card
            </Button>
          </Row>
        </Col>
        <Col md={24}>
          <Row gutter={2}>
            {isLoading.cardsList ? (
              <Skeleton active />
            ) : (
              <CardsList
                savedCards={savedCards}
                refreshCount={refreshCount}
                setRefreshCount={setRefreshCount}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
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

interface Card {
  id: string;
  brand: string;
  card_status: string | undefined;
  customer_id: string;
  expiry_month: number;
  expiry_year: number;
  last4: string;
}
interface CardsListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedCards: any;
  refreshCount: number;
  setRefreshCount: Dispatch<SetStateAction<number>>;
  isLoading: { cardsList: boolean; addCardButton: boolean };
  setIsLoading: Dispatch<SetStateAction<{ cardsList: boolean; addCardButton: boolean }>>;
}

export const CardsList: React.FunctionComponent<CardsListProps> = ({
  savedCards,
  refreshCount,
  setRefreshCount,
  isLoading,
  setIsLoading,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const handleSetPrimary = (card: Card): void => {
    setIsLoading({
      ...isLoading,
      cardsList: true,
    });
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const payload = {
        paymentId: card.id,
        type: "primary",
      };

      await postData<{ status; result }>(`${API_URL}/subscriptions/set_payment_method`, accessToken, signal, payload)
        .then(({ status, result }) => {
          openNotification(status, "Success!", `Successfully set •••• ${card.last4} as the primary payment method.`);
          console.log(result);
          setRefreshCount(refreshCount + 1);
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        })
        .catch((error) => {
          openNotification(
            "error",
            "Unable to set primary payment method",
            "We can't seem to set your primary payment method, please try again later. If it still persist, reach out to us at support@finaxar.com."
          );
          console.log(error);
          return undefined;
        });

      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  };

  const handleDeleteCard = (card: Card): void => {
    setIsLoading({
      ...isLoading,
      cardsList: true,
    });
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const payload = {
        paymentId: card.id,
        type: "primary",
      };

      await postData<{ status; result }>(`${API_URL}/subscriptions/delete_payment_method`, accessToken, signal, payload)
        .then(({ status, result }) => {
          openNotification(status, "Success!", `Successfully deleted •••• ${card.last4}.`);
          console.log(result);
          setRefreshCount(refreshCount + 1);
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        })
        .catch((error) => {
          openNotification(
            "error",
            "Unable to delete payment method",
            "We can't seem to delete your primary payment method, please try again later. If it still persist, reach out to us at support@finaxar.com."
          );
          console.log(error);
          return undefined;
        });

      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  };

  const cardActions = (card: Card): JSX.Element[] => {
    console.log(card);
    if (card.card_status && card.card_status === "primary") {
      return [
        <Tooltip
          placement="topLeft"
          title="You can't delete your primary card. Try setting another card as your primary payment method first!"
          key={card.id.concat(".tooltip")}
        >
          <Button type="link" size="small" disabled key={card.id.concat(".set_primary")}>
            Delete
          </Button>
        </Tooltip>,
      ];
    } else {
      return [
        <Button type="link" size="small" key={card.id.concat(".set_primary")} onClick={() => handleSetPrimary(card)}>
          Set primary
        </Button>,
        <Button type="link" size="small" danger key={card.id.concat(".delete")} onClick={() => handleDeleteCard(card)}>
          Delete
        </Button>,
      ];
    }
  };

  const openNotification = (type: string, title: string, description: string): void => {
    if (type == "success") {
      notification.success({
        message: title,
        description: description,
      });
    } else if (type == "error") {
      notification.error({
        message: title,
        description: description,
      });
    } else {
      notification.open({
        message: "Notification Title",
        description: "",
      });
    }
  };

  return savedCards && savedCards.length > 0 ? (
    savedCards.map((card) => (
      <>
        <Col md={8}>
          <RoundedCardsWithActions
            key={card["id"]}
            style={{
              borderRadius: "10px",
              marginRight: "16px",
              boxShadow: "0 7px 30px -10px rgba(150, 170, 180, 0.65)",
            }}
            actions={cardActions(card)}
          >
            <Row>
              <Col md={24}>
                <Row>
                  <Col>
                    <Image src="https://app.fxr.one/flex/static/media/physicalCard.f79f7efe.svg" preview={false} />
                  </Col>
                </Row>
              </Col>
              <Col md={24}>
                <Row>
                  <Col md={24}>
                    <div>
                      Ending •••• {card["last4"]} <FlexSavedCardsLabel cardStatus={card["card_status"]} />
                    </div>
                    <div>
                      Expiry {card["expiry_month"]}/{card["expiry_year"]}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </RoundedCardsWithActions>
        </Col>
      </>
    ))
  ) : (
    <>No saved cards found! You can add your Flex Visa card above. ☝️</>
  );
};
