import React, { useState } from "react";
import { Badge, Button, Col, Row, Select, Space, Tabs, Tooltip, Typography } from "antd";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import LandingFilter from "./LandingFilter";
import {
    BarChartOutlined,
  DollarOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { StatCard } from "./StatCard";
import { useSelector } from "react-redux";
import TabPane from "antd/lib/tabs/TabPane";

const Header = ({ balanceLoading, totalCommands }) => {
  const { Title, Text } = Typography;
  const { Option } = Select;
  const [periodeFilter, setperiodeFilter] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");

  const { current } = useSelector((state) => ({
    current: state.user.currentUser,
  }));
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Cards
          title={
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                Financial Dashboard
              </Title>
              <Tooltip title={`Last updated: ${new Date().toLocaleString()}`}>
                <InfoCircleOutlined style={{ color: "black" }} />
              </Tooltip>
              <LandingFilter
                landingFilter={periodeFilter}
                onFilterChange={setperiodeFilter}
              />
            </Space>
          }
          size="default"
          
        >
         
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <StatCard
                title="N° de commandes"
                value={totalCommands}
                icon={<ShoppingCartOutlined />}
                color="#1890ff"
                loading={balanceLoading}
                suffix={"Livrée"}
                plainText
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard
                title="Chiffre d'affaires"
                value={100}
                icon={<DollarOutlined />}
                color="#52c41a"
                suffix="TND"
                loading={balanceLoading}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard
                title="Bénéfice net"
                value={100}
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
                  value={100}
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
                    <Badge count={100} />
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
  );
};

export default Header;
