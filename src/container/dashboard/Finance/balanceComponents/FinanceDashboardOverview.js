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
            <Col lg={16} xs={24}>
              <Cards title="Revenue Overview">
                <AverageSalesRevenue
                  data={companies}
                  period={periodeFilter}
                  colors={CHART_CONFIG.colors}
                  loading={balanceLoading}
                />
              </Cards>
            </Col>
            <Col lg={8} xs={24}>
              <Cards title="Performance Summary">
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  <StatCard
                    title="Order Completion Rate"
                    value="92.5"
                    icon={<ShoppingCartOutlined />}
                    color="#1890ff"
                    suffix="%"
                  />
                  <StatCard
                    title="Avg. Order Value"
                    value={(salesRevenue / totalOrders).toFixed(2)}
                    icon={<DollarOutlined />}
                    color="#52c41a"
                    suffix="TND"
                  />
                  <StatCard
                    title="Profit Margin"
                    value={((netProfit / salesRevenue) * 100).toFixed(1)}
                    icon={<DollarOutlined />}
                    color="#faad14"
                    suffix="%"
                  />
                </Space>
              </Cards>
            </Col>
          </Row>
        )}

        {/* {activeTab === "trends" && (
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col lg={12} xs={24}>
              <Cards title="Profit Distribution">
                <ProfitDistributionChart
                  data={companies}
                  isOwner={current?.user_role === "owner"}
                  commission={commision}
                  colors={CHART_CONFIG.colors}
                />
              </Cards>
            </Col>
            <Col lg={12} xs={24}>
              <Cards title="Company Performance">
                <CompanyPerformanceChart
                  data={companies}
                  isOwner={current?.user_role === "owner"}
                  colors={CHART_CONFIG.colors}
                />
              </Cards>
            </Col>
            <Col span={24}>
              <Cards title="Revenue Trends">
                <RevenueTrendChart
                  period={periodeFilter}
                  companyId={
                    current?.user_role === "owner" ? null : current?.company_id
                  }
                  colors={CHART_CONFIG.colors}
                />
              </Cards>
            </Col>
          </Row>
        )}

        {activeTab === "details" && current?.user_role === "owner" && (
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col md={taille} lg={taille} xs={24}>
              <Cards title="Company Breakdown">
                <TopLandingPages
                  periodeFilter={periodeFilter}
                  setperiodeFilter={setperiodeFilter}
                  taille={taille}
                  settaille={settaille}
                  setsharedData={setsharedData}
                  onCompanySelect={(company) => {
                    setsharedData(company);
                    settaille(12);
                  }}
                />
              </Cards>
            </Col>
            {taille === 12 && sharedData && (
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
                    onBack={() => settaille(24)}
                  />
                </Suspense>
              </Col>
            )}
          </Row>
        )} */}
      </Suspense>
    </ErrorBoundary>
  );
};

export default FinanceDashboardOverview;
