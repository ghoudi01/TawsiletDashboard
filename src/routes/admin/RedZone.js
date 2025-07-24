import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const RedZones = lazy(() => import("../../container/redzone/RedZones"));

function RedZoneRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={RedZones} />
    </Switch>
  );
}

export default RedZoneRoutes; 