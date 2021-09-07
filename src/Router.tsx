import { useAuth0 } from "@auth0/auth0-react";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/Auth";

import { LoginSide, NavbarSide } from "./components/UI";
import { OrgSubscriptions } from "./views/CompanySettings/OrgSubscriptions";
import { SavedCards } from "./views/CompanySettings/SavedCards";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Onboarding } from "./views/Onboarding";
import { CheckoutStep2, CheckoutStep1, CheckoutStep3 } from "./views/Subscriptions";
import { PaymentFailed } from "./views/Subscriptions/PaymentFailure";
import { PaymentSuccess } from "./views/Subscriptions/PaymentSuccess";
import { UserSettings } from "./views/UserSettings";

export const Router: React.FunctionComponent = () => {
  const { isAuthenticated } = useAuth0();
  const marginLeftIfLoggedOut = isAuthenticated ? 260 : 359;

  return (
    <BrowserRouter>
      <Layout className="layout" style={{ marginLeft: marginLeftIfLoggedOut, minHeight: "100vh" }}>
        {isAuthenticated ? <NavbarSide /> : <LoginSide />}
        <Content style={{ padding: "38px" }}>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route exact path="/flex/dashboard">
              <Home />
            </Route>
            <Route exact path="/onboarding">
              <Onboarding />
            </Route>
            <ProtectedRoute exact path="/flex/organization/subscriptions">
              <OrgSubscriptions />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/organization/saved-cards">
              <SavedCards />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/user/profile">
              <UserSettings />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/subscription/checkout/plan-selection">
              <CheckoutStep1 />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/subscription/checkout/billing-frequency">
              <CheckoutStep2 />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/subscription/checkout/summary">
              <CheckoutStep3 />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/subscription/payment-success">
              <PaymentSuccess />
            </ProtectedRoute>
            <ProtectedRoute exact path="/flex/subscription/payment-failed">
              <PaymentFailed />
            </ProtectedRoute>
          </Switch>
          <Footer style={{ textAlign: "center" }}>
            <p id="build-label">
              Build v1.0.0-
              <a href="https://github.com/flexjr/subscriptions-app" target="_blank" rel="noopener noreferrer">
                {process.env.REACT_APP_COMMIT_REF?.substring(0, 7)}
              </a>
            </p>
          </Footer>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};
