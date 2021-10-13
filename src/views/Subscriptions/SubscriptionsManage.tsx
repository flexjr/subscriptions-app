import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Skeleton, Modal } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../../shared";

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

export const SubscriptionsManage: React.FunctionComponent = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);

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

  const match = useRouteMatch<MatchProps>("/flex/organization/subscriptions/:path");
  console.log(match?.params);

  return (
    <>
      <h2>My Organization’s Subscriptions</h2>
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
