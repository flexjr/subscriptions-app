import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Modal, Row, Skeleton } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FlexBanner, RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";
import { store } from "../../store/store";

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
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Check here to configure the default column
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);
  const [currentOrgInfo, setCurrentOrgInfo] = useState<{ name: string } | undefined>({
    name: "⌛...",
  });

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

      const orgInfo = await getData<{ name: string }>(`${API_URL}/organizations/current_org`, accessToken, signal)
        .then(({ name }) => {
          return { name };
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
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <FlexBanner>{currentOrgInfo?.name}</FlexBanner>
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
        </>
      )}
    </>
  );
};
