import { useAuth0, User } from "@auth0/auth0-react";
import { Row, Col, Typography, Tabs, Skeleton, Button } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";
import { RoundedCard } from "../../components/Shared";
import { Semibold } from "../../components/Shared/Common";
import { useFlex } from "../../hooks";
import { FlexUserInfo } from "../../types";

const { Title } = Typography;
const { TabPane } = Tabs;

export const UserSettings: React.FunctionComponent = () => {
  const { user } = useAuth0();
  const { flexUserInfo, isLoadingFlexUserInfo } = useFlex();

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
                      {isLoadingFlexUserInfo ? (
                        <Skeleton avatar paragraph={{ rows: 1 }} active />
                      ) : (
                        <UserDetails user={user} flexUserInfo={flexUserInfo} />
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

interface UserDetailsProps {
  user: User | undefined;
  flexUserInfo: FlexUserInfo | undefined;
}

const UserDetails: React.FunctionComponent<UserDetailsProps> = ({ user, flexUserInfo }) => {
  return (
    <>
      <Col md={2}>
        <Avatar size={64} src={user?.picture} />
      </Col>
      <Col md={6}>
        <Row>
          <Semibold>
            {flexUserInfo?.first_name} {flexUserInfo?.last_name}
          </Semibold>
        </Row>
        <Row>{user?.email}</Row>
      </Col>
      <Col md={8}>
        <Row>
          <Semibold>{flexUserInfo?.mobile}</Semibold>
          {flexUserInfo?.mobile && (
            <span
              style={{
                paddingLeft: "20px",
                color: "rgb(38, 203, 147)",
                fontWeight: 500,
              }}
            >
              Verified <img src="https://app.fxr.one/flex/static/media/green-check-circle.b3f4a4fa.svg" />
            </span>
          )}
        </Row>
        <Row>
          <span>Language:&nbsp;</span>
          <Semibold>English (US)</Semibold>
        </Row>
      </Col>
      <Col md={8}>
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
