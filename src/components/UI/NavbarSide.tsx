import Icon, { CreditCardOutlined, DownOutlined, LogoutOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Col, Divider, Layout, Menu, Popover, Row, Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useFlex } from "../../hooks";
import { FlexUserInfo } from "../../types";
import { FlexPremiumLabel, FlexProLabel } from "../Shared";
import { ReactComponent as FlexPhysicalCardSvg } from "./flex-icon-card-physical.svg";
import { ReactComponent as FlexVirtuallCardSvg } from "./flex-icon-card-virtual.svg";
import { ReactComponent as FlexCreditLineSvg } from "./flex-icon-credit-line.svg";
import { ReactComponent as FlexHomeSvg } from "./flex-icon-home.svg";
import { ReactComponent as FlexSettingsSvg } from "./flex-icon-settings.svg";
import { ReactComponent as FlexTransactionsSvg } from "./flex-icon-transactions.svg";
import { NavbarSideDevTools } from ".";
import "./NavbarSide.css";

const { Sider } = Layout;

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
`;

export const FlexMenuItemCol = styled(Col)`
  margin-top: 0px;
  width: 45px;
`;

const FlexMenuUserProfileRow = styled(Row)`
  margin: 10px 37px;
  -webkit-box-align: center;
  align-items: center;
  cursor: pointer;
`;

const FlexMenu = styled(Menu)`
  background: transparent;
  border-right: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: rgb(186, 191, 193);

  & a {
    color: rgb(186, 191, 193);
  }

  .ant-menu-item {
    padding: 0px 37px;
    height: 52px;
    line-height: 52px;
  }
`;

export const FlexMenuItem = styled(Menu.Item)`
  &:hover {
    color: rgb(38, 203, 147);
    transition: none 0s ease 0s;
  }
  &:hover a {
    color: rgb(38, 203, 147);
    transition: none 0s ease 0s;
  }

  &.ant-menu-item-active {
    background-color: transparent;
  }

  &.ant-menu-item-active.ant-menu-item-selected {
    background-color: transparent;
    background-color: rgba(196, 196, 196, 0.15);
  }

  &.ant-menu-item-selected {
    color: rgb(38, 203, 147);
    background-color: rgba(196, 196, 196, 0.15) !important;
  }
  &.ant-menu-item-selected a {
    color: rgb(38, 203, 147);
  }
`;

const FlexPopoverMenu = styled(Menu)`
  border-right: none;
  border-radius: 0px 0px 6px 6px;
  padding: 0px 4px 2px;
  font-weight: 500;
  font-size: 14px;
  color: rgb(86, 96, 109);
  letter-spacing: 0.110416px;

  &.ant-menu-item-active {
    color: rgb(38, 203, 147);
  }
`;
const FlexPopoverMenuItem = styled(Menu.Item)`
  &:hover {
    color: rgb(38, 203, 147);
    transition: none 0s ease 0s;
  }
  &:hover a {
    color: rgb(38, 203, 147);
    transition: none 0s ease 0s;
  }

  &.ant-menu-item-selected {
    color: rgb(38, 203, 147);
    background-color: transparent !important;
  }
  &.ant-menu-item-selected a {
    color: rgb(38, 203, 147);
  }

  &.ant-menu-item-active span {
    color: rgb(38, 203, 147);
  }
`;

const FlexUserSettingsPopover = styled(Popover)``;

const FlexHomeIcon = (props): JSX.Element => <Icon component={FlexHomeSvg} {...props} />;
const FlexPhysicalCardIcon = (props): JSX.Element => <Icon component={FlexPhysicalCardSvg} {...props} />;
const FlexVirtualCardIcon = (props): JSX.Element => <Icon component={FlexVirtuallCardSvg} {...props} />;
const FlexTransactionsIcon = (props): JSX.Element => <Icon component={FlexTransactionsSvg} {...props} />;
const FlexCreditLineIcon = (props): JSX.Element => <Icon component={FlexCreditLineSvg} {...props} />;
const FlexSettingsIcon = (props): JSX.Element => <Icon component={FlexSettingsSvg} {...props} />;

const capitalize = (str: string | undefined): string => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return "";
  }
};

export const NavbarSide: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth0();
  const { flexUserInfo } = useFlex();

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
      <FlexMenu theme="light" mode="vertical" defaultSelectedKeys={[location.pathname]}>
        <FlexMenuItem key="/flex/dashboard">
          <Link to="/flex/dashboard">
            <Row>
              <FlexMenuItemCol>
                <FlexHomeIcon style={{ fontSize: "20px" }} />
              </FlexMenuItemCol>
              <Col>Home</Col>
            </Row>
          </Link>
        </FlexMenuItem>

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/physical-cards/my-card">
            <Link to="/flex/physical-cards/my-card">
              <Row>
                <FlexMenuItemCol>
                  <FlexPhysicalCardIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Physical Card</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/virtual-cards">
            <Link to="/flex/virtual-cards">
              <Row>
                <FlexMenuItemCol>
                  <FlexVirtualCardIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Virtual Card</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/transactions">
            <Link to="/flex/transactions">
              <Row>
                <FlexMenuItemCol>
                  <FlexTransactionsIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Transactions</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/flex-plus-credit">
            <Link to="/flex/flex-plus-credit">
              <Row>
                <FlexMenuItemCol>
                  <FlexCreditLineIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Flex Plus Credit</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        <Menu.Divider style={{ backgroundColor: "rgb(50, 69, 81)" }} />

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/organization/subscriptions">
            <Link to="/flex/organization/subscriptions">
              <Row>
                <FlexMenuItemCol>
                  <TagOutlined style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Subscriptions</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/organization/saved-cards">
            <Link to="/flex/organization/saved-cards">
              <Row>
                <FlexMenuItemCol>
                  <CreditCardOutlined style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Payment Methods</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <FlexMenuItem key="/flex/organization/members">
            <Link to="/flex/organization/members">
              <Row>
                <FlexMenuItemCol>
                  <FlexSettingsIcon style={{ fontSize: "20px" }} />
                </FlexMenuItemCol>
                <Col>Company Settings</Col>
              </Row>
            </Link>
          </FlexMenuItem>
        ) : (
          <></>
        )}

        <NavbarSideDevTools />

        {isAuthenticated ? (
          <FlexMenuUserProfileRow
            style={{
              rowGap: "0px",
            }}
          >
            {" "}
            <Col md={6}>
              <UserOutlined style={{ fontSize: "20px" }} />
            </Col>
            <Col md={16}>
              <FlexUserSettingsPopover
                content={<FlexUserSettingsPopoverContent additionalUserInfo={flexUserInfo} />}
                placement="rightBottom"
                trigger="click"
                overlayClassName="user-settings-popover"
                overlayInnerStyle={{
                  borderRadius: "6px",
                }}
              >
                <div>
                  {flexUserInfo?.first_name} {flexUserInfo?.last_name}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "middle",
                  }}
                >
                  <Space>
                    {capitalize(flexUserInfo?.user_roles?.role_name)}
                    <FlexSubscriptionPlanLabel additionalUserInfo={flexUserInfo} />
                  </Space>
                </div>
              </FlexUserSettingsPopover>
            </Col>
            <Col md={2}>
              <DownOutlined />
            </Col>
          </FlexMenuUserProfileRow>
        ) : (
          <></>
        )}
      </FlexMenu>
    </Sider>
  );
};

const RoleDiv = styled.div`
  display: flex;
  align-items: center;
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

interface FlexUserSettingsPopoverContentProps {
  additionalUserInfo: FlexUserInfo | undefined;
}

export const FlexUserSettingsPopoverContent: React.FunctionComponent<FlexUserSettingsPopoverContentProps> = ({
  additionalUserInfo,
}) => {
  const { logout } = useAuth0();

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
            {additionalUserInfo?.first_name ? additionalUserInfo?.first_name : "(No name)"}{" "}
            {additionalUserInfo?.last_name}
          </Col>
        </Row>
      </div>
      <RoleDiv>
        <Space>
          {capitalize(additionalUserInfo?.user_roles.role_name)}
          <FlexSubscriptionPlanLabel additionalUserInfo={additionalUserInfo} />
        </Space>
      </RoleDiv>
      <CompanyDiv>{additionalUserInfo?.user_orgs.company_name}</CompanyDiv>
      <Divider
        style={{
          margin: "0px",
        }}
      />
      <FlexPopoverMenu theme="light" mode="vertical" defaultSelectedKeys={[location.pathname]}>
        <FlexPopoverMenuItem key="/flex/user/profile" icon={<UserOutlined />}>
          <Link to="/flex/user/profile">User Profile</Link>
        </FlexPopoverMenuItem>
        <FlexPopoverMenuItem
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
        </FlexPopoverMenuItem>
      </FlexPopoverMenu>
    </>
  );
};

interface FlexSubscriptionPlanLabelProps {
  additionalUserInfo: FlexUserInfo | undefined;
}

const FlexSubscriptionPlanLabel: React.FunctionComponent<FlexSubscriptionPlanLabelProps> = ({ additionalUserInfo }) => {
  if (additionalUserInfo && additionalUserInfo?.user_subscriptions?.subscription_plan.includes("FLEX_PRO")) {
    return <FlexProLabel label="Pro" />;
  } else if (additionalUserInfo && additionalUserInfo?.user_subscriptions?.subscription_plan.includes("FLEX_PREMIUM")) {
    return <FlexPremiumLabel label="Premium" />;
  } else {
    return <></>;
  }
};
