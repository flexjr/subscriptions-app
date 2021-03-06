import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { SplitFactory } from "@splitsoftware/splitio-react";
import React from "react";
import ReactDOM from "react-dom";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
// import "./index.css";
import { App, history } from "./App";
import { cacheLocation } from "./shared";

const onRedirectCallback = (appState: AppState): void => {
  // If using a Hash Router, you need to use window.history.replaceState to
  // remove the `code` and `state` query parameters from the callback url.
  // window.history.replaceState({}, document.title, window.location.pathname);
  history.replace((appState && appState.returnTo) || window.location.pathname);
};

const sdkConfig: SplitIO.IBrowserSettings = {
  core: {
    authorizationKey: process.env.REACT_APP_SPLITIO_KEY as string,
    key: "key",
  },
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
      audience="https://api.flexjr.one/"
      scope="openid profile email"
      redirectUri={window.location.origin}
      useRefreshTokens={true}
      onRedirectCallback={onRedirectCallback}
      cacheLocation={cacheLocation}
    >
      <SplitFactory config={sdkConfig}>
        <App />
      </SplitFactory>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
