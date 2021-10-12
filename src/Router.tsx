import { useAuth0 } from "@auth0/auth0-react";
import { Skeleton } from "antd";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import React from "react";
import { Redirect, BrowserRouter, Switch, Route } from "react-router-dom";
import { LoginSide, NavbarSide } from "./components/UI";
import { Loading } from "./components/UI/Loading";
import { useFlex } from "./hooks";
import { Members } from "./views/CompanySettings";
import { OrgSubscriptions } from "./views/CompanySettings/OrgSubscriptions";
import { SavedCards } from "./views/CompanySettings/SavedCards";
import { Debugger } from "./views/Debugger";
import { Home } from "./views/Home";
import { Login } from "./views/Login";
import { Onboarding } from "./views/Onboarding";
import { CheckoutStep2, CheckoutStep1, CheckoutStep3, PaymentFailed, PaymentSuccess } from "./views/Subscriptions";
import { UserSettings } from "./views/UserSettings";

export const Router: React.FunctionComponent = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const { isLoadingOnboarded, isOnboarded } = useFlex();
  const marginLeftIfLoggedOut = isAuthenticated && isOnboarded ? 260 : 359;
  console.log("isAuthenticated", isAuthenticated, "isOnboarded", isOnboarded);

  return (
    <BrowserRouter>
      {isLoading && isLoadingOnboarded ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <Layout className="layout" style={{ marginLeft: marginLeftIfLoggedOut, minHeight: "100vh" }}>
            {isAuthenticated && isOnboarded ? (
              <NavbarSide />
            ) : (
              <LoginSide isAuthenticated={isAuthenticated} isOnboarded={isOnboarded} />
            )}
            <Content style={{ padding: "38px" }}>
              <Switch>
                <Route exact path="/">
                  <LoginSwitcher isAuthenticated={isAuthenticated} isOnboarded={isOnboarded} />
                </Route>
                <Route exact path="/flex/dashboard">
                  <Home />
                </Route>
                <Route exact path="/onboarding">
                  <Onboarding />
                </Route>
                <Route path="/flex/organization/subscriptions">
                  <OrgSubscriptions />
                </Route>
                <Route exact path="/flex/organization/members">
                  <Members />
                </Route>
                <Route exact path="/flex/organization/saved-cards">
                  <SavedCards />
                </Route>
                <Route exact path="/flex/user/profile">
                  <UserSettings />
                </Route>
                <Route exact path="/flex/subscription/checkout/plan-selection">
                  <CheckoutStep1 />
                </Route>
                <Route exact path="/flex/subscription/checkout/billing-frequency">
                  <CheckoutStep2 />
                </Route>
                <Route exact path="/flex/subscription/checkout/summary">
                  <CheckoutStep3 />
                </Route>
                <Route exact path="/flex/subscription/payment-success">
                  <PaymentSuccess />
                </Route>
                <Route exact path="/flex/subscription/payment-failed">
                  <PaymentFailed />
                </Route>
                <Route exact path="/debugger">
                  <Debugger />
                </Route>
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
        </>
      )}
    </BrowserRouter>
  );
};

interface LoginSwitcherProps {
  isAuthenticated: boolean | undefined;
  isOnboarded: boolean | undefined;
}

const LoginSwitcher: React.FunctionComponent<LoginSwitcherProps> = ({ isAuthenticated, isOnboarded }) => {
  if (isAuthenticated == true && isOnboarded == undefined) {
    return <Skeleton active />;
  } else if (isAuthenticated && isOnboarded) {
    return <Redirect to="/flex/dashboard" />;
  } else if (isAuthenticated && !isOnboarded) {
    return <Redirect to="/onboarding" />;
  } else {
    return <Login />;
  }
};
