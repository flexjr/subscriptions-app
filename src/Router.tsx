import Layout, { Content, Footer } from "antd/lib/layout/layout";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/Auth";

import { NavbarSide } from "./components/UI";
import { Members } from "./views/CompanySettings/Members";
import { SavedCards } from "./views/CompanySettings/SavedCards";
import { Home } from "./views/Home";
import { Onboarding } from "./views/Onboarding";
import { UserSettings } from "./views/UserSettings";

export const Router: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Layout className="layout" style={{ marginLeft: 260 }}>
        <NavbarSide />
        <Content style={{ padding: "38px" }}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <ProtectedRoute exact path="/onboarding">
              <Onboarding />
            </ProtectedRoute>
            <ProtectedRoute exact path="/platform/organization/members">
              <Members />
            </ProtectedRoute>
            <ProtectedRoute exact path="/platform/organization/saved_cards">
              <SavedCards />
            </ProtectedRoute>
            <ProtectedRoute exact path="/platform/user/profile">
              <UserSettings />
            </ProtectedRoute>
          </Switch>
          <Footer style={{ textAlign: "center" }}>
            <p>
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
