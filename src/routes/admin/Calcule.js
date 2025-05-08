import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";


const calcule = lazy(() => import("../../container/Paramètres/Calcule/Calcule"));

function CalculeRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={calcule} />
    </Switch>
  );
}

export default CalculeRoutes  ;
