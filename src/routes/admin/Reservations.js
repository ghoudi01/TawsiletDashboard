import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const Reservations = lazy(() => import('../../container/reservations/Reservations'));

function ReservationRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={Reservations} />
    </Switch>
  );
}

export default ReservationRoutes;
