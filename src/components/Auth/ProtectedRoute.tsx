import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { FunctionComponent } from "react";
import { Route } from "react-router-dom";

interface ProtectedRouteProps {
  component?: any;
  props?: any;
}

export const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({ component, ...props }) => (
  <Route component={withAuthenticationRequired(component)} {...props} />
);
