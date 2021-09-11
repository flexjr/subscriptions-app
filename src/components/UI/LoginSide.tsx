import { Steps } from "antd";
import React from "react";
import "./LoginSide.css";

const { Step } = Steps;

interface LoginSideProps {
  isAuthenticated: boolean;
  isOnboarded: boolean | undefined;
}

export const LoginSide: React.FunctionComponent<LoginSideProps> = ({ isAuthenticated, isOnboarded }) => {
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
            marginBottom: "32px",
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
        <div
          style={{
            marginBottom: "32px",
          }}
        >
          Grow your business with flexible business funds
        </div>
        {isAuthenticated && !isOnboarded ? <OnboardingSideSteps /> : <></>}
      </div>
    </div>
  );
};

const OnboardingSideSteps: React.FunctionComponent = () => {
  return (
    <Steps direction="vertical" current={0}>
      <Step
        title="Create an account"
        className="flex-item-title"
        style={{
          paddingBottom: "16px",
        }}
      />
      <Step title="Begin your journey with Flex" />
    </Steps>
  );
};
