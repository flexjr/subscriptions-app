import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Skeleton, Select, Form, Row, Col, Button, Divider } from "antd";
import { format } from "date-fns";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import { RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

const Field = styled(Col)`
  font-weight: 500;
`;
interface StateType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userId?: string;
}

export const SubscriptionsMine: React.FunctionComponent = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCancellationLoading, setIsCancellationLoading] = useState(false);
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
  const location = useLocation<StateType>();
  const history = useHistory();

  const userId = location.state?.userId;

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

      await getData<{ result }>(`${API_URL}/subscriptions/list_subscription/${userId}`, accessToken, signal)
        .then(({ result }) => {
          result.current_term_start = format(new Date(result?.current_term_start), "d MMM yyyy");
          result.current_term_end = format(new Date(result?.current_term_end), "d MMM yyyy");
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
  }, [getAccessTokenSilently, userId]);

  const handleCancellation = (): void => {
    setIsCancellationLoading(true);
    const cancel = async (): Promise<{ message } | undefined> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      return await postData<{ message }>(`${API_URL}/subscriptions/cancel_subscription`, accessToken, signal, {
        userId: userId,
      })
        .then(({ message }) => {
          setIsCancellationLoading(false);
          history.push({
            pathname: "/flex/organization/subscriptions/manage",
            state: {
              message:
                "Your subscription has been cancelled and will not be billed at the next billing cycle. We hope to see you again soon!",
            },
          });
          return { message };
        })
        .catch((error) => {
          console.error(error);
          history.push({
            pathname: "/flex/subscription/cancel-failed",
          });
          setIsCancellationLoading(false);
          return undefined;
        });
    };

    cancel();
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
                <Row>
                  <Col md={24}>
                    <p>Your current subscription plan entitles your account to: </p>
                    <ul>
                      <li>Placeholder</li>
                    </ul>
                  </Col>
                </Row>
                <Divider />
                <h3>You will be cancelling for</h3>
                <Row style={{ paddingBottom: "8px" }}>
                  <Field md={12}>User Account</Field>
                  <Col md={12}>{subscriptionInfo?.email}</Col>
                </Row>
                <Row style={{ paddingBottom: "8px" }}>
                  <Field md={12}>Plan Name</Field>
                  <Col md={12}>{subscriptionInfo?.subscription_plan}</Col>
                </Row>
                <Row style={{ paddingBottom: "8px" }}>
                  <Field md={12}>Current Billing Cycle</Field>
                  <Col md={12}>
                    {subscriptionInfo?.current_term_start} – {subscriptionInfo?.current_term_end}
                  </Col>
                </Row>
                <Divider />
                <Form name="basic" layout="vertical">
                  <Row>
                    <Col md={24}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        onClick={handleCancellation}
                        loading={isCancellationLoading}
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
