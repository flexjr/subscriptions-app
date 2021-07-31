import { FunctionComponent, useState } from "react";
import { Header } from "antd/lib/layout/layout";
import { Menu } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const LoginButton = ({ ...props }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Menu.Item key="login" style={{ float: "right" }} onClick={() => loginWithRedirect()}>
      Login
    </Menu.Item>
  );
};

const LogoutButton = ({ ...props }) => {
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

const AuthenticationButton = ({ ...props }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

const ProfileButton = () => {
  return (
    <Menu.Item key="profile">
      <Link to="/profile">Profile</Link>
    </Menu.Item>
  );
};

const TeamMembersButton = () => {
  return (
    <Menu.Item key="teamMembers">
      <Link to="/platform/organization/members">Team Members</Link>
    </Menu.Item>
  );
};

const AuthenticatedGroupButtons = () => {
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

export const NavbarTop: FunctionComponent = () => {
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
