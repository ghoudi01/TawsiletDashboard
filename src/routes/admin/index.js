import React, { Suspense, lazy, useMemo } from "react";
import { Skeleton, Spin } from "antd";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Dashboard from "./dashboard";

import withAdminLayout from "../../layout/withAdminLayout";
import { useSelector } from "react-redux";
import ValidationOverlay from "../../ValidationOverlay/ValidationOverlay";
import NotFound from "../../container/pages/404";
import Param from "./Param";
import DriverBalance from "./DriverBalance";
import Stats from "./Stats";
import newDriver from "./NewDriver";
import RedirectByRole from "./RedirectByRole";

const Livreurs = lazy(() => import("./Livreur"));
const Ticket = lazy(() => import("./Ticket"));
const Reservations = lazy(() => import("./Reservations"));

const Commandes = lazy(() => import("./Commandes"));
const CommandProfile = lazy(() => import("./CommandProfile"));
const TicketDetails = lazy(() => import("./TicketDetails"));
const TicketDetail = lazy(() => import("./TicketDetail"));
const Vehicules = lazy(() => import("./Vehicules"));

const ListSociété = lazy(() => import("./Société"));

const ClientsRoutes = lazy(() => import("./Client"));
const AgentsRoutes = lazy(() => import("./Agent"));
const AdminsRoutes = lazy(() => import("./Admin"));
const livreurMap = lazy(() => import("./MapLivreur"));
const CalculeRoutes = lazy(() => import("./Calcule"));
const MaintenanceRoutes = lazy(() => import("./Maintenance"));
const BalanceRoutes = lazy(() => import("./Balance"));
const Historique = lazy(() => import("./Historique"));
const MapUser = lazy(() => import("../../container/MapUser/MapUser"));

const Admin = () => {
  const { path } = useRouteMatch();

  const userValidation = useSelector((state) => state.user?.currentUser);

  const validation = useMemo(() => {
    if (userValidation === null) {
      return null;
    }
    if (["owner", "admin", "driver","agent_support"].includes(userValidation.user_role)) {
      return "valid";
    }

    if (["agent"].includes(userValidation.user_role)) {
      if (userValidation.agent_company?.confirmed === null) {
        return "waiting";
      } else if (userValidation.agent_company?.confirmed) {
        return "valid";
      } else if (!userValidation.agent_company?.confirmed) {
        return "invalid";
      }
    }

    // Calculate the validation state based on userValidation
    if (userValidation?.companies?.[0]?.confirmed === null) {
      return "waiting";
    } else if (userValidation?.companies?.[0]?.confirmed) {
      return "valid";
    } else if (!userValidation?.companies?.[0]?.confirmed) {
      return "invalid";
    }
  }, [userValidation]);

  const renderRoutes = () => (
    <>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <ProtectedRoute
          exact
          path={path}
          component={RedirectByRole}
          allowedRoles={["owner", "admin", "company", "agent", "driver","agent_support"]}
        />

        <ProtectedRoute
          path={`${path}/dashboard`}
          component={Dashboard}
          allowedRoles={["owner", "admin", "company", "agent","agent_support"]}
        />

        <ProtectedRoute
          path={`${path}/reservations`}
          component={Reservations}
          allowedRoles={["owner", "admin","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/commandes`}
          component={Commandes}
          allowedRoles={["owner", "admin", "company", "agent","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/details`}
          component={CommandProfile}
          allowedRoles={["owner", "admin", "company", "agent","agent_support"]}
        />

        <ProtectedRoute
          path={`${path}/Vehicules`}
          component={Vehicules}
          allowedRoles={["owner", "admin", "company", "agent","agent_support"]}
        />

        <ProtectedRoute
          path={`${path}/clients`}
          component={ClientsRoutes}
          allowedRoles={["owner", "admin","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/Agents`}
          component={AgentsRoutes}
          allowedRoles={["owner", "admin","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/newDriver`}
          component={newDriver}
          allowedRoles={["owner", "admin","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/track`}
          component={livreurMap}
          allowedRoles={["owner", "admin", "company", "agent","agent_support"]}
        />

        <ProtectedRoute
          path={`${path}/Societes`}
          component={ListSociété}
          allowedRoles={["owner", "admin"]}
        />
        <ProtectedRoute
          path={`${path}/Livreurs`}
          component={Livreurs}
          allowedRoles={["owner", "admin", "company", "agent","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/Admins`}
          component={AdminsRoutes}
          allowedRoles={["owner"]}
        />
        <ProtectedRoute
          path={`${path}/Calcule`}
          component={CalculeRoutes}
          allowedRoles={["owner"]}
        />
        <ProtectedRoute
          path={`${path}/driver`}
          component={DriverBalance}
          allowedRoles={["driver"]}
        />
        <ProtectedRoute
          path={`${path}/stats`}
          component={Stats}
          allowedRoles={["driver"]}
        />
        <ProtectedRoute
          path={`${path}/Maintenance`}
          component={MaintenanceRoutes}
          allowedRoles={["owner", "admin"]}
        />
        <ProtectedRoute
          path={`${path}/param`}
          component={Param}
          allowedRoles={["owner"]}
        />

        <ProtectedRoute
          path={`${path}/balance`}
          component={BalanceRoutes}
          allowedRoles={["owner","admin"]}
        />
        <ProtectedRoute
          path={`${path}/Historique`}
          component={Historique}
          allowedRoles={["owner", "admin", "company", "agent", "driver"]}
        />
        <ProtectedRoute
          path={`${path}/Ticket`}
          component={Ticket}
          allowedRoles={["admin", "owner","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/detailsTicket`}
          component={TicketDetails}
          allowedRoles={["owner", "admin","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/detailsTickete`}
          component={TicketDetail}
          allowedRoles={["owner", "admin","agent_support"]}
        />
        <ProtectedRoute
          path={`${path}/MapUser/view`}
          component={MapUser}
          allowedRoles={["owner", "admin", "agent_support"]}
        />
      </Suspense>
    </>
  );
  return (
    <Switch>
      {validation === null ? (
        <div className="app_with_overlay_spinner">
          <Spin size="large" />
        </div>
      ) : validation !== "valid" ? (
        <div className="app_with_overlay">
          <ValidationOverlay validation={validation} />
        </div>
      ) : (
        renderRoutes() // Render your authenticated routes
      )}
    </Switch>
  );
};

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const userRole = currentUser?.user_role;
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    if (!userRole) {
      return <Skeleton />;
    } else {
      return <Route {...rest} render={(props) => <NotFound />} />;
    }
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default withAdminLayout(Admin);
