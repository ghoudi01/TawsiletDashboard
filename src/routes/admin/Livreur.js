import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Livreur = lazy(() => import("../../container/livreur/Livreur"));

function LivreursRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} component={Livreur} />
    </Switch>
  );
}

export default LivreursRoutes;
