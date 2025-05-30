import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd";
import { PieChartOutlined } from "@ant-design/icons";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ProfitDistributionChart = ({ data, isOwner, commission, companyId }) => {
  // Transform your data into the format needed for the chart
  const transformData = () => {
    if (!data) return [];

    if (isOwner) {
      // For owner: show profit distribution by company
      return data.map((company) => ({
        name: company.companyId?.name,
        value: company.details.beneficeNet,
      }));
    } else {
      // For others: show their profit vs commission
      const company = data.find((c) => c.company_id === companyId);
      if (!company) return [];

      return [
        {
          name: "Your Profit",
          value: company.details.beneficeNet * (1 - commission / 100),
        },
        {
          name: "Commission",
          value: company.details.beneficeNet * (commission / 100),
        },
      ];
    }
  };

  const chartData = transformData();

  return (
    <Card
      title={
        <>
          <PieChartOutlined /> Profit Distribution
        </>
      }
      style={{ height: "100%" }}
    >
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} TND`, "Amount"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <small>
          {isOwner
            ? "Distribution across companies"
            : "Your profit vs platform commission"}
        </small>
      </div>
    </Card>
  );
};

export default ProfitDistributionChart;
