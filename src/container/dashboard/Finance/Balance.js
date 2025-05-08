import React, { lazy, Suspense, useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
  Select,
  Divider,
  Tabs,
  Card,
  Space,
  Typography,
  Button,
  Tooltip,
  Badge,
  Alert,
  theme,
  message,
  Skeleton,
} from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import formatNumberWithCommas from "../../../utility/utility";
import { getCommandCount } from "../../../redux/chartContent/chartSlice";
import { fetchBalanceData } from "../../../redux/balance/balanceSlice";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
// import { useToken } from 'antd/es/theme/internal';

// Lazy-loaded components
const AverageSalesRevenue = lazy(() =>
  import("../overview/sales/AverageSalesRevenue")
);
const RevenueTrendChart = lazy(() => import("./RevenueTrendChart"));
const ProfitDistributionChart = lazy(() => import("./ProfitDistributionChart"));
const CompanyPerformanceChart = lazy(() => import("./CompanyPerformanceChart"));
const TopLandingPages = lazy(() =>
  import("../overview/performance/TopLandingPages")
);
const DailyOverview = lazy(() =>
  import("../overview/performance/DailyOverview")
);
const ExportModal = lazy(() => import("./ExportModal"));

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
// const { useToken } = theme;

// Chart configuration constants
const CHART_CONFIG = {
  colors: ["#1890ff", "#52c41a", "#faad14", "#f5222d"],
  barSize: 24,
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
};

// Helper components
const TrendIndicator = ({ value, direction }) => (
  <Text type={direction === "up" ? "success" : "danger"}>
    {direction === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
    {value}%
  </Text>
);

const StatCard = ({
  title,
  value,
  icon,
  color = "#1890ff",
  trend,
  loading,
  suffix,
}) => (
  <Card
    loading={loading}
    style={{
      borderRadius: 12,
      height: "100%",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
    bodyStyle={{ padding: 16 }}
  >
    <Space direction="vertical" size={8} style={{ width: "100%" }}>
      <Space>
        <div
          style={{
            background: `${color}20`,
            borderRadius: 6,
            padding: 6,
            display: "flex",
            alignItems: "center",
          }}
        >
          {React.cloneElement(icon, {
            style: {
              color,
              fontSize: 20,
            },
          })}
        </div>
        <Text type="secondary">{title}</Text>
      </Space>

      <Space align="baseline">
        <Title level={3} style={{ margin: 0 }}>
          {formatNumberWithCommas(value)}
        </Title>
        {suffix && <Text type="secondary">{suffix}</Text>}
      </Space>

      {trend && (
        <div style={{ marginTop: 4 }}>
          <TrendIndicator {...trend} />
        </div>
      )}
    </Space>
  </Card>
);

const Balance = () => {
  // const { token } = useToken();
  const dispatch = useDispatch();
  const [taille, settaille] = useState(24);
  const [sharedData, setsharedData] = useState();
  const [periodeFilter, setperiodeFilter] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const handlePeriodChange = (value) => {
    // Optimistic UI update
    const previousFilter = periodeFilter;
    setperiodeFilter(value);

    try {
      dispatch(fetchBalanceData(value))
        .unwrap()
        .catch(() => {
          // Revert if fetch fails
          setperiodeFilter(previousFilter);
          message.error("Failed to load data for selected period");
        });

      // Track in analytics
      TrackEvent("PeriodFilterChange", {
        previousPeriod: previousFilter,
        newPeriod: value,
      });
    } catch (error) {
      console.error("Period change error:", error);
    }
  };

  const handleExport = () => {
    if (!balanceData) {
      message.warning("No data available to export");
      return;
    }

    // Prepare comprehensive export payload
    const payload = {
      period: {
        current: periodeFilter,
        startDate: balanceData.period?.startDate,
        endDate: balanceData.period?.endDate,
      },
      summary: {
        totalOrders,
        salesRevenue,
        netProfit,
        commissionRate: commision,
        commissionAmount,
      },
      companies: balanceData.companies.map((c) => ({
        id: c.companyId.id,
        name: c.companyId.name,
        orders: c.details.nbrCredit + c.details.nbrLivraison,
        revenue: c.details.revenusDesVentes,
        profit: c.details.beneficeNet,
      })),
      generatedAt: new Date().toISOString(),
    };

    setExportModalVisible(true);

    // Alternative direct CSV export
    // exportAsCSV(payload);
  };

  // Helper function for direct CSV export
  const exportAsCSV = (data) => {
    const headers = ["Company,Orders,Revenue,Profit,Commission"];

    const rows = data.companies.map(
      (c) =>
        `"${c.name}",${c.orders},${c.revenue},${c.profit},${data.summary.commissionRate}%`
    );

    const csvContent = [
      ...headers,
      ...rows,
      `TOTAL,${data.summary.totalOrders},${data.summary.salesRevenue},${data.summary.netProfit},${data.summary.commissionAmount}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial_report_${data.period.current}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
  };

  // Redux state
  const {
    data: balanceData,
    loading: balanceLoading,
    error: balanceError,
  } = useSelector((state) => state.balance);
  const { current, commision } = useSelector((state) => ({
    current: state.user.currentUser,
    commision: state.setting.prices.data?.[0]?.commission || 20, // Default to 20% if not set
  }));

  // Memoized calculations
  const { totalOrders, netProfit, salesRevenue, commissionAmount } =
    useMemo(() => {
      if (!balanceData) return {};

      const totals = balanceData.totals || {};
      const companies = balanceData.companies || [];

      const orders = companies.reduce(
        (sum, company) =>
          sum + company.details.nbrCredit + company.details.nbrLivraison,
        0
      );

      const profit =
        current?.user_role === "owner"
          ? totals.totalRevenusDesVentes - totals.totalBeneficeNet
          : totals.totalBeneficeNet * (1 - commision / 100);

      return {
        totalOrders: orders,
        netProfit: profit,
        salesRevenue: totals.totalRevenusDesVentes,
        commissionAmount: totals.totalBeneficeNet * (commision / 100),
      };
    }, [balanceData, current, commision]);

  // Data fetching
  useEffect(() => {
    dispatch(fetchBalanceData(periodeFilter));
  }, [periodeFilter, dispatch]);

  if (!balanceData) {
    return (
      <Cards title="No Data Available" style={{ margin: 24 }}>
        <Text>No balance data could be loaded for the selected period.</Text>
      </Cards>
    );
  }

  const { companies } = balanceData;

  return (
    <div style={{ padding: 24 }}>
      <Main className="grid-boxed">
        {/* Header Section */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Cards
              title={
                <Space>
                  <Title level={4} style={{ margin: 0 }}>
                    Financial Dashboard
                  </Title>
                  <Tooltip
                    title={`Last updated: ${new Date().toLocaleString()}`}
                  >
                    <InfoCircleOutlined style={{ color: "black" }} />
                  </Tooltip>
                </Space>
              }
              size="default"
              extra={
                <Space>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    type="text"
                  >
                    Export Report
                  </Button>
                  <Select
                    value={periodeFilter}
                    style={{ width: 180 }}
                    onChange={handlePeriodChange}
                    loading={balanceLoading}
                    bordered={false}
                  >
                    <Option value="all">All Time</Option>
                    <Option value="year">This Year</Option>
                    <Option value="month">This Month</Option>
                    <Option value="week">This Week</Option>
                    <Option value="day">Today</Option>
                  </Select>
                </Space>
              }
            >
              {/* Key Metrics */}
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} md={6}>
                  <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={<ShoppingCartOutlined />}
                    color="#1890ff"
                    loading={balanceLoading}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StatCard
                    title="Sales Revenue"
                    value={salesRevenue?.toFixed(2)}
                    icon={<DollarOutlined />}
                    color="#52c41a"
                    suffix="TND"
                    loading={balanceLoading}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <StatCard
                    title="Net Profit"
                    value={netProfit?.toFixed(2)}
                    icon={<DollarOutlined />}
                    color="#faad14"
                    suffix="TND"
                    loading={balanceLoading}
                  />
                </Col>
                {current?.user_role === "owner" && (
                  <Col xs={24} sm={12} md={6}>
                    <StatCard
                      title="Commission"
                      value={commissionAmount?.toFixed(2)}
                      icon={<DollarOutlined />}
                      color="#f5222d"
                      suffix="TND"
                      loading={balanceLoading}
                    />
                  </Col>
                )}
              </Row>

              {/* Tabs Navigation */}
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ marginTop: 24 }}
                tabBarExtraContent={
                  <Text type="secondary">
                    Showing:{" "}
                    {periodeFilter === "all"
                      ? "All Time"
                      : periodeFilter === "year"
                      ? "This Year"
                      : periodeFilter === "month"
                      ? "This Month"
                      : periodeFilter === "week"
                      ? "This Week"
                      : "Today"}
                  </Text>
                }
              >
                <TabPane
                  tab={
                    <Space>
                      <PieChartOutlined />
                      Overview
                    </Space>
                  }
                  key="overview"
                />
                <TabPane
                  tab={
                    <Space>
                      <LineChartOutlined />
                      Trends
                    </Space>
                  }
                  key="trends"
                />
                <TabPane
                  tab={
                    <Space>
                      <BarChartOutlined />
                      Details
                      {current?.user_role === "owner" && (
                        <Badge count={companies?.length} />
                      )}
                    </Space>
                  }
                  key="details"
                  disabled={current?.user_role !== "owner"}
                />
              </Tabs>
            </Cards>
          </Col>
        </Row>

        {/* Tab Content */}
        <ErrorBoundary>
          <Suspense
            fallback={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          >
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
                    <Space
                      direction="vertical"
                      size={24}
                      style={{ width: "100%" }}
                    >
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

            {activeTab === "trends" && (
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
                        current?.user_role === "owner"
                          ? null
                          : current?.company_id
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
                        // Add this prop
                        setsharedData(company); // Store selected company
                        settaille(12); // Trigger detail view
                      }}
                    />
                  </Cards>
                </Col>
                {taille === 12 &&
                  sharedData && ( // Only show if taille=12 AND data exists
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
                          onBack={() => settaille(24)} // Add back handler
                        />
                      </Suspense>
                    </Col>
                  )}
              </Row>
            )}
          </Suspense>
        </ErrorBoundary>

        {/* Export Modal */}
        <Suspense fallback={null}>
          <ExportModal
            visible={exportModalVisible}
            onCancel={() => setExportModalVisible(false)}
            data={balanceData}
            period={periodeFilter}
          />
        </Suspense>
      </Main>
    </div>
  );
};

export default Balance;
