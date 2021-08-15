import Layout, { Content, Footer } from "antd/lib/layout/layout";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { NavbarSide } from "./components/UI";
import { NavbarTop } from "./components/UI/NavbarTop";
import { Home } from "./views/Home";
import { Profile } from "./views/Profile";
import { Members } from "./views/Settings/Members";
import { SavedCards } from "./views/Settings/SavedCards";

export const Router: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      {/* <NavbarTop /> */}
      <Layout className="layout" style={{ marginLeft: 200 }}>
        <NavbarSide />
        <Content style={{ padding: "16px 32px" }}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact={true} path="/platform/organization/members">
              <Members />
            </Route>
            <Route exact={true} path="/platform/organization/saved_cards">
              <SavedCards />
            </Route>
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
