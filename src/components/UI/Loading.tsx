import styled from "@emotion/styled";
import React from "react";
import { ReactComponent as FlexLogo } from "./flex-logo-loading.svg";

const StyledDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

export const Loading: React.FunctionComponent = () => {
  return (
    <>
      <StyledDiv>
        <div
          style={{
            marginTop: "8px",
          }}
        >
          <FlexLogo
            style={{
              height: "80px",
            }}
          />
          Loading...
        </div>
      </StyledDiv>
    </>
  );
};
