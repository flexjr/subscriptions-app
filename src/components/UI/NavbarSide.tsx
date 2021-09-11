import { CreditCardOutlined, HomeOutlined, LogoutOutlined, TagOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Layout, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import "./NavbarSide.css";

const { Sider } = Layout;

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
`;

export const NavbarSide: React.FunctionComponent = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
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
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]} className="flex-menu">
        <Menu.Item key="/flex/dashboard" icon={<HomeOutlined />} className="flex-menu-item-selected">
          <Link to="/flex/dashboard">Home</Link>
        </Menu.Item>
        {isAuthenticated ? (
          <Menu.Item key="/flex/organization/subscriptions" icon={<TagOutlined />} className="flex-menu-item-selected">
            <Link to="/flex/organization/subscriptions">My Org’s Subscriptions</Link>
          </Menu.Item>
        ) : (
          <></>
        )}
        {isAuthenticated ? (
          <Menu.Item
            key="/flex/organization/saved-cards"
            icon={<CreditCardOutlined />}
            className="flex-menu-item-selected"
          >
            <Link to="/flex/organization/saved-cards">Payment Methods</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="/flex/user/profile" icon={<UserOutlined />} className="flex-menu-item-selected">
            <Link to="/flex/user/profile">User Profile</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item
            key="logout"
            style={{ float: "right" }}
            onClick={() => {
              localStorage.clear();
              logout({
                returnTo: window.location.origin,
              });
            }}
            icon={<LogoutOutlined />}
            className="flex-menu-item-selected"
          >
            Logout
          </Menu.Item>
        ) : (
          <Menu.Item key="login" style={{ float: "right" }} onClick={() => loginWithRedirect()}>
            Login
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  );
};
