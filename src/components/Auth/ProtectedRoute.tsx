import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { Route } from "react-router-dom";

interface Props {
  exact?: boolean;
  path: string;
  component?: React.ComponentType<unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProtectedRoute: React.FunctionComponent<Props> = ({
  component,
  ...args
}: React.PropsWithChildren<any>) => (
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
