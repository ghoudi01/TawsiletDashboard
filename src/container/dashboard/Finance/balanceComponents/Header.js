import React, { useState, useEffect } from "react";
import { Col, Row, Space, Tooltip, Typography } from "antd";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import LandingFilter from "./LandingFilter";
import {
  DollarOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { StatCard } from "./StatCard";
import { useSelector } from "react-redux";
import axios from "axios";

const Header = () => {
  const { Title } = Typography;
  const [periodeFilter, setperiodeFilter] = useState("month");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { current } = useSelector((state) => ({
    current: state.user.currentUser,
  }));

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
       
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}dashboard/statistics?period=${String(periodeFilter).toLocaleLowerCase()}`
        );
   
        setStatistics(response.data.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [periodeFilter]);

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
                value={statistics?.orders || 0}
                icon={<ShoppingCartOutlined />}
                color="#1890ff"
                loading={loading}
                suffix={"Coures"}
                plainText
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard
                title="Chiffre d'affaires"
                value={statistics?.revenue?.total || 0}
                icon={<DollarOutlined />}
                color="#52c41a"
                suffix="TND"
                loading={loading}
                extraData={[
                  {title: "cash", value: statistics?.revenue?.cash || 0},
                  {title: "CB", value: statistics?.revenue?.online || 0}
                ]}
              />
            </Col>
            
            {current?.user_role === "owner" && (
              <Col xs={24} sm={12} md={6}>
                <StatCard
                  title="Commission"
                  value={statistics?.commission || 0}
                  icon={<DollarOutlined />}
                  color="#f5222d"
                  suffix="TND"
                  loading={loading}
                />
              </Col>
            )}
          </Row>
        </Cards>
      </Col>
    </Row>
  );
};

export default Header;
