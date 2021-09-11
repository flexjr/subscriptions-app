import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Spin } from "antd";
import React from "react";
import "./NavbarSide.css";
import { ReactSVG } from "react-svg";

const StyledDiv = styled.div`
  height: "100vh";
  padding: "0px";
  margin: "0px";
  display: "flex";
  flex-direction: "column";
  -webkit-box-align: "center";
  align-items: "center";
  -webkit-box-pack: "center";
  justify-content: "center";
  text-align: "center";
`;

export const Loading: React.FunctionComponent = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <StyledDiv>
      <ReactSVG src="flex-logo-loading.svg" className="flex-logo-loading" />
      <Spin indicator={antIcon} />
      <div>Loading...</div>
    </StyledDiv>
  );
};
