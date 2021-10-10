import Icon, { CreditCardOutlined, DownOutlined, LogoutOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Col, Layout, Menu, Popover, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./NavbarSide.css";

import { ReactComponent as FlexPhysicalCardSvg } from "./flex-icon-card-physical.svg";
import { ReactComponent as FlexVirtuallCardSvg } from "./flex-icon-card-virtual.svg";
import { ReactComponent as FlexCreditLineSvg } from "./flex-icon-credit-line.svg";
import { ReactComponent as FlexHomeSvg } from "./flex-icon-home.svg";
import { ReactComponent as FlexSettingsSvg } from "./flex-icon-settings.svg";
import { ReactComponent as FlexTransactionsSvg } from "./flex-icon-transactions.svg";

const { Sider } = Layout;

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
`;

const FlexMenuItemCol = styled(Col)`
  margin-top: 0px;
  width: 45px;
`;

const FlexMenuUserProfileRow = styled(Row)`
  margin: 10px 37px;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
`;

const FlexHomeIcon = (props): JSX.Element => <Icon component={FlexHomeSvg} {...props} />;
const FlexPhysicalCardIcon = (props): JSX.Element => <Icon component={FlexPhysicalCardSvg} {...props} />;
const FlexVirtualCardIcon = (props): JSX.Element => <Icon component={FlexVirtuallCardSvg} {...props} />;
const FlexTransactionsIcon = (props): JSX.Element => <Icon component={FlexTransactionsSvg} {...props} />;
const FlexCreditLineIcon = (props): JSX.Element => <Icon component={FlexCreditLineSvg} {...props} />;
const FlexSettingsIcon = (props): JSX.Element => <Icon component={FlexSettingsSvg} {...props} />;

interface FlexUserSettingsPopoverProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export const NavbarSide: React.FunctionComponent = () => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        background: "rgb(26, 40, 49)",
      }}
      width="260px"
    >
      <Logo />
      <Menu theme="light" mode="vertical" defaultSelectedKeys={[location.pathname]} className="flex-menu">
        <Menu.Item key="/flex/dashboard">
          <Link to="/flex/dashboard">
            <Row>
              <FlexMenuItemCol>
                <FlexHomeIcon style={{ fontSize: "20px" }} />
              </FlexMenuItemCol>
              <Col>Home</Col>
            </Row>
          </Link>
        </Menu.Item>

        {isAuthenticated ? (
          <Menu.Item key="/flex/physical-cards/my-card">
            <Link to="/flex/physical-cards/my-card">
              <Row>
                <FlexMenuItemCol>
                  <FlexPhysicalCardIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Physical Card</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="/flex/virtual-cards">
            <Link to="/flex/virtual-cards">
              <Row>
                <FlexMenuItemCol>
                  <FlexVirtualCardIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Virtual Card</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="/flex/transactions">
            <Link to="/flex/transactions">
              <Row>
                <FlexMenuItemCol>
                  <FlexTransactionsIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Transactions</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="/flex/flex-plus-credit">
            <Link to="/flex/flex-plus-credit">
              <Row>
                <FlexMenuItemCol>
                  <FlexCreditLineIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Flex Plus Credit</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        <Menu.Divider style={{ backgroundColor: "rgb(50, 69, 81)" }} />

        {isAuthenticated ? (
          <Menu.Item key="/flex/organization/subscriptions">
            <Link to="/flex/organization/subscriptions">
              <Row>
                <FlexMenuItemCol>
                  <TagOutlined style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Subscriptions</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="/flex/organization/saved-cards">
            <Link to="/flex/organization/saved-cards">
              <Row>
                <FlexMenuItemCol>
                  <CreditCardOutlined style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Payment Methods</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {/* {isAuthenticated ? (
          <Menu.Item key="/debugger">
            <Link to="/debugger">
              <Row>
                <FlexMenuItemCol>
                  <InfoCircleOutlined style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Dev Tools</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )} */}

        {isAuthenticated ? (
          <Menu.Item key="/flex/organization/members">
            <Link to="/flex/organization/members">
              <Row>
                <FlexMenuItemCol>
                  <FlexSettingsIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Company Settings</Col>
              </Row>
            </Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <FlexMenuUserProfileRow
            style={{
              rowGap: "0px",
            }}
          >
            <Col md={6}>
              <UserOutlined style={{ fontSize: "20px" }} />
            </Col>
            <Col md={16}>
              <div>{user?.name}</div>
              <div>Admin</div>
            </Col>
            <Col md={2}>
              <Popover
                content={<FlexUserSettingsPopover user={user} />}
                placement="right"
                overlayClassName="user-settings-popover"
                trigger="click"
              >
                <DownOutlined />
              </Popover>
            </Col>
          </FlexMenuUserProfileRow>
        ) : (
          <></>
        )}
      </Menu>
    </Sider>
  );
};

const RoleDiv = styled.div`
  padding: 15px 15px 0px 20px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: rgb(86, 96, 109);
`;

const CompanyDiv = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 22px;
  padding: 10px 15px 15px 20px;
  color: rgb(26, 40, 49);
`;

const FlexUserSettingsPopover: React.FunctionComponent<FlexUserSettingsPopoverProps> = () => {
  const { logout, user } = useAuth0();
  return (
    <>
      <div
        style={{
          background: "rgb(51, 63, 71)",
          borderRadius: "6px 6px 0px 0px",
        }}
      >
        <Row
          style={{
            padding: "15px",
            flexFlow: "unset",
            fontWeight: 600,
            fontSize: "14px",
            color: "rgb(255, 255, 255)",
          }}
        >
          <Col />
          <Col
            style={{
              marginLeft: "15px",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "23px",
              alignSelf: "center",
            }}
          >
            {user?.name}
          </Col>
        </Row>
      </div>
      <RoleDiv>Admin</RoleDiv>
      <CompanyDiv>Example Co Pte Ltd</CompanyDiv>
      <Menu theme="light" mode="vertical" defaultSelectedKeys={[location.pathname]} className="flex-menu">
        <Menu.Item key="/flex/user/profile" icon={<UserOutlined />}>
          <Link to="/flex/user/profile">User Profile</Link>
        </Menu.Item>
        <Menu.Item
          key="logout"
          onClick={() => {
            localStorage.clear();
            logout({
              returnTo: window.location.origin,
            });
          }}
          icon={<LogoutOutlined />}
        >
          Logout
        </Menu.Item>
      </Menu>
    </>
  );
};
