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

  const renderMenuItems = () => {
    switch (roleUser) {
      case "owner":
      case "admin":
      case "driver":
        return (
          <>
            {userRole !== "driver" && (
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
            )}
            {userRole === "driver" && (
              <Menu.Item
                key="homee"
                icon={!topMenu && <FeatherIcon icon="home" />}
                title="Dashboard"
              >
                <NavLink
                  key="dashboardd"
                  onClick={toggleCollapsed}
                  to={`${path}/stats/dashboard`}
                >
                  Dashboard
                </NavLink>
              </Menu.Item>
            )}
            {userRole !== "driver" && (
              <SubMenu
                key="Project"
                icon={!topMenu && <FeatherIcon icon="sliders" />}
                title="Gestion"
              >
                <Menu.Item key="reservations">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/reservations/view`}
                  >
                    Reservations
                  </NavLink>
                </Menu.Item>

                <Menu.Item key="commandes">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/commandes/view`}
                  >
                    Commandes
                  </NavLink>
                </Menu.Item>

                <Menu.Item key="ProjectCreate">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/Vehicules/view`}
                  >
                    Véhicule
                    {vehiculeCount > 0 && (
                      <span className="reservation_notification">
                        {vehiculeCount > 99 ? "99+" : vehiculeCount}
                      </span>
                    )}
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="projectDetails">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/clients/list`}
                  >
                    Clients
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="projectDetail">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/Livreurs/list`}
                  >
                    Chauffeurs
                    {driverCount > 0 && (
                      <span className="reservation_notification">
                        {driverCount > 99 ? "99+" : driverCount}
                      </span>
                    )}
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            )}
            {userRole !== "driver" && (
              <SubMenu
                key="utilisateurs"
                icon={!topMenu && <FeatherIcon icon="users" />}
                title="utilisateurs"
              >
                {currentUser.user_role === "owner" && (
                  <>
                    <Menu.Item key="view">
                      <NavLink
                        onClick={toggleCollapsed}
                        to={`${path}/Admins/view`}
                      >
                        Admin
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="views">
                      <NavLink
                        onClick={toggleCollapsed}
                        to={`${path}/Agents/view`}
                      >
                        Agent
                      </NavLink>
                    </Menu.Item>
                  </>
                )}

                <Menu.Item key="track">
                  <NavLink onClick={toggleCollapsed} to={`${path}/track/view`}>
                    Logistique
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="newDriver">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/newDriver/view`}
                  >
                    New Driver
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            )}
            <SubMenu
              key="Finance"
              icon={!topMenu && <FeatherIcon icon="dollar-sign" />}
              title="Finance"
            >
              {currentUser.user_role === "owner" && (
                <Menu.Item key="view">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/balance/view`}
                  >
                    Balance
                  </NavLink>
                </Menu.Item>
              )}
              {currentUser.user_role === "driver" && (
                <Menu.Item key="view">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/driver/balance`}
                  >
                    Balance
                  </NavLink>
                </Menu.Item>
              )}
              <Menu.Item key="views">
                <NavLink
                  onClick={toggleCollapsed}
                  to={`${path}/Historique/view`}
                >
                  Historique
                </NavLink>
              </Menu.Item>
            </SubMenu>
            {currentUser.user_role !== "driver" && (
              <SubMenu
                key="Problem"
                icon={!topMenu && <FeatherIcon icon="tool" />}
                title="Support"
              >
                <Menu.Item key="projectDetails">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/Ticket/clients`}
                  >
                    Clients
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="projectDetail">
                  <NavLink
                    onClick={toggleCollapsed}
                    to={`${path}/Ticket/Livreurs`}
                  >
                    Chauffeurs
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            )}
            {userRole !== "driver" && (
              <SubMenu
                key="Settings"
                icon={!topMenu && <FeatherIcon icon="settings" />}
                title="Paramètres"
              >
                {currentUser.user_role !== "driver" && (
                  <Menu.Item key="view">
                    <NavLink
                      onClick={toggleCollapsed}
                      to={`${path}/Maintenance/view`}
                    >
                      Maintenance
                    </NavLink>
                  </Menu.Item>
                )}
                {currentUser.user_role === "owner" && (
                  <>
                    <Menu.Item key="params">
                      <NavLink
                        onClick={toggleCollapsed}
                        to={`${path}/param/view`}
                      >
                        param
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item key="views">
                      <NavLink
                        onClick={toggleCollapsed}
                        to={`${path}/Calcule/view`}
                      >
                        Calcule
                      </NavLink>
                    </Menu.Item>
                  </>
                )}
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
      case "company":
      case "agent":
        return (
          <>
            {/* Render specific menu items for company/agent */}{" "}
            <Menu.Item
              key="home"
              icon={!topMenu && <FeatherIcon icon="home" />}
              title="Dashboard"
            >
              <NavLink key="dashboard" onClick={toggleCollapsed} to={`${path}`}>
                Dashboard
              </NavLink>
            </Menu.Item>
            <SubMenu
              key="Project"
              icon={!topMenu && <FeatherIcon icon="sliders" />}
              title="Gestion"
            >
              <Menu.Item key="commandes">
                <NavLink
                  onClick={toggleCollapsed}
                  to={`${path}/commandes/view`}
                >
                  Commandes
                </NavLink>
              </Menu.Item>
              <Menu.Item key="ProjectCreate">
                <NavLink
                  onClick={toggleCollapsed}
                  to={`${path}/Vehicules/view`}
                >
                  Véhicule
                </NavLink>
              </Menu.Item>
              <Menu.Item key="projectDetail">
                <NavLink onClick={toggleCollapsed} to={`${path}/Livreurs/list`}>
                  Chauffeurs
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="utilisateurs"
              icon={!topMenu && <FeatherIcon icon="users" />}
              title="utilisateurs"
            >
              <Menu.Item key="views">
                <NavLink onClick={toggleCollapsed} to={`${path}/Agents/view`}>
                  Agent
                </NavLink>
              </Menu.Item>
              <Menu.Item key="track">
                <NavLink onClick={toggleCollapsed} to={`${path}/track/view`}>
                  Logistique
                </NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="Finance"
              icon={!topMenu && <FeatherIcon icon="dollar-sign" />}
              title="Finance"
            >
              <Menu.Item key="view">
                <NavLink onClick={toggleCollapsed} to={`${path}/balance/view`}>
                  Balance
                </NavLink>
              </Menu.Item>
              <Menu.Item key="views">
                <NavLink
                  onClick={toggleCollapsed}
                  to={`${path}/Historique/view`}
                >
                  Historique
                </NavLink>
              </Menu.Item>
            </SubMenu>
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
      default:
        return null; // Render nothing if the role is not recognized
    }
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
