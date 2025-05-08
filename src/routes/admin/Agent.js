import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Agents from "../../container/agent/Agents";

const agents = lazy(() => import("../../container/agent/Agents"));

function AgentsRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={agents} />
    </Switch>
  );
}

export default AgentsRoutes;
