import { InfoCircleOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { useClient } from "@splitsoftware/splitio-react";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlexMenuItem, FlexMenuItemCol } from ".";
import "./NavbarSide.css";

export const NavbarSideDevTools: React.FunctionComponent = () => {
  const { user } = useAuth0();

  // Split.io experiments
  const featureName = "FLEXJR_DEV_TOOLS";
  const accountClient = useClient(user?.email);
  const [readyAccountClient, setReadyAccountClient] = useState<SplitIO.IClient>();
  useEffect(() => {
    accountClient?.on(accountClient.Event.SDK_READY, () => {
      setReadyAccountClient(accountClient);
    });
  }, [accountClient]);

  if (readyAccountClient) {
    // `accountClient` is ready to evaluate treatments as usual. To see more information about the client API go to the docs for JavaScript SDK.
    const accountTreatments = readyAccountClient.getTreatments([featureName]);
    console.log(accountTreatments);

    if (accountTreatments[featureName] === "on") {
      return (
        <FlexMenuItem key="/debugger">
          <Link to="/debugger">
            <Row>
              <FlexMenuItemCol>
                <InfoCircleOutlined style={{ fontSize: "20px" }} />
              </FlexMenuItemCol>
              <Col>Dev Tools</Col>
            </Row>
          </Link>
        </FlexMenuItem>
      );
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};
