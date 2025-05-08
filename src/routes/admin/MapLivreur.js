import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const MapLivreur = lazy(() => import("../../container/MapLivreur/MapLivreur"));

function AdminsRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={MapLivreur} />
    </Switch>
  );
}

export default AdminsRoutes;
