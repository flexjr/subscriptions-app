import { useAuth0 } from "@auth0/auth0-react";
import styled from "@emotion/styled";
import { Layout, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Sider } = Layout;

export const LoginSide: React.FunctionComponent = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  return (
    <div
      style={{
        display: "flex",

        color: "rgb(196, 196, 196)",
        backgroundColor: "rgb(26, 40, 49)",
        textAlign: "left",
        fontSize: "18px",
        lineHeight: "28px",
        padding: "40px 35px",
        minHeight: "100vh",
        minWidth: "359px",
        width: "359px",
        position: "fixed",
        left: 0,
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <img
            src="https://flexjr-assets.s3.ap-southeast-1.amazonaws.com/flex-logo.png"
            style={{
              minHeight: "50px",
            }}
            alt="Flex Logo"
          />
        </div>
        <div>Grow your business with flexible business funds</div>
      </div>
    </div>
  );
};
