import React, { useState } from "react";
import { Row, Col, InputNumber, Button, notification, Card, Typography, Space, Switch } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import axios from "axios";
import { useEffect } from "react";

const { Title, Text } = Typography;

function Param() {
  const [params, setParams] = useState({
    WAITING_TIME_CHARGE: 0.3,
    WAITING_TIME_GRACE_PERIOD: 1,
    START_CHARGE_AFTERT_TIME: 1,
    min_radius_search: 1,
    isReservationActive: false,
    isDangerActive: false,
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
        
        // ✅ Set fetched data into state
        if (response.data?.data) {
          setParams((prev) => ({
            ...prev,
            ...response.data.data,
          }));
        }

      
      } catch (error) {
        console.error("❌ Failed to fetch parameters:", error);
      }
    };

    getParameters();
  }, []);

  const updateParameters = async (inputData) => {
    const jwt = localStorage.getItem("token");
   
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`,
        {
          data: {
            WAITING_TIME_CHARGE: inputData.WAITING_TIME_CHARGE,
            WAITING_TIME_GRACE_PERIOD: inputData.WAITING_TIME_GRACE_PERIOD,
            START_CHARGE_AFTERT_TIME: inputData.START_CHARGE_AFTERT_TIME,
            min_radius_search: inputData.min_radius_search,
            isReservationActive: inputData.isReservationActive,
            isDangerActive: inputData.isDangerActive,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
    
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
        title="Paramètres"
        buttons={[<div key="1" className="page-header-actions"></div>]}
      />
      <Main>
        <Row gutter={[25, 25]}>
          <Col xs={24}>
            <Cards headless>
              <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  

                  <div>
                    <Title level={5}>Configuration des paramètres</Title>
                    
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text strong>Prix de Temps d'attente </Text>
                        <InputNumber
                          min={0}
                          step={0.1}
                          value={params.WAITING_TIME_CHARGE}
                          onChange={(val) => handleChange("WAITING_TIME_CHARGE", val)}
                          style={{ width: '100%', marginTop: 8 }}
                          size="large"
                        />
                      </div>

                      <div>
                        <Text strong>temps calcule</Text>
                        <InputNumber
                          min={0}
                          value={params.WAITING_TIME_GRACE_PERIOD}
                          onChange={(val) => handleChange("WAITING_TIME_GRACE_PERIOD", val)}
                          style={{ width: '100%', marginTop: 8 }}
                          size="large"
                        />
                      </div>

                      <div>
                        <Text strong>Temps d'attente Gratuit</Text>
                        <InputNumber
                          min={0}
                          value={params.START_CHARGE_AFTERT_TIME}
                          onChange={(val) => handleChange("START_CHARGE_AFTERT_TIME", val)}
                          style={{ width: '100%', marginTop: 8 }}
                          size="large"
                        />
                      </div>

                      <div>
                        <Text strong>Rayon de recherche minimum (km)</Text>
                        <InputNumber
                          min={0}
                          step={0.1}
                          value={params.min_radius_search}
                          onChange={(val) => handleChange("min_radius_search", val)}
                          style={{ width: '100%', marginTop: 8 }}
                          size="large"
                        />
                      </div>

                      <div>
                        <Text strong>Réservation active</Text>
                        <Switch
                          checked={params.isReservationActive}
                          onChange={(checked) => handleChange("isReservationActive", checked)}
                          style={{ marginTop: 8 }}
                          size="large"
                        />
                      </div>

                      <div>
                        <Text strong>Mode danger actif</Text>
                        <Switch
                          checked={params.isDangerActive}
                          onChange={(checked) => handleChange("isDangerActive", checked)}
                          style={{ marginTop: 8 }}
                          size="large"
                        />
                      </div>
                    </Space>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    style={{ width: '100%' }}
                  >
                    Mettre à jour les paramètres
                  </Button>
                </Space>
              </Card>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default Param;
