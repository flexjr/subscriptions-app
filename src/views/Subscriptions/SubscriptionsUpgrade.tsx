import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Skeleton } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
import { useFlex } from "../../hooks";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

export const SubscriptionsUpgrade: React.FunctionComponent = () => {
  const history = useHistory();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Check here to configure the default column
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);

  const { getAccessTokenSilently } = useAuth0();
  const { subscriptionPlanFriendlyName } = useFlex();

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
      // eslint-disable-next-line react/display-name
      render: (text, record) => {
        return subscriptionPlanFriendlyName(record.subscription_plan);
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

      await getData<{ company_name: string }>(`${API_URL}/organizations/current_org`, accessToken, signal)
        .then(({ company_name }) => {
          return { company_name };
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

  const onSelectChange = (selectedRowKeys, selectedRows): void => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // getCheckboxProps: ({ record }) => {
    //   console.log(record);
    // },
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <RoundedCard style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={handleUpgrade} disabled={!hasSelected} loading={isButtonLoading}>
                Upgrade
              </Button>{" "}
              <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} users` : ""}</span>
            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={currentOrgUsers} />
          </RoundedCard>
        </>
      )}
    </>
  );
};
