import React, { useEffect, useState } from "react";
import { Row, Col, InputNumber, Button, notification } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import Counter from "../Counter";
import styled from "styled-components";
import DollarSign from "../../../static/img/DollarSign.svg";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCommands } from "../../../redux/User/userSlice";
import { Bar } from "react-chartjs-2";
import "./Style.css";

// Registering the necessary Chart.js components
const Driver = () => {
  const { currentUser } = useSelector(
    (state) => state.user
  );
  const [money, setMoney] = useState(0);
  const [allCommands, setAllCommands] = useState([]);
useEffect(() => {
  if (currentUser) {
    let combinedCommands = [];

    // Include main user's commands if available
    if (currentUser.driver_commands?.length > 0) {
      combinedCommands = [...currentUser.driver_commands];
    }

    // Include sub_drivers' commands
    if (currentUser.sub_drivers?.length > 0) {
      currentUser.sub_drivers.forEach((subDriver) => {
        if (subDriver.driver_commands?.length > 0) {
          combinedCommands = [
            ...combinedCommands,
            ...subDriver.driver_commands,
          ];
        }
      });
    }

    setAllCommands(combinedCommands);
  }
}, [currentUser]);

  useEffect(() => {
    const completedTotal = allCommands
      ?.filter((command) => command.commandStatus === "Completed")
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    setMoney(completedTotal);
  }, [allCommands]);
  const chartData = {
    labels: ["Completed", "Pending", "Canceled by Client", "Other"], // Categories
    datasets: [
      {
        label: `Total Money (DT)`,
        data: [
          allCommands
            ?.filter((command) => command.commandStatus === "Completed")
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0, // Completed money
          allCommands
            ?.filter((command) => command.commandStatus === "Pending")
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0, // Pending money
          allCommands
            ?.filter(
              (command) => command.commandStatus === "Canceled_by_client"
            )
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0, // Canceled by client money
          allCommands
            ?.filter(
              (command) =>
                command.commandStatus !== "Completed" &&
                command.commandStatus !== "Pending" &&
                command.commandStatus !== "Canceled_by_client"
            )
            .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0) || 0, // Money from other statuses
        ],
        backgroundColor: [
          "#53B483", // Green for Completed
          "#F3935D", // Orange for Pending
          "#F44336", // Red for Canceled by Client
          "#36A2EB", // Blue for Other statuses
        ],
        borderColor: [
          "#36A2EB", // Border color for Completed (same as the bar's color)
          "#FFCE56", // Border color for Pending
          "#FF6384", // Border color for Canceled by Client
          "#FF9800", // Border color for Other statuses
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <>
      <PageHeader
        title="Balance"
        buttons={[<div key="1" className="page-header-actions"></div>]}
      />

      <Main>
        <div>
          <ChartHeaderItem>
            <img src={DollarSign} alt="Money" />
            <div>
              <CounterContainer>{money.toFixed(2)} DT</CounterContainer>
            </div>
          </ChartHeaderItem>
        </div>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              <div style={{ height: "60%" }}>
                <Col sm={24} xs={24}>
                  {/* Pie Chart */}
                  <section style={{ height: "60%" }}>
                    <Bar data={chartData} options={chartOptions} height={200} />
                  </section>
                </Col>
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default Driver;
const ChartHeaderItem = styled.div`
  width: auto;
  height: 100px;
  /* background-color: brown; */
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  line-height: 16px;
`;
const CounterContainer = styled.div`
  font: 800 24px system-ui;
  color: green;
`;
