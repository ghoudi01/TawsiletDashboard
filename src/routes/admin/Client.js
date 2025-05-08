import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Clients = lazy(() => import("../../container/clients/Clients"));

function ClientsRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/list`} component={Clients} />
    </Switch>
  );
}

export default ClientsRoutes;
