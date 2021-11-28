import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Skeleton, Form, Row, Col, Button, Divider, notification } from "antd";
import { format } from "date-fns";
import React, { useState } from "react";
import { useEffect } from "react";
import { RoundedCard } from "../../components/Shared";
import { useFlex } from "../../hooks";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

const Field = styled(Col)`
  font-weight: 500;
`;

export const SubscriptionsMine: React.FunctionComponent = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    current_term_end: 0,
    current_term_start: 0,
    email: null,
    email_verified: null,
    event_id: null,
    first_name: null,
    id: null,
    last_name: null,
    mobile: null,
    mobile_verified: null,
    org_id: null,
    status: null,
    subscription_id: null,
    subscription_plan: null,
    user_id: null,
  });

  const [isLoading, setIsLoading] = useState({
    request_upgrade: false,
  });

  const { getAccessTokenSilently } = useAuth0();
  const { subscriptionPlanFriendlyName } = useFlex();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      await getData<{ result }>(`${API_URL}/subscriptions/my_subscription`, accessToken, signal)
        .then(({ result }) => {
          result = result.data[0];
          result.current_term_start = format(new Date(result?.current_term_start), "d MMM yyyy");
          result.current_term_end = format(new Date(result?.current_term_end), "d MMM yyyy");
          console.log(result);
          setSubscriptionInfo(result);
          return result;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });

      setIsPageLoading(false);

      // Need to unsubscribe to API calls if the user moves away from the page before fetch() is done
      return function cleanup() {
        abortController.abort();
      };
    };
    fetchData();
  }, [getAccessTokenSilently]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInvite = (): void => {
    setIsLoading({ ...isLoading, request_upgrade: true });

    const inviteUserToOrg = async (): Promise<{ message } | undefined> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      return await postData<{ message }>(`${API_URL}/subscriptions/request_upgrade`, accessToken, signal)
        .then(({ message }) => {
          setIsLoading({ ...isLoading, request_upgrade: false });
          openNotification("success", "We've sent a request to your company admin to upgrade your account!");
          return { message };
        })
        .catch((error) => {
          console.error(error);
          openNotification(
            "error",
            "Something went wrong! We failed to submit your request for an upgrade, please try again in a bit!"
          );
          setIsLoading({ ...isLoading, request_upgrade: false });
          return undefined;
        });
    };

    inviteUserToOrg();
  };

  const openNotification = (type: string, description: string): void => {
    if (type == "success") {
      notification.success({
        message: "Upgrade requested",
        description: description,
      });
    } else if (type == "error") {
      notification.error({
        message: "Failed to request",
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
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <Row>
            <Col span={24}>
              <RoundedCard style={{ marginTop: 16 }}>
                <h3>My subscription</h3>
                {!subscriptionInfo?.subscription_plan || subscriptionInfo?.subscription_plan == "FLEX_STARTER" ? (
                  <p>
                    You currently do not have any subscription, you can send a request to your company admin to request
                    for an upgrade.
                  </p>
                ) : (
                  <p>Your subscription is currently billed to your company.</p>
                )}

                {subscriptionInfo?.subscription_plan == null ||
                  (subscriptionInfo?.subscription_plan !== "FLEX_STARTER" && (
                    <>
                      <Divider />
                      <Row style={{ paddingBottom: "8px" }}>
                        <Field md={6}>User Account</Field>
                        <Col md={12}>{subscriptionInfo?.email}</Col>
                      </Row>
                      <Row style={{ paddingBottom: "8px" }}>
                        <Field md={6}>Plan Name</Field>
                        <Col md={12}>{subscriptionPlanFriendlyName(subscriptionInfo?.subscription_plan)}</Col>
                      </Row>
                      <Row style={{ paddingBottom: "8px" }}>
                        <Field md={6}>Current Billing Cycle</Field>
                        <Col md={12}>
                          {subscriptionInfo?.current_term_start ? subscriptionInfo?.current_term_start : ""} –{"  "}
                          {subscriptionInfo?.current_term_end ? subscriptionInfo?.current_term_end : ""}
                        </Col>
                      </Row>
                      <Divider />
                    </>
                  ))}

                <Form name="basic" layout="vertical">
                  <Row>
                    <Col md={24}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={isLoading.request_upgrade}
                        onClick={() => handleInvite()}
                      >
                        Request for upgrade
                      </Button>{" "}
                    </Col>
                  </Row>
                </Form>
              </RoundedCard>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
