import React, { lazy, Suspense, useEffect, useState } from "react";
import { Row, Col, Skeleton } from "antd";
import { CardBarChart2, OverviewSalesCard } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import TopLandingPages from "../overview/performance/TopLandingPages";
import DailyOverview from "../overview/performance/DailyOverview";
import { useSelector, useDispatch } from "react-redux";
 import { fetchBalanceData } from "../../../redux/balance/balanceSlice";
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
 
   const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

 

 
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
 

  if (isLoading) {
    return (
      <div style={{ padding: "40px 10px" }}>
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 10px" }}>
        <p>Error: {error.message || "Failed to fetch data."}</p>
      </div>
    );
  }

  if (!balanceData) {
    return (
      <div style={{ padding: "40px 10px" }}>
        <p>No data available.</p>
      </div>
    );
  }

   const { totals  } = balanceData.data;
  
  return (
    <div style={{ padding: "40px 10px" }}>
      <Main className="grid-boxed">
        <Row gutter={25}>
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
                    <h2>{333}</h2>
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
                    <h2>{`${totals.totalRevenue.toFixed(2)} TND`}</h2>  
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
                            totals.totalRevenue -
                            totals.totalNetProfit
                          ).toFixed(2)} TND`
                        : `${(
                            totals.totalNetProfit *
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
            {/* <AverageSalesRevenue data={balanceData?.data?.driverSummaries} />  */}
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
        </Row>  
        <Header balanceLoading={isLoading} totalCommands={3333} />
      <FinanceDashboardOverview
          activeTab={activeTab}
          companies={balanceData?.data?.driverSummaries}
          periodeFilter={periodeFilter}
          setperiodeFilter={setperiodeFilter}
          salesRevenue={33}
          totalOrders={33}
          netProfit={33}
          current={current}
          commision={commision}
          taille={taille}
          settaille={settaille}
          sharedData={sharedData}
          setsharedData={setsharedData}
          balanceLoading={isLoading}
        />     
      </Main>
    </div>
  );
};

export default Balance;
