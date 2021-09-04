import { createBrowserHistory } from "history";
import React from "react";
import { Router } from "./Router";
import "./App.less";

// Use `createHashHistory` to use hash routing
export const history = createBrowserHistory();

export const App: React.FunctionComponent = () => <Router />;
