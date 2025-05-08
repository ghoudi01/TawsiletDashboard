import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Vehicules = lazy(() =>
  import("../../container/vehicules/Vehicules")
);

function VehiculesRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={Vehicules} />
    </Switch>
  );
}

export default VehiculesRoutes;
