import React, { useState } from "react";
import { Route, BrowserRouter, useLocation } from "react-router-dom";

const AppContainer = (props) => {
  const location = useLocation();
  const [_, url] = location.pathname.split("/");
  const classNames = url ? "results" : "App";
  return <div className={classNames}>{props.children}</div>;
};

export { AppContainer };
