import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const status = lazy(() => import("../../container/dashboard/Status"));

function Stats() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/dashboard`} component={status} />
    </Switch>
  );
}

export default Stats;
