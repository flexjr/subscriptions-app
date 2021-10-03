import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Skeleton, Tabs, Row, Col, Input } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHistory } from "react-router-dom";
import { FlexBanner, RoundedCard } from "../../components/Shared";
import { API_URL, AUTH0_API_AUDIENCE, getData, postData } from "../../shared";

const { TabPane } = Tabs;
const { TextArea } = Input;

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

export const Debugger: React.FunctionComponent = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [auth0Token, setAuth0Token] = useState("Loading Auth0 token...");

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });
      console.log(accessToken);
      setAuth0Token(accessToken);
    };
    fetchData();
    setIsPageLoading(false);
  }, []);

  return (
    <>
      <h2>Debugger</h2>
      {isPageLoading ? (
        <Skeleton active />
      ) : (
        <>
          <FlexBanner>{user?.email}</FlexBanner>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Auth0 JWT Token" key="1">
              <RoundedCard style={{ marginTop: 16 }}>
                <Row
                  style={{
                    marginBottom: "8px",
                  }}
                >
                  This is your Auth0 JWT token. Warning: This is very sensitive and the bearer of this token can
                  authenticate as you. You can go to{" "}
                  <a href="https://api.flexjr.one/docs" target="_blank" rel="noopener noreferrer">
                    our API docs
                  </a>{" "}
                  and put it under Auth0HTTPBearer (http, Bearer) and click Authorize.
                </Row>
                <Row
                  style={{
                    marginBottom: "8px",
                  }}
                >
                  <CopyToClipboard text={auth0Token}>
                    <Button>Copy</Button>
                  </CopyToClipboard>
                </Row>
                <Row>
                  <Col span={24}>
                    <TextArea
                      value={auth0Token}
                      placeholder="Controlled autosize"
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </RoundedCard>
            </TabPane>
          </Tabs>
        </>
      )}
    </>
  );
};
