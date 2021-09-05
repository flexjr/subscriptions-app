import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Layout, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";

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
      }}
      width="260px"
    >
      <Logo />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {isAuthenticated ? (
          <Menu.Item key="teamMembers">
            <Link to="/platform/organization/subscriptions">My Org’s Subscriptions</Link>
          </Menu.Item>
        ) : (
          <></>
        )}
        {isAuthenticated ? (
          <Menu.Item key="savedCards">
            <Link to="/platform/organization/saved_cards">Payment Methods</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="profile">
            <Link to="/platform/user/profile">User Profile</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="checkout/plan_selection">
            <Link to="/platform/subscription/checkout/plan_selection">❗ Checkout Plan Selection</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="checkout/billing_frequency">
            <Link to="/platform/subscription/checkout/billing_frequency">❗ Checkout Billing Frequency</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item key="checkout/summary">
            <Link to="/platform/subscription/checkout/summary">❗ Checkout Summary</Link>
          </Menu.Item>
        ) : (
          <></>
        )}

        {isAuthenticated ? (
          <Menu.Item
            key="logout"
            style={{ float: "right" }}
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
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
