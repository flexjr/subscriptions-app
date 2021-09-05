import { useAuth0 } from "@auth0/auth0-react";
import { Button, Table, Modal, Row } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { API_URL, AUTH0_API_AUDIENCE } from "../../utils";

export const Checkout: React.FunctionComponent = () => {
  return (
    <>
      <h2>Checkout</h2>
      <div
        style={{
          backgroundImage: "url(https://app.fxr.one/flex/static/media/company-name-background.5dd40cbe.svg)",
          fontWeight: "bold",
          fontSize: "22px",
          color: "rgb(255, 255, 255)",
          padding: "34px",
          lineHeight: "32px",
          letterSpacing: "0.5px",
          borderRadius: "10px",
          backgroundRepeat: "no-repeat",
          backgroundSize: "auto",
          backgroundPosition: "100% 0",
          backgroundColor: "rgb(26, 40, 49)",
        }}
      >
        Checkout
      </div>

      <div style={{ marginTop: "16px", marginBottom: "16px" }}>test</div>
    </>
  );
};
