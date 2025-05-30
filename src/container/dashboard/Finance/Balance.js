import React, { lazy, Suspense, useEffect, useState } from "react";
import { Row, Col, Skeleton } from "antd";
import { CardBarChart2, OverviewSalesCard } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import TopLandingPages from "../overview/performance/TopLandingPages";
import DailyOverview from "../overview/performance/DailyOverview";
import { useSelector, useDispatch } from "react-redux";
import { getPrices } from "../../../redux/pricing/settingSlice";
import { getCommandCount } from "../../../redux/chartContent/chartSlice";
import { fetchBalanceData } from "../../../redux/balance/balanceSlice";
import { getDriversWithCars } from "../../../redux/User/userSlice";
import Header from "./balanceComponents/Header";
import FinanceDashboardOverview from "./balanceComponents/FinanceDashboardOverview";

const AverageSalesRevenue = lazy(() =>
  import("../overview/sales/AverageSalesRevenue")
);

const Balance = () => {
  const dispatch = useDispatch();
  const [taille, settaille] = useState(24);
  const [sharedData, setsharedData] = useState();
  const [periodeFilter, setperiodeFilter] = useState("all");
  const reservationsMeta = useSelector(
    (state) => state?.reservations?.reservations?.meta
  );
  // my job
  const drivers = useSelector((state) => state?.user?.driversWithCars);
  const [groupedDriversPros, setGroupedDriversPros] = useState([]);
  const [groupedDriversNoPro, setGroupedDriversNoPro] = useState([]);
  const [groupedDriversProWithSubDrivers, setGroupedDriversProWithSubDrivers] =
    useState([]);
  const [totalCommands, setTotalCommands] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const pros = [];
    const noPros = [];
    const prosWithSubDrivers = [];

    const handledSubDriverIds = new Set();
    setIsLoading(true);
    drivers.forEach((driver) => {
      if (driver.pro === true && driver.user_role === "driver") {
        const subDrivers = Array.isArray(driver.sub_drivers)
          ? driver.sub_drivers
          : [];

        subDrivers.forEach((sd) => handledSubDriverIds.add(sd.id));

        const group = {
          pro: driver,
          subDrivers,
        };
        if (subDrivers.length > 0) {
          prosWithSubDrivers.push(group);
        } else {
          pros.push(driver);
        }
      }
    });

    // Handle non-pro drivers (false or null) who are not sub drivers of any pro
    drivers.forEach((driver) => {
      const isNotPro = driver.pro !== true;
      const isDriver = driver.user_role === "driver";
      const isNotSubDriver = !handledSubDriverIds.has(driver.id);

      if (isNotPro && isDriver && isNotSubDriver) {
        const group = {
          pro: driver,
          subDrivers: [],
        };
        noPros.push(driver);
      }
    }); // Update state
    setGroupedDriversPros(pros);
    setGroupedDriversNoPro(noPros);
    setGroupedDriversProWithSubDrivers(prosWithSubDrivers);
    setIsLoading(false);
  }, [drivers, isLoading]);
  useEffect(() => {
    // Total commands for pros without sub drivers (flat list of drivers)
    const totalCommandsPros = groupedDriversPros.reduce((acc, driver) => {
      const commandsCount = Array.isArray(driver.driver_commands)
        ? driver.driver_commands.length
        : 0;
      return acc + commandsCount;
    }, 0);

    // Total commands for no pros (flat list)
    const totalCommandsNoPro = groupedDriversNoPro.reduce((acc, driver) => {
      const commandsCount = Array.isArray(driver.driver_commands)
        ? driver.driver_commands.length
        : 0;
      return acc + commandsCount;
    }, 0);

    // Total commands for pros WITH sub drivers (each item has pro + subDrivers[])
    const totalCommandsProWithSubs = groupedDriversProWithSubDrivers.reduce(
      (acc, group) => {
        const proCommands = Array.isArray(group.pro.driver_commands)
          ? group.pro.driver_commands.length
          : 0;
        const subDriversCommands = group.subDrivers.reduce((subAcc, sd) => {
          return (
            subAcc +
            (Array.isArray(sd.driver_commands) ? sd.driver_commands.length : 0)
          );
        }, 0);
        return acc + proCommands + subDriversCommands;
      },
      0
    );

    const total =
      totalCommandsPros + totalCommandsNoPro + totalCommandsProWithSubs;

    setTotalCommands(total);
  }, [
    groupedDriversPros,
    groupedDriversNoPro,
    groupedDriversProWithSubDrivers,
  ]);

  // console.log(groupedDriversPros, "groupedDriversPros======>");
  // console.log(groupedDriversNoPro, "setGroupedDriversNoPro======>");
  // console.log(
  //   groupedDriversProWithSubDrivers,
  //   "groupedDriversProWithSubDrivers======>"
  // );
  // Fetch balance data from Redux store
  const {
    data: balanceData,
    loading,
    error,
  } = useSelector((state) => state.balance);
  const { current, commision } = useSelector((state) => ({
    current: state.user.currentUser,
    commision: state.setting.prices.data?.[0]?.commission,
  }));

  // Fetch balance data when periodeFilter changes
  useEffect(() => {
    dispatch(fetchBalanceData(periodeFilter));
  }, [periodeFilter, dispatch]);

  // Fetch prices and command count
  useEffect(() => {
    dispatch(getPrices());
    dispatch(getCommandCount({ companyId: null }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div style={{ padding: "40px 10px" }}>
        <Skeleton active />
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div style={{ padding: "40px 10px" }}>
  //       <p>Error: {error.message || "Failed to fetch data."}</p>
  //     </div>
  //   );
  // }

  // if (!balanceData) {
  //   return (
  //     <div style={{ padding: "40px 10px" }}>
  //       <p>No data available.</p>
  //     </div>
  //   );
  // }

  // const { companies, totals } = balanceData;

  // You need to compute these from your data or pass them from props
  const salesRevenue = 10000;
  const totalOrders = 250;
  const netProfit = 2700;
  return (
    <div style={{ padding: "40px 10px" }}>
      <Main className="grid-boxed">
        {/* <Row gutter={25}>
          <Col lg={8} xs={24}>
            <Cards headless>
              <OverviewSalesCard>
                <div className="icon-box box-secondary">
                  <img
                    src={
                      require("../../../static/img/icon/New Customer.svg")
                        .default
                    }
                    alt=""
                  />
                </div>
                <div className="card-chunk">
                  <CardBarChart2>
                    <h2>{totalCommands}</h2>
                    <span>Nombre de commande</span>
                  </CardBarChart2>
                </div>
              </OverviewSalesCard>
            </Cards>

            <Cards headless>
              <OverviewSalesCard>
                <div className="icon-box box-primary">
                  <img
                    src={
                      require("../../../static/img/icon/SalesRevenue.svg")
                        .default
                    }
                    alt=""
                  />
                </div>
                <div className="card-chunk">
                  <CardBarChart2>
                    <h2>{`${totals.totalRevenusDesVentes.toFixed(2)} TND`}</h2>
                    <span>Revenus des ventes</span>
                  </CardBarChart2>
                </div>
              </OverviewSalesCard>
            </Cards>

            <Cards headless>
              <OverviewSalesCard>
                <div className="icon-box box-success">
                  <img
                    src={require("../../../static/img/icon/Profit.svg").default}
                    alt=""
                  />
                </div>
                <div className="card-chunk">
                  <CardBarChart2>
                    <h2>
                      {current.user_role === "owner"
                        ? `${(
                            totals.totalRevenusDesVentes -
                            totals.totalBeneficeNet
                          ).toFixed(2)} TND`
                        : `${(
                            totals.totalBeneficeNet *
                            (1 - commision / 100)
                          ).toFixed(2)} TND`}
                    </h2>
                    <span>Bénéfice Net</span>
                  </CardBarChart2>
                </div>
              </OverviewSalesCard>
            </Cards>
          </Col>
          <Col lg={16} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <AverageSalesRevenue data={companies} />
            </Suspense>
          </Col>

          {current?.user_role === "owner" ? (
            <>
              <Col md={taille} lg={taille} xs={24}>
                <Suspense
                  fallback={
                    <Cards headless>
                      <Skeleton active />
                    </Cards>
                  }
                >
                  <TopLandingPages
                    periodeFilter={periodeFilter}
                    setperiodeFilter={setperiodeFilter}
                    taille={taille}
                    settaille={settaille}
                    setsharedData={setsharedData}
                  />
                </Suspense>
              </Col>
              {taille === 12 ? (
                <Col lg={12} xs={24}>
                  <Suspense
                    fallback={
                      <Cards headless>
                        <Skeleton active />
                      </Cards>
                    }
                  >
                    <DailyOverview
                      periodeFilter={periodeFilter}
                      sharedData={sharedData}
                      settaille={settaille}
                      commision={commision}
                    />
                  </Suspense>
                </Col>
              ) : null}
            </>
          ) : null}
        </Row> */}
        <Header balanceLoading={isLoading} totalCommands={totalCommands} />
        {/* <FinanceDashboardOverview
          activeTab={activeTab}
          companies={companies}
          periodeFilter={periodeFilter}
          setperiodeFilter={setperiodeFilter}
          salesRevenue={salesRevenue}
          totalOrders={totalOrders}
          netProfit={netProfit}
          current={current}
          commision={commision}
          taille={taille}
          settaille={settaille}
          sharedData={sharedData}
          setsharedData={setsharedData}
          balanceLoading={isLoading}
        /> */}
      </Main>
    </div>
  );
};

export default Balance;
