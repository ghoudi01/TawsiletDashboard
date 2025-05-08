import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Admins from "../../container/admin/Admins";

const admins = lazy(() => import("../../container/admin/Admins"));

function AdminsRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={admins} />
    </Switch>
  );
}

export default AdminsRoutes;
