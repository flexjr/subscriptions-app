import { useAuth0 } from "@auth0/auth0-react";
import { Menu } from "antd";
import { Header } from "antd/lib/layout/layout";
import React from "react";
import { Link } from "react-router-dom";

const LoginButton: React.FunctionComponent = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Menu.Item key="login" style={{ float: "right" }} onClick={() => loginWithRedirect()}>
      Login
    </Menu.Item>
  );
};

const LogoutButton: React.FunctionComponent = () => {
  const { logout } = useAuth0();
  return (
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
  );
};

const AuthenticationButton: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

const ProfileButton: React.FunctionComponent = () => {
  return (
    <Menu.Item key="profile">
      <Link to="/profile">Profile</Link>
    </Menu.Item>
  );
};

const TeamMembersButton: React.FunctionComponent = () => {
  return (
    <Menu.Item key="teamMembers">
      <Link to="/platform/organization/subscriptions">My Org’s Subscriptions</Link>
    </Menu.Item>
  );
};

const AuthenticatedGroupButtons: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? (
    <>
      <TeamMembersButton />
      <ProfileButton />
    </>
  ) : (
    <></>
  );
};

/*
 * Not in use. Currently following app.fxr.one which uses NavbarSide.
 */

export const NavbarTop: React.FunctionComponent = () => {
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <AuthenticatedGroupButtons />
        <AuthenticationButton />
      </Menu>
    </Header>
  );
};
