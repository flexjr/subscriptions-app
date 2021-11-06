import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Skeleton, Modal, Space, notification } from "antd";
import { format, getUnixTime, parseISO } from "date-fns";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
import { useFlex } from "../../hooks";
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

export const SubscriptionsManage: React.FunctionComponent = () => {
  const history = useHistory();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState({
    manageSubscription: false,
  });
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);

  const [isChargebeeModalVisible, setIsChargebeeModalVisible] = useState(false);
  const [chargebeeUrl, setChargebeeUrl] = useState("");

  const { getAccessTokenSilently } = useAuth0();
  const { subscriptionPlanFriendlyName, subscriptionPlanStatus } = useFlex();

  const columns = [
    {
      title: "User ID",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "Name",
      dataIndex: undefined,
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return `${record.first_name} ${record.last_name}`;
      },
    },
    {
      title: "Member's Email",
      dataIndex: "email",
    },
    {
      title: "Subscription Plan",
      dataIndex: "subscription_plan",
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return subscriptionPlanFriendlyName(record.subscription_plan);
      },
      filters: [
        {
          text: "Flex Pro (Monthly)",
          value: "FLEX_PRO-SGD-Monthly",
        },
        {
          text: "Flex Pro (Yearly)",
          value: "FLEX_PRO-SGD-Yearly",
        },
        {
          text: "Flex Premium (Monthly)",
          value: "FLEX_PREMIUM-SGD-Monthly",
        },
        {
          text: "Flex Premium (Yearly)",
          value: "FLEX_PREMIUM-SGD-Yearly",
        },
      ],
      onFilter: (value, record) => record.subscription_plan.indexOf(value) === 0,
    },
    {
      title: "Current Term Start",
      dataIndex: "current_term_start",
      sorter: (a, b) => getUnixTime(parseISO(a.current_term_start)) - getUnixTime(parseISO(b.current_term_start)),
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return format(new Date(record.current_term_start), "d MMM yyyy");
      },
    },
    {
      title: "Current Term End",
      dataIndex: "current_term_end",
      sorter: (a, b) => getUnixTime(parseISO(a.current_term_end)) - getUnixTime(parseISO(b.current_term_end)),
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return format(new Date(record.current_term_end), "d MMM yyyy");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return subscriptionPlanStatus(record.status);
      },
      filters: [
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Non Renewing",
          value: "non_renewing",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        if (record.status === "non_renewing") {
          return (
            <Space size="middle">
              <Button type="link" onClick={() => handleRenewSubscription(record.user_id)}>
                Renew
              </Button>
            </Space>
          );
        }
        return (
          <Space size="middle">
            <Button
              type="link"
              onClick={() =>
                history.push({
                  pathname: "/flex/subscription/cancel",
                  state: {
                    userId: record.id,
                  },
                })
              }
            >
              Cancel
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const orgUsers = await getData<{ result }>(`${API_URL}/subscriptions/list_subscriptions`, accessToken, signal)
        .then(({ result }) => {
          const data = result.data;
          // Need to add key to each user
          for (let i = 0; i < data.length; i++) {
            data[i].key = data[i].user_id;
          }
          return data;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      setCurrentOrgUsers(orgUsers);
      setIsPageLoading(false);
      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  }, [getAccessTokenSilently]);

  const handleChargebeeSSO = (): void => {
    setIsLoading({ ...isLoading, manageSubscription: true });
    const fetchData = async (): Promise<void> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      await getData<{ access_url }>(`${API_URL}/subscriptions/chargebee/sso`, accessToken, signal)
        .then(({ access_url }) => {
          setIsChargebeeModalVisible(true);
          setChargebeeUrl(access_url);
          return access_url;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      setIsLoading({ ...isLoading, manageSubscription: false });
    };
    fetchData();
  };

  const handleChargebeeOk = (): void => {
    setIsChargebeeModalVisible(false);
  };
  const handleChargebeeCancel = (): void => {
    setIsChargebeeModalVisible(false);
  };

  const handleRenewSubscription = (userId: string): void => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const payload = {
        userId: userId,
      };

      await postData<{ status; result }>(`${API_URL}/subscriptions/renew_subscription`, accessToken, signal, payload)
        .then(({ status, result }) => {
          openNotification(status, "Subscription renewed", "Subscription successfully renewed!");
          console.log(result);
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          const fetchData = async () => {
            const abortController = new AbortController();
            const { signal } = abortController;

            const accessToken = await getAccessTokenSilently({
              audience: AUTH0_API_AUDIENCE,
              scope: "openid profile email",
            });

            const orgUsers = await getData<{ result }>(
              `${API_URL}/subscriptions/list_subscriptions`,
              accessToken,
              signal
            )
              .then(({ result }) => {
                const data = result.data;
                // Need to add key to each user
                for (let i = 0; i < data.length; i++) {
                  data[i].key = data[i].user_id;
                }
                return data;
              })
              .catch((error) => {
                console.error(error);
                return undefined;
              });

            setCurrentOrgUsers(orgUsers);
            setIsPageLoading(false);
            // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
            return function cleanup() {
              abortController.abort();
            };
          };
          fetchData();
        })
        .catch((error) => {
          openNotification(
            "error",
            "Unable to renew",
            "We can't seem to renew your subscription. Try refreshing or try again later. If it still persist, reach out to us at support@finaxar.com."
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
        description:
          "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    }
  };

  return (
    <>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <RoundedCard style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleChargebeeSSO} loading={isLoading.manageSubscription}>
                Manage Subscriptions
              </Button>
            </div>
            <Table columns={columns} dataSource={currentOrgUsers} />
          </RoundedCard>

          <Modal
            title="Manage Subscriptions"
            visible={isChargebeeModalVisible}
            onOk={handleChargebeeOk}
            onCancel={handleChargebeeCancel}
          >
            <Iframe src={chargebeeUrl} width="100%" height="500px" />
          </Modal>
        </>
      )}
    </>
  );
};
