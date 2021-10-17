import { useAuth0 } from "@auth0/auth0-react";
import { Skeleton, Tabs, Typography } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FlexBanner } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../../shared";
import { SubscriptionsManage } from "./SubscriptionsManage";
import { SubscriptionsUpgrade } from "./SubscriptionsUpgrade";

const { Title } = Typography;
const { TabPane } = Tabs;

interface MatchProps {
  path: string;
}

export const OrgSubscriptions: React.FunctionComponent = () => {
  const history = useHistory();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentOrgInfo, setCurrentOrgInfo] = useState<{ company_name: string } | undefined>({
    company_name: "⌛...",
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

      setCurrentOrgInfo(orgInfo);
      setIsPageLoading(false);
      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  }, [getAccessTokenSilently]);

  const match = useRouteMatch<MatchProps>("/flex/organization/subscriptions/:path");

  return (
    <>
      <Title level={3}>Subscriptions</Title>
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
              <SubscriptionsUpgrade />
            </TabPane>
            <TabPane tab="Manage Subscriptions" key="manage">
              <SubscriptionsManage />
            </TabPane>
          </Tabs>
        </>
      )}
    </>
  );
};
