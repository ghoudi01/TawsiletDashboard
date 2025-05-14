import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const driver = lazy(() => import("../../container/dashboard/Finance/Driver"));

function DriverBalance() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/balance`} component={driver} />
    </Switch>
  );
}

export default DriverBalance;
