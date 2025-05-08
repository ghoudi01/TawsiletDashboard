import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";


const maintenance = lazy(() => import("../../container/Paramètres/Maintenance/Maintenance"));

function MaintenanceRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={maintenance} />
    </Switch>
  );
}

export default MaintenanceRoutes  ;
