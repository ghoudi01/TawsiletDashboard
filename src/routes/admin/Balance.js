import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Balance = lazy(() => import("../../container/dashboard/Finance/Balance"));

function BalanceRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={Balance} />
    </Switch>
  );
}

export default BalanceRoutes;
