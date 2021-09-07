import { useAuth0, User } from "@auth0/auth0-react";
import { Row, Col, Typography, Tabs, Skeleton, Button } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { RoundedCard } from "../../components/Shared";
import { Semibold } from "../../components/Shared/Common";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../../shared";
import { CurrentUserInfo } from "../../types";

const { Title } = Typography;
const { TabPane } = Tabs;

interface UserDetailsProps {
  user: User | undefined;
  additionalUserInfo: CurrentUserInfo | undefined;
}

const UserDetails: React.FunctionComponent<UserDetailsProps> = ({ user, additionalUserInfo }) => {
  return (
    <>
      <Col md={2}>
        <Avatar size={64} src={user?.picture} />
      </Col>
      <Col md={4}>
        <Row>
          <Semibold>
            {user?.given_name} {user?.family_name}
          </Semibold>
        </Row>
        <Row>{user?.email}</Row>
      </Col>
      <Col md={8}>
        <Row>
          <Semibold>{additionalUserInfo?.mobile}</Semibold>
          <span
            style={{
              paddingLeft: "20px",
              color: "rgb(38, 203, 147)",
              fontWeight: 500,
            }}
          >
            Verified <img src="https://app.fxr.one/flex/static/media/green-check-circle.b3f4a4fa.svg" />
          </span>
        </Row>
        <Row>
          <span>Language:</span> <Semibold>English (US)</Semibold>
        </Row>
      </Col>
      <Col md={10}>
        <Button
          type="primary"
          style={{
            float: "right",
          }}
        >
          Edit Profile
        </Button>
      </Col>
    </>
  );
};

export const UserSettings: React.FunctionComponent = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [additionalUserInfo, setAdditionalUserInfo] = useState<undefined | CurrentUserInfo>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const userInfo = await getData<{ data: CurrentUserInfo }>(
        `${API_URL}/users/current_user_info`,
        accessToken,
        signal
      )
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      setAdditionalUserInfo(userInfo);
      setIsLoading(false);

      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  }, [getAccessTokenSilently]);

  return (
    <>
      <Row>
        <Col md={24}>
          <Title level={3}>User Settings</Title>
        </Col>
      </Row>
      <Row>
        <Col
          md={24}
          style={{
            paddingRight: "16px",
          }}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="User Profile" key="1">
              <RoundedCard>
                <Row>
                  <Col md={24}>
                    <Row>
                      {isLoading ? (
                        <Skeleton avatar paragraph={{ rows: 1 }} active />
                      ) : (
                        <UserDetails user={user} additionalUserInfo={additionalUserInfo} />
                      )}
                    </Row>
                  </Col>
                </Row>
              </RoundedCard>
            </TabPane>
            <TabPane tab="My Subsidiaries" key="2">
              My Subsidiaries
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
