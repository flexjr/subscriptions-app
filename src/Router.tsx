import Layout, { Content, Footer } from "antd/lib/layout/layout";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { NavbarSide } from "./components/UI";
import { Members } from "./views/CompanySettings/Members";
import { SavedCards } from "./views/CompanySettings/SavedCards";
import { Home } from "./views/Home";
import { Profile } from "./views/Profile";

export const Router: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
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
