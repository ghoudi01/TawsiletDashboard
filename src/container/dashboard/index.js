import React, { Suspense, lazy, useEffect, useState } from "react";
import { Row, Col, Skeleton, Radio } from "antd";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Button } from "../../components/buttons/buttons";
import { Main } from "../styled";
import { ShareButtonPageHeader } from "../../components/buttons/share-button/share-button";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
import { CalendarButtonPageHeader } from "../../components/buttons/calendar-button/calendar-button";

import DashChartClientIcon from "../../static/img/DashChartClientIcon.svg";
import dashCommandCountIcon from "../../static/img/dashCommandCountIcon.svg";
import DashSocCountIcon from "../../static/img/DashSocCountIcon.svg";
import DashDriverCountIcon from "../../static/img/DashDriverCountIcon.svg";

import {
  ChartjsBarChart,
  ChartjsHorizontalChart,
  ChartjsStackedChart,
  ChartjsLineChart,
  ChartjsAreaChart,
  ChartjsBarChartTransparent,
  ChartjsDonutChart,
  ChartjsPieChart,
  ChartjsDonutChart2,
} from "../../components/charts/chartjs";
import { useDispatch } from "react-redux";
import {
  // getCommandCompletedCount,
  getCommandCount,
  getCommandStatusCount,
  getUsersCount,
  // getCommandDispatchingCount,
  // getCommandPendingCount,
  // getCommandProcessingCount,
} from "../../redux/chartContent/chartSlice";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { getAdmins, getusersTwoDeep } from "../../redux/User/userSlice";

import Counter from "./Counter";

// const Reservations = lazy(() => import("./List"));
import Reservations from "./List";
import Heading from "../../components/heading/heading";
import Addagent from "../agent/Addagent";
import Addadmin from "../admin/Addadmin";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

const Dashboard = () => {
  const currentUser = useSelector((store) => store?.user?.currentUser);
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
  const dispatch = useDispatch();
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

  function getFormattedDate(timePeriod) {
    const currentDate = new Date();

    switch (timePeriod) {
      case "today":
        return formatDate(currentDate);

      case "thisWeek":
        const weekStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay()
        );
        return formatDate(weekStart);

      case "thisMonth":
        return `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-01`;

      case "thisYear":
        return `${currentDate.getFullYear()}-01-01`;

      default:
        throw new Error("Invalid time period");
    }
  }
  // ----------------- getFormattedDate(dateFilter)
  // const todayFormatted = getFormattedDate("today");
  // const thisWeekFormatted = getFormattedDate("thisWeek");
  // const thisMonthFormatted = getFormattedDate("thisMonth");
  // const thisYearFormatted = getFormattedDate("thisYear");

  // console.log("Today:", todayFormatted);
  // console.log("This Week:", thisWeekFormatted);
  // console.log("This Month:", thisMonthFormatted);
  // console.log("This Year:", thisYearFormatted);

  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    if (currentUser) {
      dispatch(getUsersCount());
      let dateToFilter = dateFilter ? getFormattedDate(dateFilter) : null;
      dispatch(
        getCommandStatusCount({ dateFilter: dateFilter ? dateToFilter : null })
      );
    }
  }, [currentUser, dateFilter, dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(getAdmins({}))
      // dispatch(getReservations({ free: true }));

      // dispatch(getusersTwoDeep());
    }
  }, [currentUser]);

  const charts = useSelector((store) => store.charts);
  const adminsList = useSelector((store) => store?.user?.admins?.results);
  const agentsList = useSelector((store) => store?.user?.agents?.results);
  const reservationLoading = useSelector(
    (store) => store?.reservations?.isLoading
  );

 
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
    etat: translateEtatToFrench("Processing"), // Translate "Processing" to French
    value:
      (charts?.commandData?.dispatchedToPartnerCount || 0) +
      (charts?.commandData?.assignedToDriverCount || 0),
    percentage: Math.floor(
      ((charts?.commandData?.dispatchedToPartnerCount +
        charts?.commandData?.assignedToDriverCount) /
        charts?.commandCount) *
        100
    ),
    color: "#9E57E5",
  },
 
  
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
  {
    etat: translateEtatToFrench("Failed"), // Translate "Failed" to French
    value:
      (charts?.commandData?.failedPickupCount || 0) +
      (charts?.commandData?.failedDeliveryCount || 0),
    percentage: Math.floor(
      ((charts?.commandData?.failedPickupCount +
        charts?.commandData?.failedDeliveryCount) /
        charts?.commandCount) *
        100
    ),
    color: "#FFCE56",
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
  const translateToFrench = (label) => {
    switch (label) {
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
        return label; // Fallback to the original label if no translation is found
    }
  };
  
  // Original labels
  const originalLabels = [
    "Pending",
    "Processing",
    
  
    "Completed",
    "Canceled",
    "Failed",
  ];
  
  // Translate labels into French
  const frenchLabels = originalLabels.map((label) => translateToFrench(label));
  
  return (
    <ChartContainer>
      <PageHeader
        ghost
        title="Logistique Dashboard"
        buttons={[
          <div key="6" className="page-header-actions">
            <CalendarButtonPageHeader key="1" />
            {/* <ExportButtonPageHeader key="2" />
            <ShareButtonPageHeader key="3" /> */}

            {/* <Button size="small" key="4" type="primary" className="btn_ADD">
              <FeatherIcon icon="plus" size={14} className="btn_Suivant" />
              Ajouter nouveau

            </Button> */}
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards
              title="Aperçus"
              // isbutton={
              //   <div className="card-radio">
              //     <Radio.Group
              //       // colorBgContainer="#53B483"
              //       // colorBorder="#53B483"
              //       // style={{ background: "#53B483", color: "red" }}
              //       // onChange={forcastOverview}
              //       defaultValue="today"
              //     >
              //       <Radio.Button
              //         // style={{
              //         //   // backgroundColor: "red",
              //         //   color: "#53B483",
              //         // }}
              //         value="today"
              //       >
              //         Today
              //       </Radio.Button>
              //       <Radio.Button value="week">Week</Radio.Button>
              //       <Radio.Button value="month">Month</Radio.Button>
              //       <Radio.Button value="year">Year</Radio.Button>
              //     </Radio.Group>
              //   </div>
              // }
              size={"large"}
            >
              <Row justify={"space-between"}>
                {/* <ChartHeader> */}
                {currentUser?.user_role === "owner" ||
                currentUser?.user_role === "admin" ? (
                  <>
                    {" "}
                    <Col md={6} xs={12}>
                      <NavLink
                        to="/admin/clients/list"
                        style={{ color: "unset" }}
                      >
                        <ChartHeaderItem>
                          <img src={DashChartClientIcon} alt="" />
                          <div>
                            <Counter
                              endValue={chartData.clientCount}
                              incrementDuration={3}
                            />
                            <span>Client</span>
                          </div>
                        </ChartHeaderItem>
                      </NavLink>
                    </Col>
                    <Col md={6} xs={12}>
                      <NavLink
                        to="/admin/commandes/view"
                        style={{ color: "unset" }}
                      >
                        <ChartHeaderItem>
                          <img src={dashCommandCountIcon} alt="" />
                          <div>
                            <Counter
                              endValue={charts?.commandCount}
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
                              endValue={chartData.driverCount}
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
                      <NavLink
                        to="/admin/commandes/view"
                        style={{ color: "unset" }}
                      >
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
                      </NavLink>
                    </Col>
                    <Col md={6} xs={12}>
                      <NavLink
                        to="/admin/Vehicules/view"
                        style={{ color: "unset" }}
                      >
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
                      </NavLink>
                    </Col>
                  </>
                )}
                {/* </ChartHeader> */}
                {/* <h2>Welcome to StrikingDash</h2> */}
                {/* <ChartjsBarChartGrad
                  label={"chart"}
                  height={500}
                  datasets={[{}]}
                /> */}
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
                            // labels={[
                            //   "Pending",
                            //   "Processing",
                            //   "Completed",
                            //   "Canceled",
                            //   "Failed",
                            // ]}
                            labels={frenchLabels} 
                            datasets={[
                              {
                                data: [
                                  charts?.commandData?.pendingCount || 0,
                                  (charts?.commandData
                                    ?.dispatchedToPartnerCount || 0) +
                                    (charts?.commandData
                                      ?.assignedToDriverCount || 0),
                                  (charts?.commandData
                                    ?.driverOnRouteToPickupCount || 0) +
                                    (charts?.commandData
                                      ?.arrivedAtPickupCount || 0) +
                                    (charts?.commandData?.pickedUpCount || 0),
                                  (charts?.commandData
                                    ?.onRouteToDeliveryCount || 0) +
                                    (charts?.commandData
                                      ?.arrivedAtDeliveryCount || 0) +
                                    (charts?.commandData?.deliveredCount || 0),
                                  charts?.commandData?.completedCount || 0,
                                  (charts?.commandData?.canceledByClientCount ||
                                    0) +
                                    (charts?.commandData
                                      ?.canceledByPartnerCount || 0),
                                  (charts?.commandData?.failedPickupCount ||
                                    0) +
                                    (charts?.commandData?.failedDeliveryCount ||
                                      0),
                                ],
                                backgroundColor: [
                                  "#53B483",
                                  "#9E57E5",
                                  "#59B4D1",
                                  "#F3935D",
                                  "#FF6384",
                                  "#36A2EB",
                                  "#FFCE56",
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
                  isbutton={
                    currentUser?.user_role === "owner" ? (
                      <Button
                        className="btn_ADD"
                        outlined
                        size="small"
                        onClick={showModalAdmin}
                      >
                        <FeatherIcon icon="user-plus" size={14} /> Ajouter Admin
                      </Button>
                    ) : currentUser?.user_role === "company" ? (
                      <Button
                        className="btn_ADD"
                        outlined
                        size="small"
                        onClick={showModalAgent}
                      >
                        <FeatherIcon icon="user-plus" size={14} /> Ajouter Agent
                      </Button>
                    ) : null
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
                                <Heading as="h5">{admin?.firstName} {admin?.lastName}</Heading>
                                <p style={{ color: "#53B483" }}>Active</p>
                              </div>
                            </div>
                          ))
                      : agentsList
                          ?.filter(
                            (el) =>
                              (currentUser?.user_role === "company" &&
                                el?.user_role === "agent" &&
                                el?.agent_company?.documentId === currentUser?.companies[0]?.documentId) ||
                              (currentUser?.user_role === "agent" &&
                                el?.user_role === "agent" &&
                                el?.agent_company?.documentId === currentUser?.agent_company?.documentId)
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
              <Reservations textFilter={""} />

              {/* // </Suspense>
            )} */}
            </Cards>
          </Row>
        )}
        <Addadmin onCancel={onCancelAdmin} visible={state.visibleAdmin} />
        <Addagent onCancel={onCancelAgent} visible={state.visibleAgent} />
      </Main>
    </ChartContainer>
  );
};

export default Dashboard;

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
