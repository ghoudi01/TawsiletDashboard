import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const AnalyticsPage = lazy(() => import("../../container/analytics/Analytics"));

function AnalyticsRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={AnalyticsPage} />
    </Switch>
  );
}

export default AnalyticsRoutes;
