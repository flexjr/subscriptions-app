import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Row, Col, Typography, Card, Tabs, Skeleton } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { API_URL } from "../../utils";

const { Title } = Typography;
const { TabPane } = Tabs;

const RoundedCard = styled(Card)`
  border-radius: 10px;
`;

const UserDetails: React.FunctionComponent = () => {
  const { user } = useAuth0();

  if (!user) {
    return (
      <Row style={{ marginTop: "-8px" }}>
        <Skeleton
          paragraph={{
            rows: 1,
          }}
          active
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </Row>
    );
  } else {
    return (
      <>
        <strong>
          {user?.given_name} {user?.family_name}
        </strong>
      </>
    );
  }
};

export const UserSettings: React.FunctionComponent = () => {
  const { user, getIdTokenClaims } = useAuth0();
  const [additionalUserInfo, setAdditionalUserInfo] = useState({
    id: -1 as number,
    email: "" as string,
    firstname: "" as string,
    lastname: "" as string,
    mobile: "" as string,
  });

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getSavedCards = async () => {
      try {
        const idToken = await (await getIdTokenClaims()).__raw;
        const apiUrl = `${API_URL}/users/current_user_details`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          signal,
        });
        const data = await response.json();
        setAdditionalUserInfo(data.data[0]);
      } catch (e) {
        console.error(e.message);
      }
    };

    getSavedCards();

    // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
    return function cleanup() {
      abortController.abort();
    };
  }, [getIdTokenClaims]);

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
                      <Col>
                        <Avatar size={64} src={user?.picture} />
                      </Col>
                      <Col style={{ marginLeft: "16px" }}>
                        <Row>
                          <UserDetails />
                        </Row>
                        <Row>{user?.email}</Row>
                      </Col>
                      <Col style={{ marginLeft: "48px" }}>
                        <Row>
                          {additionalUserInfo?.mobile}
                          <span
                            style={{
                              paddingLeft: "20px",
                              color: "rgb(38, 203, 147)",
                              fontWeight: 500,
                            }}
                          >
                            Verified
                          </span>
                        </Row>
                        <Row>
                          Language: <strong>English (US)</strong>
                        </Row>
                      </Col>
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
