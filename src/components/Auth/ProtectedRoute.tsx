import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Route } from "react-router-dom";

export const ProtectedRoute = ({ component, ...args }: React.PropsWithChildren<any>) => {
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
