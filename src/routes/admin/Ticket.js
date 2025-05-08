import React, { lazy } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";



const LivreurTicket = lazy(() => import("../../container/Ticket/livreur/Livreur"));
const ClientsTicket = lazy(() => import("../../container/Ticket/client/Clients"));
function TicketRoute() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/clients`} component={ClientsTicket} />
      <Route path={`${path}/Livreurs`} component={LivreurTicket} />
    </Switch>
  );
}

export default TicketRoute;
