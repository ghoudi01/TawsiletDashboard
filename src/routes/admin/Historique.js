import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Historique = lazy(() =>
  import("../../container/dashboard/Finance/Historique")
);

function HistoriqueRoute() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={Historique} />
    </Switch>
  );
}

export default HistoriqueRoute;
