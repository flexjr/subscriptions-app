import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Skeleton, Modal, Space, notification } from "antd";
import { format } from "date-fns";
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
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);

  const [isChargebeeModalVisible, setIsChargebeeModalVisible] = useState(false);
  const [chargebeeUrl, setChargebeeUrl] = useState("");

  const { getAccessTokenSilently } = useAuth0();
  const { subscriptionPlanFriendlyName, subscriptionPlanStatus } = useFlex();

  const handleRenewSubscription = (userId: string): void => {
    setIsButtonLoading(true);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      await postData<{ data }>(`${API_URL}/subscriptions/renew_subscription`, accessToken, signal)
        .then(({ data }) => {
          openNotification("success", "Subscription successfully renewed!");
        })
        .catch((error) => {
          openNotification("error", "Error occured in subscription renewal. Please contact our customer support.");
          return undefined;
        });

      setIsButtonLoading(false);

      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  };

  const openNotification = (type: string, description: string): void => {
    if (type == "success") {
      notification.success({
        message: "Subscription renewed",
        description: description,
      });
    } else if (type == "error") {
      notification.error({
        message: "Error occurred",
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

  const columns = [
    {
      title: "User ID",
      dataIndex: "user_id",
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
    },
    {
      title: "Current Term Start",
      dataIndex: "current_term_start",
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return format(new Date(record.current_term_start), "d MMM yyyy");
      },
    },
    {
      title: "Current Term End",
      dataIndex: "current_term_end",
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
    },
    {
      title: "Action",
      key: "action",
      sorter: true,
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

      setIsButtonLoading(false);
    };
    fetchData();
  };

  const handleChargebeeOk = (): void => {
    setIsChargebeeModalVisible(false);
  };
  const handleChargebeeCancel = (): void => {
    setIsChargebeeModalVisible(false);
  };

  return (
    <>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <RoundedCard style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleChargebeeSSO} loading={isButtonLoading}>
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
