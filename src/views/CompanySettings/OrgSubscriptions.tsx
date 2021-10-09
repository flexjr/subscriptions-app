import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Skeleton, Tabs, Modal } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FlexBanner, RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

const { TabPane } = Tabs;

const columns = [
  {
    title: "User ID",
    dataIndex: "id",
  },
  {
    title: "First Name",
    dataIndex: "first_name",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
  },
  {
    title: "Member's Email",
    dataIndex: "email",
  },
  {
    title: "Subscription Plan",
    dataIndex: "subscription_plan",
  },
];

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

interface MatchProps {
  path: string;
}

export const OrgSubscriptions: React.FunctionComponent = () => {
  const history = useHistory();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Check here to configure the default column
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);
  const [currentOrgInfo, setCurrentOrgInfo] = useState<{ company_name: string } | undefined>({
    company_name: "⌛...",
  });
  const [isChargebeeModalVisible, setIsChargebeeModalVisible] = useState(false);
  const [chargebeeUrl, setChargebeeUrl] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const orgUsers = await getData<{ data }>(`${API_URL}/organizations/current_org_users`, accessToken, signal)
        .then(({ data }) => {
          // Need to add key to each user
          for (let i = 0; i < data.length; i++) {
            data[i].key = data[i].id;
          }
          return data;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      const orgInfo = await getData<{ company_name: string }>(
        `${API_URL}/organizations/current_org`,
        accessToken,
        signal
      )
        .then(({ company_name }) => {
          return { company_name };
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      setCurrentOrgUsers(orgUsers);
      setCurrentOrgInfo(orgInfo);
      setIsPageLoading(false);
      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  }, [getAccessTokenSilently]);

  const handleUpgrade = (): void => {
    setIsButtonLoading(true);

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      await postData<{ data }>(`${API_URL}/subscriptions/chargebee_customer`, accessToken, signal)
        .then(({ data }) => {
          history.push({
            pathname: "/flex/subscription/checkout/plan-selection",
            state: {
              userIds: selectedRowKeys,
            },
          });
          return data;
        })
        .catch((error) => {
          console.error(error);
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
          console.log(access_url);
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

  const onSelectChange = (selectedRowKeys): void => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const match = useRouteMatch<MatchProps>("/flex/organization/subscriptions/:path");
  console.log(match?.params);

  return (
    <>
      <h2>My Organization’s Subscriptions</h2>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <FlexBanner>{currentOrgInfo?.company_name}</FlexBanner>
          <Tabs
            defaultActiveKey="upgrade"
            activeKey={match?.params.path ? match.params.path : "upgrade"}
            onChange={(key) => {
              history.push(`/flex/organization/subscriptions/${key}`);
            }}
            tabBarGutter={10}
          >
            <TabPane tab="Upgrades" key="upgrade">
              <RoundedCard style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={handleUpgrade} disabled={!hasSelected} loading={isButtonLoading}>
                    Upgrade
                  </Button>{" "}
                  <Button type="primary">Downgrade</Button>
                  <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} users` : ""}</span>
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={currentOrgUsers} />
              </RoundedCard>
            </TabPane>
            <TabPane tab="Manage Subscriptions" key="manage">
              <RoundedCard style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={handleChargebeeSSO} loading={isButtonLoading}>
                    Manage Subscriptions
                  </Button>
                </div>
                <Table columns={columns} dataSource={currentOrgUsers} />
              </RoundedCard>
            </TabPane>
          </Tabs>
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
