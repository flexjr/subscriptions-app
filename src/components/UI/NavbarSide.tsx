import { FunctionComponent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { Layout, Menu } from "antd";

const { Sider } = Layout;

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.2);
`;

export const NavbarSide: FunctionComponent = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <Logo />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        {isAuthenticated ? (
          <Menu.Item key="profile">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        ) : (
          <></>
        )}
        {isAuthenticated ? (
          <Menu.Item key="teamMembers">
            <Link to="/platform/organization/members">Team Members</Link>
          </Menu.Item>
        ) : (
          <></>
        )}
        {isAuthenticated ? (
          <Menu.Item key="savedCards">
            <Link to="/platform/organization/saved_cards">Saved Cards</Link>
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
