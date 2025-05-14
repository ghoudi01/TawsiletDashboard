import React, { useState } from "react";
import { Row, Col, InputNumber, Button, notification } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import axios from "axios";
import { useEffect } from "react";
function Param() {
  const [params, setParams] = useState({
    WAITING_TIME_CHARGE: 0.3,
    WAITING_TIME_GRACE_PERIOD: 1,
    START_CHARGE_AFTERT_TIME: 1,
  });

  const handleChange = (key, value) => {
    setParams({ ...params, [key]: value });
  };
  useEffect(() => {
    const getParameters = async () => {
      const jwt = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
          console.log(response.data,"====")
        // ✅ Set fetched data into state
        if (response.data?.data) {
          setParams((prev) => ({
            ...prev,
            ...response.data.data,
          }));
        }

        console.log("✅ Parameters fetched:", response.data);
      } catch (error) {
        console.error("❌ Failed to fetch parameters:", error);
      }
    };

    getParameters();
  }, []);

  const updateParameters = async (inputData) => {
    const jwt = localStorage.getItem("token");
    console.log(
      `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`
    );
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`,
        {
          data: {
            WAITING_TIME_CHARGE: inputData.WAITING_TIME_CHARGE,
            WAITING_TIME_GRACE_PERIOD: inputData.WAITING_TIME_GRACE_PERIOD,
            START_CHARGE_AFTERT_TIME: inputData.START_CHARGE_AFTERT_TIME,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("✅ Parameters updated:", response.data);
      notification.success({
        message: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès.",
      });
      return response.data;
    } catch (error) {
         notification.error({
           message: "Échec de la mise à jour",
           description:
             error?.response?.data?.error?.message ||
             "Impossible de mettre à jour les paramètres.",
         });
      console.error("❌ Failed to update parameters:", error);
      throw error;
    }
  };
  const handleSubmit = () => {
    updateParameters(params);
  };
  return (
    <>
      <PageHeader
        title="Param"
        buttons={[<div key="1" className="page-header-actions"></div>]}
      />
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              <div>
                <h1 style={{ fontSize: "1.1rem" }}>
                  Mode de maintenance website
                </h1>

                <h3 style={{ fontSize: "0.875rem", lineHeight: "1.5rem" }}>
                  Vous avez la possibilité de mettre l'ensemble du site en mode
                  maintenance .
                </h3>

                <Col sm={24} xs={24}>
                  <h1 style={{ fontSize: "1rem", paddingTop: "1rem" }}>Mode</h1>
                </Col>
                <Col sm={24} xs={24}>
                  <h3 style={{ marginTop: "1rem" }}>WAITING_TIME_CHARGE</h3>
                  <InputNumber
                    min={0}
                    step={0.1}
                    value={params.WAITING_TIME_CHARGE}
                    onChange={(val) => handleChange("WAITING_TIME_CHARGE", val)}
                  />

                  <h3 style={{ marginTop: "1rem" }}>
                    WAITING_TIME_GRACE_PERIOD
                  </h3>
                  <InputNumber
                    min={0}
                    value={params.WAITING_TIME_GRACE_PERIOD}
                    onChange={(val) =>
                      handleChange("WAITING_TIME_GRACE_PERIOD", val)
                    }
                  />

                  <h3 style={{ marginTop: "1rem" }}>
                    START_CHARGE_AFTERT_TIME
                  </h3>
                  <InputNumber
                    min={0}
                    value={params.START_CHARGE_AFTERT_TIME}
                    onChange={(val) =>
                      handleChange("START_CHARGE_AFTERT_TIME", val)
                    }
                  />

                  <Button
                    type="primary"
                    style={{ marginTop: "1.5rem" }}
                    onClick={handleSubmit}
                  >
                    Mettre à jour
                  </Button>
                </Col>
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default Param;
