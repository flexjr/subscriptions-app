import React, { ReactElement } from "react";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Help } from "./views/Help";
import { Home } from "./views/Home";
import Members from "./views/Settings/Members";
import { NavbarTop } from "./components/UI/NavbarTop";


export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Layout className="layout">
        <NavbarTop />
        <Content style={{ padding: "16px 50px" }}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/platform/organization/members">
              <Members />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};
