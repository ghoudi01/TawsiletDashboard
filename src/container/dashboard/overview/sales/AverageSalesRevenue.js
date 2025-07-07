import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PerformanceChartWrapper, Pstates } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { ChartjsAreaChart } from "../../../../components/charts/chartjs";
import {
  chartLinearGradient,
  customTooltips,
} from "../../../../components/utilities/utilities";
import axios from "axios";

function AverageSalesRevenue() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("year");

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKUP_URL}dashboard?period=${period}`);
      setData(response.data.data.revenue_overview);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActiveChangePerformance = (value) => {
    setPeriod(value);
  };

  // Transform data for the chart
  const labels = data?.revenue_chart_data?.map((item) => item.label) || [];
  const datasets = data
    ? [
        {
          label: "Revenus des ventes",
          data: data.revenue_chart_data.map((item) => item.revenue),
          borderColor: "#5F63F2",
          borderWidth: 4,
          fill: true,
          backgroundColor: () =>
            chartLinearGradient(document.getElementById("performance"), 300, {
              start: "#5F63F230",
              end: "#ffffff05",
            }),
          pointStyle: "circle",
          pointRadius: "0",
          hoverRadius: "9",
          pointBorderColor: "#fff",
          pointBackgroundColor: "#5F63F2",
          hoverBorderWidth: 5,
        },
        {
          label: "Bénéfice Net",
          data: data.revenue_chart_data.map((item) => item.profit_margin),
          borderColor: "#ff173780",
          borderWidth: 4,
          fill: false,
          backgroundColor: "#ff173780",
          pointRadius: "0",
          hoverRadius: "0",
        },
      ]
    : [];

  return (
    <PerformanceChartWrapper>
      {loading ? (
        <div className="sd-spin">
          <Spin />
        </div>
      ) : !data ? (
        <p>No data available.</p>
      ) : (
        <Cards
          isbutton={
            <div className="card-nav">
              <ul>
                <li className={period === "week" ? "active" : "deactivate"}>
                  <Link onClick={() => handleActiveChangePerformance("week")} to="#">
                    Semaines
                  </Link>
                </li>
                <li className={period === "month" ? "active" : "deactivate"}>
                  <Link onClick={() => handleActiveChangePerformance("month")} to="#">
                    Mois
                  </Link>
                </li>
                <li className={period === "year" ? "active" : "deactivate"}>
                  <Link onClick={() => handleActiveChangePerformance("year")} to="#">
                    Années
                  </Link>
                </li>
              </ul>
            </div>
          }
          title="Chiffre d'affaires moyen"
          size="large"
        >
          <Pstates>
            <div className="growth-upward active">
              <p>
                Revenus de{" "}
                {period === "year"
                  ? "cette année"
                  : period === "week"
                  ? "cette semaine"
                  : "ce mois"}
              </p>
              <Heading as="h1">
                {`${data.current_week_revenue.toFixed(2)} TND`}
              </Heading>
            </div>
            <div className="growth-upward active">
              <p>
                Revenus de{" "}
                {period === "year"
                  ? "de l'année derniére"
                  : period === "week"
                  ? "de la semaine derniére"
                  : "du mois dernier"}
              </p>
              <Heading as="h1">
                {`${data.last_week_profit.toFixed(2)} TND`}
              </Heading>
            </div>
          </Pstates>
          <div className="performance-lineChart">
            <ChartjsAreaChart
              id="performance"
              labels={labels}
              datasets={datasets}
              options={{
                maintainAspectRatio: true,
                elements: {
                  z: 9999,
                },
                legend: {
                  display: false,
                },
                hover: {
                  mode: "index",
                  intersect: false,
                },
                tooltips: {
                  mode: "label",
                  intersect: false,
                  backgroundColor: "#ffffff",
                  position: "average",
                  enabled: false,
                  custom: customTooltips,
                  callbacks: {
                    title() {
                      return "Revenue and Profit";
                    },
                    label(t, d) {
                      const { yLabel, datasetIndex } = t;
                      return `<span class="chart-data">${yLabel} TND</span> <span class="data-label">${
                        d.datasets[datasetIndex].label
                      }</span>`;
                    },
                  },
                },
                scales: {
                  yAxes: [
                    {
                      gridLines: {
                        color: "#e5e9f2",
                        borderDash: [3, 3],
                        zeroLineColor: "#e5e9f2",
                        zeroLineWidth: 1,
                        zeroLineBorderDash: [3, 3],
                      },
                      ticks: {
                        beginAtZero: true,
                        fontSize: 13,
                        fontColor: "#182b49",
                        callback(label) {
                          return `${label} TND`;
                        },
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: {
                        display: true,
                        zeroLineWidth: 2,
                        zeroLineColor: "transparent",
                        color: "transparent",
                        z: 1,
                        tickMarkLength: 0,
                      },
                      ticks: {
                        padding: 10,
                      },
                    },
                  ],
                },
              }}
              height={window.innerWidth <= 575 ? 200 : 100}
            />
            <ul>
              {datasets.map((item, index) => (
                <li key={index} className="custom-label">
                  <span
                    style={{
                      backgroundColor: item.borderColor,
                    }}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </Cards>
      )}
    </PerformanceChartWrapper>
  );
}

export default AverageSalesRevenue;