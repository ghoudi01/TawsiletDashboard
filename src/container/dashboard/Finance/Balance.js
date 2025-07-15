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

 
const Balance = () => {
  const dispatch = useDispatch();
  const [taille, settaille] = useState(24);
  const [sharedData, setsharedData] = useState(null);
  const [periodeFilter, setperiodeFilter] = useState("all");
 

   const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

 

 
  const {
    data: balanceData,
 
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

    return (
    <div style={{ padding: "40px 10px" }}>
      <Main className="grid-boxed">
      <Header balanceLoading={isLoading} totalCommands={3333} /> 

        <Row gutter={25}>
       


  

         {current?.user_role === "owner" ? (
            <>
              <Col md={sharedData!=null?12:24} lg={sharedData!=null?12:24} xs={24}>
                <Suspense 
                  fallback={
                    <Cards headless>
                      <Skeleton active />
                    </Cards>
                  }
                >
                  <TopLandingPages
                   sharedData={sharedData}
      
                    setsharedData={setsharedData}
                  />
                </Suspense>
              </Col>
              {sharedData!=null  ? (
                <Col lg={12} xs={24}>
                  
                    <DailyOverview
                      periodeFilter={periodeFilter}
                      sharedData={sharedData}
                      settaille={settaille}
                      commision={commision}
                      setsharedData={setsharedData}
                    />
                  
                </Col>
              ) : null}
            </>
          ) : null}  
        </Row>  
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
