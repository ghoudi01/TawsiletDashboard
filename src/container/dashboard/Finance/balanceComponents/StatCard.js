import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Space, Typography } from "antd";
import React from "react";
import formatNumberWithCommas from "./utils";
  const { Title, Text } = Typography;
const TrendIndicator = ({ value, direction }) => (
  <Text type={direction === "up" ? "success" : "danger"}>
    {direction === "up" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
    {value}%
  </Text>
);
export const StatCard = ({
  title,
  value,
  icon,
  color = "#1890ff",
  trend,
  loading,
  suffix,
  plainText,
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
          {plainText ? value : formatNumberWithCommas(value)} 
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
