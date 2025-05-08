import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";


const TicketDetail = lazy(() =>
  import("../../container/Ticket/livreur/TicketDetails")
);

function TicketDetailRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:id`} component={TicketDetail} />
    </Switch>
  );
}

export default TicketDetailRoutes;
