import React, { Suspense } from "react";
import { Row, Col, Space, Skeleton } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import AverageSalesRevenue from "../../overview/sales/AverageSalesRevenue";
import TopLandingPages from "../../overview/performance/TopLandingPages";
import DailyOverview from "../../overview/performance/DailyOverview";
import ProfitDistributionChart from "./charts/ProfitDistributionChart";
import CompanyPerformanceChart from "./charts/CompanyPerformanceChart";
import RevenueTrendChart from "./charts/RevenueTrendChart";
import { StatCard } from "./StatCard";


const FinanceDashboardOverview = ({
  activeTab,
  companies,
  periodeFilter,
  setperiodeFilter,
  salesRevenue,
  totalOrders,
  netProfit,
  current,
  commision,
  taille,
  settaille,
  sharedData,
  setsharedData,
  balanceLoading,
}) => {
    const CHART_CONFIG = {
      colors: ["#1890ff", "#52c41a", "#faad14", "#f5222d"],
      barSize: 24,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
        {activeTab === "overview" && (
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col lg={24} xs={24}>
              <Cards title="Revenue Overview">
                <AverageSalesRevenue
                  data={companies}
                  period={periodeFilter}
                  colors={CHART_CONFIG.colors}
                  loading={balanceLoading}
                />
              </Cards>
            </Col>
            
          </Row>
        )}
 
      </Suspense>
    </ErrorBoundary>
  );
};

export default FinanceDashboardOverview;
