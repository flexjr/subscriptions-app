import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Route } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProtectedRoute: React.FunctionComponent = ({ component, ...args }: React.PropsWithChildren<any>) => (
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
