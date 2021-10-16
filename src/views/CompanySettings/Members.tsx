import { useAuth0 } from "@auth0/auth0-react";
import { Table, Skeleton, Form, Input, Row, Col, Button, notification } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { FlexBanner, RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

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

export const Members: React.FunctionComponent = () => {
  const [inviteIsLoading, setInviteIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentOrgUsers, setCurrentOrgUsers] = useState([]);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInvite = (values: any): void => {
    setInviteIsLoading(true);

    const inviteUserToOrg = async (): Promise<{ message } | undefined> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      return await postData<{ message }>(`${API_URL}/organizations/invite_user`, accessToken, signal, values)
        .then(({ message }) => {
          setInviteIsLoading(false);
          openNotification("success", "Invited user successfully!");
          return { message };
        })
        .catch((error) => {
          console.error(error);
          openNotification("error", "Failed to invite user.");
          setInviteIsLoading(false);
          return undefined;
        });
    };

    inviteUserToOrg();
  };

  const openNotification = (type: string, description: string): void => {
    if (type == "success") {
      notification.success({
        message: "Member invited",
        description: description,
      });
    } else if (type == "error") {
      notification.error({
        message: "Failed to invite",
        description: description,
      });
    } else {
      notification.open({
        message: "Notification Title",
        description:
          "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
        onClick: () => {
          console.log("Notification Clicked!");
        },
      });
    }
  };

  return (
    <>
      <h2>Company Settings</h2>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <FlexBanner>{currentOrgInfo?.company_name}</FlexBanner>
          <RoundedCard style={{ marginTop: 16 }}>
            <h3>Invite New User</h3>
            <p>We will send an invitation email that is valid for 7 days</p>
            <div>New Member's Email</div>
            <Form name="basic" layout="vertical" onFinish={handleInvite}>
              <Row>
                <Col
                  md={16}
                  style={{
                    paddingRight: "16px",
                  }}
                >
                  <Form.Item name="email" rules={[{ required: true, message: "This field is required" }]}>
                    <Input placeholder="Enter User Email Here" type="email" size="large" />
                  </Form.Item>
                </Col>
                <Col md={8}>
                  <Button type="primary" htmlType="submit" loading={inviteIsLoading} size="large">
                    Invite
                  </Button>
                </Col>
              </Row>
            </Form>
          </RoundedCard>
          <RoundedCard style={{ marginTop: 16 }}>
            <h3>Users</h3>
            <Table columns={columns} dataSource={currentOrgUsers} />
          </RoundedCard>
        </>
      )}
    </>
  );
};
