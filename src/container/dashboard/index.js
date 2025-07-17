import React, { useEffect, useState } from "react";
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
import styled from "styled-components";
import Counter from "./Counter";
import Reservations from "./List";
import Heading from "../../components/heading/heading";
import Addagent from "../agent/Addagent";
import Addadmin from "../admin/Addadmin";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { CarOutlined } from "@ant-design/icons";

const API_BASE = process.env.REACT_APP_BACKUP_URL || "https://api.tawsilet.com/api/";

const Dashboard = () => {
  // State
  const [currentUser, setCurrentUser] = useState(null);
  const [drivers, setDrivers] = useState({ results: [], pagination: {} });
  const [clients, setClients] = useState({ results: [], pagination: {} });
  const [adminsList, setAdminsList] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [commands, setCommands] = useState([]);
  const [commandsCount, setCommandsCount] = useState({ pagination: {} });
  const [allCommands, setAllCommands] = useState([]);
  const [chartData, setChartData] = useState({
    commandCount: 0,
    clientCount: 0,
    companyCount: 0,
    driverCount: 0,
    agentCount: 0,
    commandData: {},
  });
  const [state, setState] = useState({
    visibleAgent: false,
    visibleAdmin: false,
  });
  const [dateFilter, setDateFilter] = useState(null);
  // Pagination states
  const [pageDriver, setPageDriver] = useState(1);
  const [pageSizeDriver] = useState(100);
  const [pageClient, setPageClient] = useState(1);
  const [pageSizeClient] = useState(100);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100);
  const [vehiculeCount, setVehiculeCount] = useState(0);

  // Loader state for Aperçus
  const [loadingApercus, setLoadingApercus] = useState(true);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const jwt = localStorage.getItem("token");
      if (!jwt) return;
      const { data } = await axios.get(`${API_BASE}users/me?pLevel=3`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setCurrentUser(data);
    };
    fetchCurrentUser();
  }, []);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      const jwt = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}usersbyrole/driver`, {
        params: { page: pageDriver, pageSize: pageSizeDriver, text: "" },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setDrivers(data);
    };
    fetchDrivers();
  }, [pageDriver, pageSizeDriver]);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingApercus(true);
      const jwt = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}usersbyrole/client`, {
        params: { page: pageClient, pageSize: pageSizeClient, text: "" },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setClients(data);
      setLoadingApercus(false);
    };
    fetchClients();
  }, [pageClient, pageSizeClient]);

  // Fetch admins
  useEffect(() => {
    const fetchAdmins = async () => {
      const jwt = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}users`, {
        params: {
          "filters[user_role][$eq]": "admin",
          "pagination[page]": 1,
          "pagination[pageSize]": 100,
        },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setAdminsList(data?.results || []);
    };
    fetchAdmins();
  }, []);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      const jwt = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}users`, {
        params: {
          "filters[user_role][$startsWith]": "agent",
          "pagination[page]": 1,
          "pagination[pageSize]": 100,
        },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setAgentsList(data?.results || []);
    };
    fetchAgents();
  }, []);

  // Fetch commands
  useEffect(() => {
    const fetchCommands = async () => {
      const jwt = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}commands`, {
        params: { "pagination[page]": page, "pagination[pageSize]": pageSize },
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setCommands(data?.results || []);
      setCommandsCount({ pagination: data?.pagination || {} });
      setAllCommands((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newCommands = (data?.results || []).filter((c) => !existingIds.has(c.id));
        return [...prev, ...newCommands];
      });
    };
    fetchCommands();
  }, [page, pageSize]);

  // Fetch chart data (counts)
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingApercus(true);
      const jwt = localStorage.getItem("token");
      // Users count
      const usersCountRes = await axios.post(`${API_BASE}users/count`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      // Command status count
      const commandStatusRes = await axios.post(`${API_BASE}command/count`, { data: { dateFilter } }, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setChartData((prev) => ({
        ...usersCountRes.data,
        commandData: commandStatusRes.data,
      }));
      setLoadingApercus(false);
    };
    fetchChartData();
  }, [dateFilter]);

  // Fetch vehicule count with pagination
  useEffect(() => {
    const fetchVehiculeCount = async () => {
      const jwt = localStorage.getItem("token");
      try {
        const { data } = await axios.get(`${API_BASE}vehicules`, {
          params: {
            "pagination[page]": 1,
            "pagination[pageSize]": 100,
          },
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setVehiculeCount(data?.meta?.pagination?.total|| 0);
      } catch (error) {
        // Optionally handle error
      }
    };
    fetchVehiculeCount();
  }, []);

  // Helpers
  const translateEtatToFrench = (etat) => {
    switch (etat) {
      case "Pending":
        return "En Attente";
      case "Processing":
        return "En Traitement";
      case "Completed":
        return "Terminé";
      case "Canceled":
        return "Annulé";
      case "Failed":
        return "Échoué";
      default:
        return etat;
    }
  };
  const data = [
    currentUser?.user_role === "owner" || currentUser?.user_role === "admin"
      ? {
          etat: "En Cour",
          value: chartData?.commandData?.pendingCount || 0,
          percentage: Math.floor(
            (chartData?.commandData?.pendingCount / chartData?.commandCount) * 100
          ),
          color: "#EED653",
        }
      : null,
    {
      etat: translateEtatToFrench("Completed"),
      value: chartData?.commandData?.completedCount || 0,
      percentage: Math.floor(
        (chartData?.commandData?.completedCount / chartData?.commandCount) * 100
      ),
      color: "#53B483",
    },
    {
      etat: translateEtatToFrench("Canceled"),
      value:
        (chartData?.commandData?.canceledByClientCount || 0) +
        (chartData?.commandData?.canceledByPartnerCount || 0),
      percentage: Math.floor(
        ((chartData?.commandData?.canceledByClientCount +
          chartData?.commandData?.canceledByPartnerCount) /
          chartData?.commandCount) *
          100
      ),
      color: "#36A2EB",
    },
  ].filter(Boolean);

  const showModalAgent = () => setState((s) => ({ ...s, visibleAgent: true }));
  const onCancelAgent = () => setState((s) => ({ ...s, visibleAgent: false }));
  const showModalAdmin = () => setState((s) => ({ ...s, visibleAdmin: true }));
  const onCancelAdmin = () => setState((s) => ({ ...s, visibleAdmin: false }));

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
        return "En Attente";
      case "Completed":
        return "Terminé";
      case "Canceled":
        return "Annulé";
      case "Failed":
        return "Échoué";
      default:
        return label;
    }
  };
  const originalLabels = ["Pending", "Completed", "Canceled", "Failed"];
  const frenchLabels = originalLabels.map((label) => translateToFrench(label));
   // Render

  return (
    <ChartContainer>
      <PageHeader
        ghost
        title="Logistique Dashboard"
        
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards title="Aperçus" size={"large"}>
              {loadingApercus ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <Row justify={"space-between"}>
                  <Col md={6} xs={12}>
                    <NavLink to="/admin/clients/list" style={{ color: "unset" }}>
                      <ChartHeaderItem>
                        <img src={DashChartClientIcon} alt="" />
                        <div>
                          <Counter
                            endValue={clients?.pagination?.total || 0}
                            incrementDuration={3}
                          />
                          <span>Client</span>
                        </div>
                      </ChartHeaderItem>
                    </NavLink>
                  </Col>
                  <Col md={6} xs={12}>
                    <NavLink to="/admin/commandes/view" style={{ color: "unset" }}>
                      <ChartHeaderItem>
                        <img src={dashCommandCountIcon} alt="" />
                        <div>
                          <Counter
                            endValue={chartData?.commandCount || 0}
                            incrementDuration={1}
                          />
                          <span>Commande</span>
                        </div>
                      </ChartHeaderItem>
                    </NavLink>
                  </Col>
                  <Col md={6} xs={12}>
                    <NavLink to="/admin/Vehicules/view" style={{ color: "unset" }}>
                      <ChartHeaderItem>
                        {/* Replace image with Ant Design car icon */}
                        <CarOutlined style={{ fontSize: 48, color: '#59B4D1', background: '#EAF6FC', borderRadius: 12, padding: 8 }} />
                        <div>
                          <Counter
                            endValue={vehiculeCount}
                            incrementDuration={3}
                          />
                          <span>Véhicule</span>
                        </div>
                      </ChartHeaderItem>
                    </NavLink>
                  </Col>
                  <Col md={6} xs={12}>
                    <NavLink to="/admin/Livreurs/list" style={{ color: "unset" }}>
                      <ChartHeaderItem>
                        <img src={DashDriverCountIcon} alt="" />
                        <div>
                          <Counter
                            endValue={chartData.driverCount || 0}
                            incrementDuration={1}
                          />
                          <span>Chauffeur</span>
                        </div>
                      </ChartHeaderItem>
                    </NavLink>
                  </Col>
                </Row>
              )}
            </Cards>
          </Col>
        </Row>
        <Row justify="center" gutter={25}>
          <Col xxl={18} lg={16} xs={24} md={16} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Cards
              title="Etat des expéditions"
              isbutton={
                <div className="card-radio">
                  <Radio.Group defaultValue="all">
                    <Radio.Button value="all" onClick={() => setDateFilter(null)}>
                      Tous
                    </Radio.Button>
                    <Radio.Button value="today" onClick={() => setDateFilter("today")}>Aujourd'hui</Radio.Button>
                    <Radio.Button value="week" onClick={() => setDateFilter("thisWeek")}>Semaine</Radio.Button>
                    <Radio.Button value="month" onClick={() => setDateFilter("thisMonth")}>Mois</Radio.Button>
                    <Radio.Button value="year" onClick={() => setDateFilter("thisYear")}>Année</Radio.Button>
                  </Radio.Group>
                </div>
              }
              size={"meduim"}
            >
              <Cards headless>
                <div style={{ display: "flex", alignItems: "center", gap: "10%" }}>
                  <Row gutter={[25, 50]} justify={"space-between"} align={"center"} style={{ width: "100%", alignItems: "center" }}>
                    <Col md={24} lg={12} flex={"auto"}>
                      <section>
                        <ChartjsDonutChart
                          labels={frenchLabels}
                          datasets={[
                            {
                              data: [
                                allCommands?.filter((command) => commandStatuses.includes(command.commandStatus)).length || 0,
                                allCommands?.filter((command) => command.commandStatus === "Canceled_by_client").length || 0,
                                allCommands?.filter((command) => command.commandStatus === "Completed").length || 0,
                                (chartData?.commandData?.failedPickupCount || 0) + (chartData?.commandData?.failedDeliveryCount || 0),
                              ],
                              backgroundColor: ["#53B483", "#59B4D1", "#FF6384"],
                            },
                          ]}
                          height={"300%"}
                        />
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
                          {data.filter((row) => row !== null).map((row, index) => (
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
          <Col xxl={6} xs={24} lg={8} md={8} style={{ display: "flex", flexDirection: "column" }}>
            <div className="project-users-wrapper">
              <Cards
                title={currentUser?.user_role === "owner" || currentUser?.user_role === "admin" ? "Admin" : "Agent"}
                isbutton={
                  currentUser?.user_role === "owner" ? (
                    <Button className="btn_ADD" outlined size="small" onClick={showModalAdmin}>
                      <FeatherIcon icon="user-plus" size={14} /> Ajouter Admin
                    </Button>
                  ) : currentUser?.user_role === "company" ? (
                    <Button className="btn_ADD" outlined size="small" onClick={showModalAgent}>
                      <FeatherIcon icon="user-plus" size={14} /> Ajouter Agent
                    </Button>
                  ) : null
                }
              >
                <div className="project-users">
                  {["owner", "admin"].includes(currentUser?.user_role)
                    ? adminsList?.filter((el) => el.user_role === "admin").map((admin, index) => (
                        <div className="porject-user-single" key={admin.id || index}>
                          <div>
                            <img src={admin?.profile_picture?.url || require(`../../static/img/users/1.png`)} alt="" />
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
                              el?.agent_company?.documentId === currentUser?.companies?.[0]?.documentId) ||
                            (currentUser?.user_role === "agent" &&
                              el?.user_role === "agent" &&
                              el?.agent_company?.documentId === currentUser?.agent_company?.documentId)
                        )
                        .map((agent, index) => (
                          <div className="porject-user-single" key={agent.id || index}>
                            <div>
                              <img src={agent?.profile_picture?.url || require(`../../static/img/users/1.png`)} alt="" />
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
        {(currentUser?.user_role === "owner" || currentUser?.user_role === "admin") && (
          <Row>
            <Cards>
              <Reservations textFilter={""} />
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

const ChartHeaderItem = styled.div`
  width: 20%;
  height: 100px;
  display: flex;
  gap: 20px;
  align-items: center;
  line-height: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
    padding: 8px;
    text-align: left;
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
    -ms-overflow-style: none;
    scrollbar-width: none;
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
