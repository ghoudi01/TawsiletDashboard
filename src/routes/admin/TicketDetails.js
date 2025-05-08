import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const TicketDetails = lazy(() =>
  import("../../container/Ticket/client/TicketDetails")
);

function TicketDetailsRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:id`} component={TicketDetails} />
    </Switch>
  );
}

export default TicketDetailsRoutes;
