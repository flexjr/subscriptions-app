import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useHistory } from "react-router-dom";

interface Props {
  domain: string;
  clientId: string;
  redirectUri?: string;
  onRedirectCallback?: string;
  useRefreshTokens?: boolean;
}

export const Auth0ProviderWithHistory: React.FunctionComponent<Props> = ({ useRefreshTokens, children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  const history = useHistory();

  const onRedirectCallback = (appState): void => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain as string}
      clientId={clientId as string}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={useRefreshTokens}
    >
      {children}
    </Auth0Provider>
  );
};
