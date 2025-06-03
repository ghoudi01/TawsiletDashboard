import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import {  Link } from "react-router-dom";
 import { useDispatch, useSelector } from "react-redux";
import { PerformanceChartWrapper, Pstates } from "../../style";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import Heading from "../../../../components/heading/heading";
import { ChartjsAreaChart } from "../../../../components/charts/chartjs";
import {
  chartLinearGradient,
  customTooltips,
} from "../../../../components/utilities/utilities";
import {
  performanceFilterData,
  performanceGetData,
  setIsLoading,
} from "../../../../redux/chartContent/actionCreator";
import { getBalance } from "../../../../redux/chartContent/chartSlice";

 

function  AverageSalesRevenue() {
  const dispatch = useDispatch();
  const { performanceState, preIsLoading, current } = useSelector((state) => {
    return {
      performanceState: state.balance.data,
      preIsLoading: state.balance.loading,
      current: state.user.currentUser,
    };
  });

  const [state, setState] = useState({
    performance: "year",
    performanceTab: "users",
  });

  const { performance, performanceTab } = state;

 

  const [titleValue, settitleValue] = useState("year");

  const handleActiveChangePerformance = (value) => {
    setState({
      ...state,
      performance: value,
    });
    settitleValue(value);
    dispatch(
      performanceFilterData({
        value: value,
        id: ["owner", "admin"].includes(current?.user_role)
          ? null
          : ["agent"].includes(current?.user_role)
          ? current?.company_id?.id
          : current?.id,
      })
    );
  };

  const onPerformanceTab = (value) => {
    setState({
      ...state,
      performanceTab: value,
    });
    return dispatch(setIsLoading());
  };

  // Transform data for the chart
  const labels = performanceState?.companies?.map((company) => company.companyId.name) || [];
  const datasets = performanceState
    ? [
        {
          label: "Revenus des ventes",
          data: performanceState.companies.map((company) => company.details.revenusDesVentes),
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
          data: performanceState.companies.map((company) => company.details.beneficeNet),
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
      {preIsLoading ? (
        <div className="sd-spin">
          <Spin />
        </div>
      ) : !performanceState ? (
        <p>No data available.</p>
      ) : (
        <Cards
          isbutton={
            <div className="card-nav">
              <ul>
                <li
                  className={performance === "week" ? "active" : "deactivate"}
                >
                  <Link
                    onClick={() => handleActiveChangePerformance("week")}
                    to="#"
                  >
                    Semaines
                  </Link>
                </li>
                <li
                  className={performance === "month" ? "active" : "deactivate"}
                >
                  <Link
                    onClick={() => handleActiveChangePerformance("month")}
                    to="#"
                  >
                    Mois
                  </Link>
                </li>
                <li
                  className={performance === "year" ? "active" : "deactivate"}
                >
                  <Link
                    onClick={() => handleActiveChangePerformance("year")}
                    to="#"
                  >
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
            <div
              onClick={() => onPerformanceTab("users")}
              className={`growth-upward ${
                performanceTab === "users" && "active"
              }`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>
                Revenus de{" "}
                {titleValue === "year"
                  ? "cette année"
                  : titleValue === "week"
                  ? "cette semaine"
                  : "ce mois"}
              </p>
              <Heading as="h1">
                {`${performanceState.totals.totalRevenusDesVentes.toFixed(2)} TND`}
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab("sessions")}
              className={`growth-upward ${
                performanceTab === "sessions" && "active"
              }`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>
              Revenus de{" "}
                {titleValue === "year"
                  ? "de l'année derniére"
                  : titleValue === "week"
                  ? "de la semaine derniére"
                  : "du mois dernier"}
              </p>
              <Heading as="h1">
                {`${performanceState.totals.totalBeneficeNet.toFixed(2)} TND`}
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