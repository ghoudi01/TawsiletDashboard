import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const RevenueTrendChart = ({ period, companyId }) => {
  // Mock data - replace with your actual data fetching logic
  const generateData = () => {
    const data = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    for (let i = 0; i < months.length; i++) {
      data.push({
        name: months[i],
        revenue: Math.floor(Math.random() * 10000) + 5000,
        profit: Math.floor(Math.random() * 5000) + 2000,
      });
    }
    return data;
  };

  const chartData = generateData();

  return (
    <Card
      title={
        <>
          <DollarOutlined /> Revenue Trend
        </>
      }
      style={{ height: "100%" }}
    >
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                `${value} TND`,
                value === "revenue" ? "Revenue" : "Profit",
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="profit"
              stackId="2"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <small>
          Showing {period} data{" "}
          {companyId ? `for company ${companyId}` : "across all companies"}
        </small>
      </div>
    </Card>
  );
};

export default RevenueTrendChart;
