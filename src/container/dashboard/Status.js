import React, { Suspense, lazy, useEffect, useState } from "react";
import { Row, Col, Skeleton, Radio } from "antd";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Button } from "../../components/buttons/buttons";
import { Main } from "../styled";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";

import DashChartClientIcon from "../../static/img/DashChartClientIcon.svg";
import dashCommandCountIcon from "../../static/img/dashCommandCountIcon.svg";
import DashSocCountIcon from "../../static/img/DashSocCountIcon.svg";
import DashDriverCountIcon from "../../static/img/DashDriverCountIcon.svg";

import {
  ChartjsDonutChart,
} from "../../components/charts/chartjs";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import styled from "styled-components";


import Counter from "./Counter";

import Reservations from "./List";
import Heading from "../../components/heading/heading";
import Addagent from "../agent/Addagent";
import Addadmin from "../admin/Addadmin";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import StatusCommand from "./StatusCommands";

const Status = () => {
  const currentUser = useSelector((store) => store?.user?.currentUser);
  const [allCommands, setAllCommands] = useState([]);
 
  const chartData = useSelector((store) => {
    return {
      commandCount: store?.charts?.commandCount,
      clientCount: store?.charts?.clientCount,
      companyCount: store?.charts?.companyCount,
      driverCount: store?.charts?.driverCount,
      agentCount: store?.charts?.agentCount,
      vehiculeCount: store?.charts?.vehiculeCount,
    };
  });
  const [state, setState] = useState({
    visibleAgent: false,
    visibleAdmin: false,
  });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }


  const [dateFilter, setDateFilter] = useState(null);
  useEffect(() => {
    if (currentUser) {
      let combinedCommands = [];

      // Include main user's commands if available
      if (currentUser.driver_commands?.length > 0) {
        combinedCommands = [...currentUser.driver_commands];
      }

      // Include sub_drivers' commands
      if (currentUser.sub_drivers?.length > 0) {
        currentUser.sub_drivers.forEach((subDriver) => {
          if (subDriver.driver_commands?.length > 0) {
            combinedCommands = [
              ...combinedCommands,
              ...subDriver.driver_commands,
            ];
          }
        });
      }

      setAllCommands(combinedCommands);
    }
  }, [currentUser]);
 
  const charts = useSelector((store) => store.charts);
  const adminsList = useSelector((store) => store?.user?.admins?.results);
  const agentsList = useSelector((store) => store?.user?.agents?.results);


  const translateEtatToFrench = (etat) => {
    switch (etat) {
      case "Pending":
        return "En Attente"; // French for "Pending"
      case "Processing":
        return "En Traitement"; // French for "Processing"

      case "Completed":
        return "Terminé"; // French for "Completed"
      case "Canceled":
        return "Annulé"; // French for "Canceled"
      case "Failed":
        return "Échoué"; // French for "Failed"
      default:
        return etat; // Fallback to the original value if no translation is found
    }
  };
  // Data array with translated etat values
  const data = [
    currentUser.user_role === "owner" || currentUser.user_role === "admin"
      ? {
          etat: translateEtatToFrench("Pending"), // Translate "Pending" to French
          value: charts?.commandData?.pendingCount || 0,
          percentage: Math.floor(
            (charts?.commandData?.pendingCount / charts?.commandCount) * 100
          ),
          color: "#53B483",
        }
      : null,

    {
      etat: translateEtatToFrench("Completed"), // Translate "Completed" to French
      value: charts?.commandData?.completedCount || 0,
      percentage: Math.floor(
        (charts?.commandData?.completedCount / charts?.commandCount) * 100
      ),
      color: "#FF6384",
    },
    {
      etat: translateEtatToFrench("Canceled"), // Translate "Canceled" to French
      value:
        (charts?.commandData?.canceledByClientCount || 0) +
        (charts?.commandData?.canceledByPartnerCount || 0),
      percentage: Math.floor(
        ((charts?.commandData?.canceledByClientCount +
          charts?.commandData?.canceledByPartnerCount) /
          charts?.commandCount) *
          100
      ),
      color: "#36A2EB",
    },
  ].filter(Boolean); // Remove null values (e.g., if "Pending" is not included for non-admin/owner users)

  const showModalAgent = () => {
    setState({
      ...state,
      visibleAgent: true,
    });
  };

  const onCancelAgent = () => {
    setState({
      ...state,
      visibleAgent: false,
    });
  };

  const showModalAdmin = () => {
    setState({
      ...state,
      visibleAdmin: true,
    });
  };
  const onCancelAdmin = () => {
    setState({
      ...state,
      visibleAdmin: false,
    });
  };
  const commandStatuses = [
    "Pending",
    "On_route_to_delivery",
    "Arrived_at_delivery",
    "Arrived_at_pickup",
    "driver_on_route_to_pickup",
    "Go_to_pickup",
  ];
  const translateToFrench = (label) => {
    switch (label) {
      case "Pending":
        return "En Attente"; // French for "Pending"
      case "Completed":
        return "Terminé"; // French for "Completed"
      case "Canceled":
        return "Annulé"; // French for "Canceled"
      case "Failed":
        return "Échoué"; // French for "Failed"
      default:
        return label; // Fallback to the original label if no translation is found
    }
  };

  // Original labels
  const originalLabels = ["Pending", "Completed", "Canceled", "Failed"];

  // Translate labels into French
  const frenchLabels = originalLabels.map((label) => translateToFrench(label));

  return (
    <ChartContainer>
      <PageHeader
        ghost
        title="Logistique Dashboard"
        buttons={[
          
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards title="Aperçus" size={"large"}>
              <Row justify={"space-between"}>
                {/* <ChartHeader> */}
                {currentUser?.user_role === "owner" ||
                currentUser?.user_role === "driver" ||
                currentUser?.user_role === "admin" ? (
                  <>
                    {" "}
                    <Col md={6} xs={12}>
                      <NavLink
                        to="/admin/commandes/view"
                        style={{ color: "unset" }}
                      >
                        <ChartHeaderItem>
                          <img src={dashCommandCountIcon} alt="" />
                          <div>
                            <Counter
                              endValue={allCommands.length}
                              incrementDuration={3}
                            />

                            <span>Commande</span>
                          </div>
                        </ChartHeaderItem>
                      </NavLink>
                    </Col>
                    <Col md={6} xs={12}>
                      <NavLink
                        to="/admin/Livreurs/list"
                        style={{ color: "unset" }}
                      >
                        <ChartHeaderItem>
                          <img src={DashDriverCountIcon} alt="" />
                          <div>
                            <Counter
                              endValue={currentUser.sub_drivers.length}
                              incrementDuration={3}
                            />

                            <span>Chauffeur</span>
                          </div>
                        </ChartHeaderItem>
                      </NavLink>
                    </Col>
                  </>
                ) : (
                  <>
                    {" "}
                    <Col md={6} xs={12}>
                      <NavLink
                        to="/admin/Agents/view"
                        style={{ color: "unset" }}
                      >
                        <ChartHeaderItem>
                          <img src={DashChartClientIcon} alt="" />
                          <div>
                            {currentUser.user_role === "company" ? (
                              <Counter
                                endValue={chartData.agentCount}
                                incrementDuration={3}
                              />
                            ) : (
                              <Counter
                                endValue={chartData.agentCount}
                                incrementDuration={3}
                              />
                            )}
                            <span>Agent</span>
                          </div>
                        </ChartHeaderItem>
                      </NavLink>
                    </Col>
                    <Col md={6} xs={12}>
                      <ChartHeaderItem>
                        <img src={dashCommandCountIcon} alt="" />
                        <div>
                          <Counter
                            endValue={chartData?.commandCount}
                            incrementDuration={3}
                          />

                          <span>Commande</span>
                        </div>
                      </ChartHeaderItem>
                    </Col>
                    <Col md={6} xs={12}>
                      <ChartHeaderItem>
                        <img src={DashSocCountIcon} alt="" />
                        <div>
                          <Counter
                            endValue={chartData.vehiculeCount}
                            incrementDuration={3}
                          />

                          <span>Véhicule</span>
                        </div>
                      </ChartHeaderItem>
                    </Col>
                    <Col md={6} xs={12}>
                      <ChartHeaderItem>
                        <img src={DashDriverCountIcon} alt="" />
                        <div>
                          {currentUser.user_role === "company" ? (
                            <Counter
                              endValue={chartData.driverCount}
                              incrementDuration={3}
                            />
                          ) : (
                            <Counter
                              endValue={chartData.driverCount}
                              incrementDuration={3}
                            />
                          )}

                          <span>Chauffeur</span>
                        </div>
                      </ChartHeaderItem>
                    </Col>
                  </>
                )}
              </Row>
            </Cards>
          </Col>
        </Row>
        {
          <Row justify="center" gutter={25}>
            <Col
              xxl={18}
              lg={16}
              xs={24}
              md={16}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Cards
                title="Etat des expéditions"
                isbutton={
                  <div className="card-radio">
                    <Radio.Group
                      // onChange={forcastOverview}
                      defaultValue="all"
                    >
                      <Radio.Button
                        value="all"
                        onClick={() => setDateFilter(null)}
                      >
                        Tous
                      </Radio.Button>
                      <Radio.Button
                        value="today"
                        onClick={() => setDateFilter("today")}
                      >
                        Aujourd'hui
                      </Radio.Button>
                      <Radio.Button
                        value="week"
                        onClick={() => setDateFilter("thisWeek")}
                      >
                        Semaine
                      </Radio.Button>
                      <Radio.Button
                        value="month"
                        onClick={() => setDateFilter("thisMonth")}
                      >
                        Mois
                      </Radio.Button>
                      <Radio.Button
                        value="year"
                        onClick={() => setDateFilter("thisYear")}
                      >
                        Année
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                }
                size={"meduim"}
              >
                <Cards headless>
                  <div
                    style={{
                      // minHeight: "calc(100vh - 320px)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10%",
                    }}
                  >
                    <Row
                      gutter={[25, 50]}
                      justify={"space-between"}
                      align={"center"}
                      // md={24}
                      style={{ width: "100%", alignItems: "center" }}
                    >
                      <Col md={24} lg={12} flex={"auto"}>
                        <section>
                          <ChartjsDonutChart
                            labels={frenchLabels}
                            datasets={[
                              {
                                data: [
                                  allCommands?.filter((command) =>
                                    commandStatuses.includes(
                                      command.commandStatus
                                    )
                                  ).length || 0,

                                  allCommands?.filter(
                                    (command) =>
                                      command.commandStatus ===
                                      "Canceled_by_client"
                                  ).length || 0, //

                                  allCommands?.filter(
                                    (command) =>
                                      command.commandStatus === "Completed"
                                  ).length || 0, //this one is completed
                                  (charts?.commandData?.failedPickupCount ||
                                    0) +
                                    (charts?.commandData?.failedDeliveryCount ||
                                      0),
                                ],
                                backgroundColor: [
                                  "#53B483",
                                  "#59B4D1",
                                  "#FF6384",
                                ],
                              },
                            ]}
                            height={"300%"}
                          />
                          {/* <div style={{ width: "100%" }}></div> */}
                        </section>
                      </Col>
                      <Col md={24} lg={11} flex={"auto"}>
                        <Table>
                          <thead>
                            <tr>
                              <th>Etats</th>
                              <th>Valeur</th>
                              <th>% </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data
                              .filter((row) => row !== null)
                              .map((row, index) => (
                                <tr key={index}>
                                  <td>
                                    <Cercle color={row.color} /> {row.etat}
                                  </td>
                                  <td>{row.value}</td>
                                  <td>{row.percentage}%</td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </div>
                </Cards>
              </Cards>
            </Col>
            <Col
              xxl={6}
              xs={24}
              lg={8}
              md={8}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="project-users-wrapper">
                <Cards
                  title={
                    currentUser?.user_role === "owner" ||
                    currentUser?.user_role === "admin"
                      ? "Admin"
                      : "Agent"
                  }
                >
                  <div className="project-users">
                    {["owner", "admin"].includes(currentUser?.user_role)
                      ? adminsList
                          ?.filter((el) => el.user_role === "admin")
                          .map((admin, index) => (
                            <div className="porject-user-single">
                              <div>
                                <img
                                  src={
                                    admin?.profile_picture?.url ||
                                    require(`../../static/img/users/1.png`)
                                  }
                                  alt=""
                                />
                              </div>
                              <div>
                                <Heading as="h5">
                                  {admin?.firstName} {admin?.lastName}
                                </Heading>
                                <p style={{ color: "#53B483" }}>Active</p>
                              </div>
                            </div>
                          ))
                      : agentsList
                          ?.filter(
                            (el) =>
                              (currentUser?.user_role === "company" &&
                                el?.user_role === "agent" &&
                                el?.agent_company?.documentId ===
                                  currentUser?.companies[0]?.documentId) ||
                              (currentUser?.user_role === "agent" &&
                                el?.user_role === "agent" &&
                                el?.agent_company?.documentId ===
                                  currentUser?.agent_company?.documentId)
                          )
                          .map((agent, index) => (
                            <div className="porject-user-single">
                              <div>
                                <img
                                  src={
                                    agent?.profile_picture?.url ||
                                    require(`../../static/img/users/1.png`)
                                  }
                                  alt=""
                                />
                              </div>
                              <div>
                                <Heading as="h5">{agent?.username}</Heading>
                                <p style={{ color: "#53B483" }}>Active</p>
                              </div>
                            </div>
                          ))}
                  </div>
                </Cards>
              </div>
            </Col>
          </Row>
        }
        {(currentUser?.user_role === "owner" ||
          currentUser?.user_role === "admin") && (
          <Row>
            <Cards>
              {/* {reservationLoading ? (
              <Skeleton active={reservationLoading} />
            ) : ( */}
              {/* // <Suspense> */}
              <StatusCommand textFilter={""} />

              {/* // </Suspense>
            )} */}
            </Cards>
          </Row>
        )}
        {/* <Addadmin onCancel={onCancelAdmin} visible={state.visibleAdmin} />
        <Addagent onCancel={onCancelAgent} visible={state.visibleAgent} /> */}
      </Main>
    </ChartContainer>
  );
};

export default Status;

const ChartHeader = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ChartHeaderItem = styled.div`
  width: 20%;
  height: 100px;
  /* background-color: brown; */
  display: flex;
  gap: 20px;
  align-items: center;
  line-height: 16px;
`;

const Table = styled.table`
  /* margin: 0 auto; */
  width: 100%;
  border-collapse: collapse;
  /* border: 1px solid #ccc; */
  th {
    border-bottom: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
  td:first-child {
    width: 95%;
    align-items: center;
    display: flex;
    gap: 12px;
    /* border: 1px solid #ccc; */
    padding: 8px;
    text-align: left;
  }
  th {
    /* background-color: #f2f2f2; */
  }
  tr:nth-child(even) {
    /* background-color: #f2f2f2; */
  }
  tr:hover {
    /* background-color: #ddd; */
  }
  th:last-child,
  td:last-child {
    text-align: right;
  }
`;

const Cercle = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
`;

// const Counter = styled.div`
//   font: 800 24px system-ui;
//   position: relative;

//   &::before {
//     content: attr(data-count);
//     /* position: absolute; */
//     /* top: 0;
//     left: 0; */
//     animation: counter 3s steps(1) forwards;
//   }

//   @keyframes counter {
//     from {
//       content: "0";
//     }
//     to {
//       content: attr(data-count);
//     }
//   }
// `;

const ChartContainer = styled.div`
  .project-users-wrapper {
    .btn-addUser {
      padding: 0px 12.6px;
      font-size: 12px;
      font-weight: 500;
      border-color: ${({ theme }) => theme["border-color-light"]};
    }
    i + span,
    svg + span,
    img + span {
      ${({ theme }) => (theme.rtl ? "margin-right" : "margin-left")}: 6px;
    }
  }
  .project-users::-webkit-scrollbar {
    display: none;
  }
  .project-users {
    min-height: 368px;
    max-height: 400px;
    overflow: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    .porject-user-single {
      width: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 0;
      }
      & > div {
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 15px;
      }
      div {
        img {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }
        h1 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        p {
          color: ${({ theme }) => theme["gray-solid"]};
          margin: 0;
        }
      }
    }
  }
`;
