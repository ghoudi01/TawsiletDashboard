import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const CommandProfile = lazy(() =>
  import("../../container/commandProfile/CommandProfile")
);

function CommandesRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:id`} component={CommandProfile} />
    </Switch>
  );
}

export default CommandesRoutes;
