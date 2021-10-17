import styled from "@emotion/styled";
import { Tag } from "antd";
import React from "react";

export const FlexBanner = styled.div`
  background-image: url(https://app.fxr.one/flex/static/media/wave1920.00854744.svg);
  font-weight: bold;
  font-size: 22px;
  color: rgb(255, 255, 255);
  padding: 34px;
  line-height: 32px;
  letter-spacing: 0.5px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: auto;
  background-position: 0;
  background-color: rgb(26, 40, 49);
`;

interface FlexLabelProps {
  label: string;
}

export const FlexStarterLabel: React.FunctionComponent<FlexLabelProps> = ({ label: string }): JSX.Element => {
  return <Tag color="#28d79c">{string}</Tag>;
};

export const FlexProLabel: React.FunctionComponent<FlexLabelProps> = ({ label: string }): JSX.Element => {
  return <Tag color="#2ddca1">{string}</Tag>;
};

export const FlexPremiumLabel: React.FunctionComponent<FlexLabelProps> = ({ label: string }): JSX.Element => {
  return <Tag color="#1f9a70">{string}</Tag>;
};
