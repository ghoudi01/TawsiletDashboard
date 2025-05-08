import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Commandes = lazy(() => import("../../container/commandes/Commandes"));

function CommandesRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={Commandes} />
    </Switch>
  );
}

export default CommandesRoutes;
