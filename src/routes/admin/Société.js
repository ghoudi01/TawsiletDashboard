import React, { lazy } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const ListSociété = lazy(() => import('../../container/société/Société'));

function ReservationRoutes() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/view`} component={ListSociété} />
    </Switch>
  );
}

export default ReservationRoutes;
