import { AppState, Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
// import "./index.css";
import { App, history } from "./App";
import { store } from "./app/store";

const onRedirectCallback = (appState: AppState) => {
  // If using a Hash Router, you need to use window.history.replaceState to
  // remove the `code` and `state` query parameters from the callback url.
  // window.history.replaceState({}, document.title, window.location.pathname);
  history.replace((appState && appState.returnTo) || window.location.pathname);
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
        audience="https://api.flexjr.one/"
        scope="read:current_user write:current_user openid profile email"
        redirectUri={window.location.origin}
        useRefreshTokens={true}
        onRedirectCallback={onRedirectCallback}
      >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
