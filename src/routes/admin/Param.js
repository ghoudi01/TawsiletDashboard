import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const Paramat = lazy(() =>
  import("../../container/Paramètres/Param/Param")
);

function Param() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={Paramat} />
    </Switch>
  );
}

export default Param;
