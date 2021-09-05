import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Modal, Row } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { store } from "../../store/store";
import { API_URL, AUTH0_API_AUDIENCE } from "../../utils";

const columns = [
  {
    title: "User ID",
    dataIndex: "id",
  },
  {
    title: "First Name",
    dataIndex: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
  },
  {
    title: "Member's Email",
    dataIndex: "email",
  },
  {
    title: "Plan Type",
    dataIndex: "subscriptionPlanType",
  },
];

export const OrgSubscriptions: React.FunctionComponent = () => {
  const history = useHistory();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Check here to configure the default column
  const [loading, setLoading] = useState(false);
  const [iframeRefresh, setIframeRefresh] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isManageSubscriptionsModalVisible, setIsManageSubscriptionsModalVisible] = useState(false);
  const [estimate, setEstimate] = useState(0);
  const [hostedPaymentMethodPageUrl, setHostedPaymentMethodPageUrl] = useState("");
  const [manageSubscriptionsUrl, setManageSubscriptionsUrl] = useState("");
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);
  const [currentOrgInfo, setCurrentOrgInfo] = useState({
    name: "⌛...",
  });
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getCurrentOrgUsers = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "read:current_user openid profile email",
      });

      try {
        const apiUrl = `${API_URL}/organizations/current_org_users`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal,
        });
        const data = await response.json();
        const users = data["data"];
        for (let i = 0; i < users.length; i++) {
          users[i].key = users[i].id;
        }
        console.log(users);
        setCurrentOrgUsers(users);
      } catch (e) {
        console.error(e.message);
      }
    };

    getCurrentOrgUsers();

    const getOrgInfo = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "read:current_user openid profile email",
      });

      try {
        const apiUrl = `${API_URL}/organizations/current_org`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal,
        });
        const data = await response.json();
        setCurrentOrgInfo(data["data"][0]);
      } catch (e) {
        console.error(e.message);
      }
    };

    getOrgInfo();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  }, [getAccessTokenSilently]);

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const handlePaymentOk = (): void => {
    setIsPaymentModalVisible(false);
  };

  const handlePaymentCancel = (): void => {
    setIsPaymentModalVisible(false);
  };

  const handleManageSubscriptionsOk = (): void => {
    setIsManageSubscriptionsModalVisible(false);
  };

  const handleManageSubscriptionsCancel = (): void => {
    setIsManageSubscriptionsModalVisible(false);
  };

  const handleUpgrade = () => {
    const abortController = new AbortController();
    const { signal } = abortController;

    console.log(selectedRowKeys);

    setLoading(true);
    setTimeout(
      () =>
        history.push({
          pathname: "/platform/subscription/checkout",
          state: {
            userIds: selectedRowKeys,
          },
        }),
      1000
    );

    // const getPaymentSourcesCount = async () => {
    //   try {
    //     const response = fetch(`${API_URL}/chargebee/payment_source/count?id=4851`, {
    //       signal,
    //     })
    //       .then((response) => response.json())
    //       .then((data) => {
    //         console.log(data);
    //         if (data.cards_found == 0) {
    //           const getHostedPaymentMethodPage = async () => {
    //             const response = fetch(`${API_URL}/chargebee/payment_source/customer/manage?id=4851`, {
    //               signal,
    //             })
    //               .then((response) => response.json())
    //               .then((data2) => {
    //                 setHostedPaymentMethodPageUrl(data2.url);
    //                 setIframeRefresh(iframeRefresh + 1);
    //                 setIsModalVisible(true);
    //                 setLoading(false);
    //               });
    //           };
    //           getHostedPaymentMethodPage();
    //         } else {
    //           const getEstimate = async () => {
    //             const response = fetch(`${API_URL}/chargebee/subscriptions/estimate?id=4851`, {
    //               signal,
    //             })
    //               .then((response) => response.json())
    //               .then((data2) => {
    //                 setEstimate(data2.amount_due / 100);
    //                 setIsPaymentModalVisible(true);
    //                 setLoading(false);
    //               });
    //           };
    //           getEstimate();
    //         }
    //       });
    //   } catch (e) {
    //     console.error(e.message);
    //     setLoading(false);
    //   }
    // };

    // getPaymentSourcesCount();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  };

  const handleManageSubscriptions = () => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const getPaymentSourcesCount = async () => {
      try {
        const response = fetch(`${API_URL}/chargebee/sso?id=4851`, {
          signal,
        })
          .then((response) => response.json())
          .then((data) => {
            setManageSubscriptionsUrl(data.access_url);
            setIsManageSubscriptionsModalVisible(true);
          });
      } catch (e) {
        console.error(e.message);
        setLoading(false);
      }
    };

    getPaymentSourcesCount();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  };

  const onSelectChange = (selectedRowKeys): void => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <h2>My Organization’s Subscriptions</h2>
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
        {currentOrgInfo?.name}
      </div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Button type="primary" onClick={handleUpgrade} disabled={!hasSelected} loading={loading}>
          Upgrade
        </Button>{" "}
        <Button type="primary">Downgrade</Button>{" "}
        <Button type="primary" onClick={handleManageSubscriptions}>
          Manage Subcriptions
        </Button>
        <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} users` : ""}</span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={currentOrgUsers} />
      <Modal title="Add Card" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <iframe src={hostedPaymentMethodPageUrl} key={iframeRefresh} height="500" width="100%" frameBorder="0" />
      </Modal>
      <Modal title="Upgrade! 🎉" visible={isPaymentModalVisible} onOk={handlePaymentOk} onCancel={handlePaymentCancel}>
        <p>Your monthly recurring payment is SGD {estimate}</p>
        <p>By making payment, you agree to our Subscribers Terms and Conditions blah blah</p>
        <p>
          NOTE: After clicking Make Payment, will need to call OUR APIs to process payment for SGD 7.99 x (users
          picked)!!
        </p>
      </Modal>
      <Modal
        title="Manage Subscriptions"
        visible={isManageSubscriptionsModalVisible}
        onOk={handleManageSubscriptionsOk}
        onCancel={handleManageSubscriptionsCancel}
      >
        <iframe src={manageSubscriptionsUrl} key={iframeRefresh} height="500" width="100%" frameBorder="0" />
      </Modal>
    </>
  );
};
