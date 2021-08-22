import { Button, Table, Modal } from "antd";
import React, { useState } from "react";
import { API_URL } from "../../utils";

const columns = [
  {
    title: "User ID",
    dataIndex: "user_id",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Member's Email",
    dataIndex: "email",
  },
  {
    title: "Invitation Sent On",
    dataIndex: "invitation_date",
  },
  {
    title: "Account Status",
    dataIndex: "account_status",
  },
  {
    title: "Plan Type",
    dataIndex: "subscription_plan",
  },
  {
    title: "Actions",
    dataIndex: "actions",
  },
];

const data: object[] = [];
for (let i = 1; i < 30; i++) {
  data.push({
    key: i,
    user_id: `4851FX210${i}`,
    name: `Edward King ${i}`,
    email: "king@hooli.xyz",
    invitation_date: `Jul ${i}, 2021`,
    account_status: "Active",
    subscription_plan: "Flex Starter",
    actions: "",
  });
}

export const Members: React.FunctionComponent = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Check here to configure the default column
  const [loading, setLoading] = useState(false);
  const [iframeRefresh, setIframeRefresh] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isManageSubscriptionsModalVisible, setIsManageSubscriptionsModalVisible] = useState(false);

  const [estimate, setEstimate] = useState(0);

  const [hostedPaymentMethodPageUrl, setHostedPaymentMethodPageUrl] = useState("");

  const [manageSubscriptionsUrl, setManageSubscriptionsUrl] = useState("");

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
    setLoading(true);
    // // ajax request after empty completing
    // setTimeout(() => {
    //   setSelectedRowKeys([]);
    //   setLoading(false);
    // }, 1000);

    const abortController = new AbortController();
    const { signal } = abortController;

    const getPaymentSourcesCount = async () => {
      try {
        const response = fetch(`${API_URL}/chargebee/payment_source/count?id=4851`, {
          signal,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (data.cards_found == 0) {
              const getHostedPaymentMethodPage = async () => {
                const response = fetch(`${API_URL}/chargebee/payment_source/customer/manage?id=4851`, {
                  signal,
                })
                  .then((response) => response.json())
                  .then((data2) => {
                    setHostedPaymentMethodPageUrl(data2.url);
                    setIframeRefresh(iframeRefresh + 1);
                    setIsModalVisible(true);
                    setLoading(false);
                  });
              };
              getHostedPaymentMethodPage();
            } else {
              const getEstimate = async () => {
                const response = fetch(`${API_URL}/chargebee/subscriptions/estimate?id=4851`, {
                  signal,
                })
                  .then((response) => response.json())
                  .then((data2) => {
                    setEstimate(data2.amount_due / 100);
                    setIsPaymentModalVisible(true);
                    setLoading(false);
                  });
              };
              getEstimate();
            }
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
      <h2>Users</h2>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleUpgrade} disabled={!hasSelected} loading={loading}>
          Upgrade
        </Button>{" "}
        <Button type="primary">Downgrade</Button>{" "}
        <Button type="primary" onClick={handleManageSubscriptions}>
          Manage Subcriptions
        </Button>
        <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} users` : ""}</span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
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
