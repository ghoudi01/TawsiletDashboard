import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const driver = lazy(() => import("../../container/agent/NewDriver"));

function NewDriver() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={driver} />
    </Switch>
  );
}

export default NewDriver;
