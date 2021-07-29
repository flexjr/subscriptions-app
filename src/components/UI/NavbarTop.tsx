import { FunctionComponent, useState } from "react";
import { Header } from "antd/lib/layout/layout";
import { Menu } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";

const LoginButton = ({ ...props }) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Menu.Item {...props} style={{ float: "right" }} onClick={() => loginWithRedirect()}>
      Login
    </Menu.Item>
  );
};

const LogoutButton = ({ ...props }) => {
  const { logout } = useAuth0();
  return (
    <Menu.Item
      {...props}
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

  return isAuthenticated ? <LogoutButton {...props} /> : <LoginButton {...props} />;
};

const ProfileButton = ({ ...props }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <Menu.Item {...props}>
      <Link to="/profile">Profile</Link>
    </Menu.Item>
  ) : (
    <></>
  );
};

const TeamMembersButton = ({ ...props }) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <Menu.Item {...props}>
      <Link to="/platform/organization/members">Team Members</Link>
    </Menu.Item>
  ) : (
    <></>
  );
};

export const NavbarTop: FunctionComponent = () => {
  return (
    <Header>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        <AuthenticationButton key="3" />
        <SubMenu title="SubMenu">
          <Menu.Item key="10">SubMenuItem</Menu.Item>
        </SubMenu>
        <ProfileButton key="2" />
        <TeamMembersButton key="4" />
      </Menu>
    </Header>
  );
}
