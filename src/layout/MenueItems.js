import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { NavLink, useRouteMatch } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import SubMenu from "antd/lib/menu/SubMenu";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getCompaniesCount,
  getDriverCount,
  logout,
} from "../redux/User/userSlice";
import {
  getReservations,
  getReservationsCount,
} from "../redux/reservations/reservationSlice";
import { getVehiculeCount } from "../redux/vehicule/vehiculeSlice";

const menuPermissions = {
  reservations: ["owner", "admin", "agent_support"],
  commandes: ["owner", "admin", "agent_support"],
  vehicules: ["owner", "admin", "agent_support"],
  clients: ["owner", "admin", "agent_support"],
  chauffeurs: ["owner", "admin", "agent_support"],
  admins: ["owner"],
  agents: ["owner"],
  balance: ["owner","admin"],
  historique: ["owner", "admin"],
  maintenance: ["owner"],
  calcule: ["owner"],
  support: ["owner", "admin", "agent_support"],
};

const MenuItems = ({ darkMode, toggleCollapsed, topMenu }) => {
  const dispatch = useDispatch();
  const reservationCount = useSelector((state) => state?.reservations?.count);
  const vehiculeCount = useSelector((state) => state?.vehicules?.count);
  const driverCount = useSelector((state) => state?.user?.count);
  const companyCount = useSelector((state) => state?.user?.countCompany);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  useEffect(() => {
    dispatch(
      getReservationsCount({
        pagination: {
          pageSize: 9999,
        },
        free: true,
      })
    );
  }, []);
  useEffect(() => {
    dispatch(
      getVehiculeCount({
        pagination: {
          pageSize: 9999,
        },
        status: "waiting",
      })
    );
  }, []);
  useEffect(() => {
    dispatch(getDriverCount());
  }, []);
  useEffect(() => {
    dispatch(getCompaniesCount());
  }, []);

  const { path } = useRouteMatch();
  const pathName = window.location.pathname;
  const pathArray = pathName.split(path);
  const mainPath = pathArray[1];
  const mainPathSplit = mainPath.split("/");
  const [openKeys, setOpenKeys] = React.useState(
    !topMenu
      ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : "dashboard"}`]
      : []
  );
  const handleLogOut = () => {
    dispatch(logout());
  };
  const onOpenChange = (keys) => {
    setOpenKeys(
      keys[keys.length - 1] !== "recharts"
        ? [keys.length && keys[keys.length - 1]]
        : keys
    );
  };

  const onClick = (item) => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);
  const [roleUser, setRoleUser] = useState("company");
  useEffect(() => {
    if (userRole) {
      setRoleUser(userRole);
    }
  }, [userRole]);

  const canView = (item) => menuPermissions[item]?.includes(roleUser);

  const renderMenuItems = () => {
    if (roleUser === "owner" || roleUser === "admin" || roleUser === "agent_support") {
      // Build Gestion submenu items
      const gestionMenuItems = [
        canView("reservations") && (
          <Menu.Item key="reservations">
            <NavLink onClick={toggleCollapsed} to={`${path}/reservations/view`}>
              Reservations
            </NavLink>
          </Menu.Item>
        ),
        canView("commandes") && (
          <Menu.Item key="commandes">
            <NavLink onClick={toggleCollapsed} to={`${path}/commandes/view`}>
              Commandes
            </NavLink>
          </Menu.Item>
        ),
        canView("vehicules") && (
          <Menu.Item key="ProjectCreate">
            <NavLink onClick={toggleCollapsed} to={`${path}/Vehicules/view`}>
              Véhicule
              {vehiculeCount > 0 && (
                <span className="reservation_notification">
                  {vehiculeCount > 99 ? "99+" : vehiculeCount}
                </span>
              )}
            </NavLink>
          </Menu.Item>
        ),
        canView("clients") && (
          <Menu.Item key="projectDetails">
            <NavLink onClick={toggleCollapsed} to={`${path}/clients/list`}>
              Clients
            </NavLink>
          </Menu.Item>
        ),
        canView("chauffeurs") && (
          <Menu.Item key="projectDetail">
            <NavLink onClick={toggleCollapsed} to={`${path}/Livreurs/list`}>
              Chauffeurs
              {driverCount > 0 && (
                <span className="reservation_notification">
                  {driverCount > 99 ? "99+" : driverCount}
                </span>
              )}
            </NavLink>
          </Menu.Item>
        ),
      ].filter(Boolean);

      // Build Utilisateurs submenu items
      const utilisateursMenuItems = [
        canView("admins") && currentUser.user_role === "owner" && (
          <Menu.Item key="view">
            <NavLink onClick={toggleCollapsed} to={`${path}/Admins/view`}>
              Admin
            </NavLink>
          </Menu.Item>
        ),
        // Add Red Zones menu item for owner
        canView("admins") && currentUser.user_role === "owner" && (
          <Menu.Item key="redzones">
            <NavLink onClick={toggleCollapsed} to={`${path}/RedZones/view`}>
              Red Zones
            </NavLink>
          </Menu.Item>
        ),
        canView("agents") && currentUser.user_role === "owner" && (
          <Menu.Item key="views">
            <NavLink onClick={toggleCollapsed} to={`${path}/Agents/view`}>
              Agent
            </NavLink>
          </Menu.Item>
        ),
        // Add MapUser menu item for user map
        (roleUser === "owner" || roleUser === "admin" || roleUser === "agent_support") && (
          <Menu.Item key="mapuser">
            <NavLink onClick={toggleCollapsed} to={`${path}/MapUser/view`}>
              Carte Utilisateurs
            </NavLink>
          </Menu.Item>
        ),
        <Menu.Item key="track">
          <NavLink onClick={toggleCollapsed} to={`${path}/track/view`}>
            Logistique
          </NavLink>
        </Menu.Item>,
      ].filter(Boolean);

      // Build Finance submenu items
      const financeMenuItems = [
        canView("balance") && (
          <Menu.Item key="view">
            <NavLink onClick={toggleCollapsed} to={`${path}/balance/view`}>
              Balance
            </NavLink>
          </Menu.Item>
        ),
        canView("historique") && (
          <Menu.Item key="views">
            <NavLink onClick={toggleCollapsed} to={`${path}/Historique/view`}>
              Historique
            </NavLink>
          </Menu.Item>
        ),
      ].filter(Boolean);

      // Build Support submenu items
      const supportMenuItems = [
        <Menu.Item key="projectDetails">
          <NavLink onClick={toggleCollapsed} to={`${path}/Ticket/clients`}>
            Clients
          </NavLink>
        </Menu.Item>,
        <Menu.Item key="projectDetail">
          <NavLink onClick={toggleCollapsed} to={`${path}/Ticket/Livreurs`}>
            Chauffeurs
          </NavLink>
        </Menu.Item>,
      ].filter(Boolean);

      // Build Paramètres submenu items
      const parametresMenuItems = [
        canView("maintenance") && currentUser.user_role === "owner" && (
          <Menu.Item key="view">
            <NavLink onClick={toggleCollapsed} to={`${path}/Maintenance/view`}>
              Maintenance
            </NavLink>
          </Menu.Item>
        ),
        canView("calcule") && currentUser.user_role === "owner" && (
          <>
            <Menu.Item key="params">
              <NavLink onClick={toggleCollapsed} to={`${path}/param/view`}>
                Calcule de temps d’attente
              </NavLink>
            </Menu.Item>
            <Menu.Item key="views">
              <NavLink onClick={toggleCollapsed} to={`${path}/Calcule/view`}>
                Calcul des prix
              </NavLink>
            </Menu.Item>
          </>
        ),
      ].filter(Boolean);

      return (
        <>
          <Menu.Item
            key="home"
            icon={!topMenu && <FeatherIcon icon="home" />}
            title="Dashboard"
          >
            <NavLink
              key="dashboard"
              onClick={toggleCollapsed}
              to={`${path}`}
            >
              Dashboard
            </NavLink>
          </Menu.Item>

          {gestionMenuItems.length > 0 && (
            <SubMenu
              key="Project"
              icon={!topMenu && <FeatherIcon icon="sliders" />}
              title="Gestion"
            >
              {gestionMenuItems}
            </SubMenu>
          )}

          {utilisateursMenuItems.length > 0 && (
            <SubMenu
              key="utilisateurs"
              icon={!topMenu && <FeatherIcon icon="users" />}
              title="utilisateurs"
            >
              {utilisateursMenuItems}
            </SubMenu>
          )}

          {financeMenuItems.length > 0 && (
            <SubMenu
              key="Finance"
              icon={!topMenu && <FeatherIcon icon="dollar-sign" />}
              title="Finance"
            >
              {financeMenuItems}
            </SubMenu>
          )}

          {canView("support") && supportMenuItems.length > 0 && (
            <SubMenu
              key="Problem"
              icon={!topMenu && <FeatherIcon icon="tool" />}
              title="Support"
            >
              {supportMenuItems}
            </SubMenu>
          )}

          {parametresMenuItems.length > 0 && (
            <SubMenu
              key="Settings"
              icon={!topMenu && <FeatherIcon icon="settings" />}
              title="Paramètres"
            >
              {parametresMenuItems}
            </SubMenu>
          )}

          <Menu.Item
            key="logout"
            icon={!topMenu && <FeatherIcon icon="log-out" />}
            title="logout"
            onClick={() => handleLogOut()}
          >
            <NavLink
              onClick={toggleCollapsed}
              to={`${path}/project/view/list`}
            >
              Déconnecter
            </NavLink>
          </Menu.Item>
        </>
      );
    }
    return null; // Render nothing if the role is not recognized
  };

  return (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? "inline" : "horizontal"}
      theme={darkMode && "dark"}
      // // eslint-disable-next-line no-nested-ternary
      defaultSelectedKeys={
        !topMenu
          ? [
              `${
                mainPathSplit.length === 1
                  ? "home"
                  : mainPathSplit.length === 2
                  ? mainPathSplit[1]
                  : mainPathSplit[2]
              }`,
            ]
          : []
      }
      defaultOpenKeys={
        !topMenu
          ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : "dashboard"}`]
          : []
      }
      overflowedIndicator={<FeatherIcon icon="more-vertical" />}
      openKeys={openKeys}
    >
      {renderMenuItems()}
    </Menu>
  );
};

MenuItems.propTypes = {
  darkMode: propTypes.bool,
  topMenu: propTypes.bool,
  toggleCollapsed: propTypes.func,
};

export default MenuItems;
