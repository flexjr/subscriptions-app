import React from "react";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Profile } from "./views/Profile";
import { Home } from "./views/Home";
import Members from "./views/Settings/Members";
import { NavbarTop } from "./components/UI/NavbarTop";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

export const Router: React.FunctionComponent = () => {
  return (
    <BrowserRouter>
      <Layout className="layout">
        <NavbarTop />
        <Content style={{ padding: "16px 50px" }}>
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
