import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";

export const ProtectedRoute = ({ component, ...args }: React.PropsWithChildren<any>) => {
  const { isAuthenticated } = useAuth0();
  const history = useHistory();

  // TODO: By right the withAuthenticationRequired should redirect to Auth0 but somehow it's not working, so this is just a quickfix
  if (!isAuthenticated) {
    history.push("/");
  }

  return (
    <Route
      render={(props) => {
        const Component = withAuthenticationRequired(component, {
          // If using a Hash Router, you need to pass the hash fragment as `returnTo`
          // returnTo: () => window.location.hash.substr(1),
        });
        return <Component {...props} />;
      }}
      {...args}
    />
  );
};
