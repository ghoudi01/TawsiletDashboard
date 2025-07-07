import React, { useState } from "react";
import { Row, Col, Select, Modal, notification, DatePicker, Button } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import SelectGm from "../../../selectGm/SelectGm";
import { useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";

function Maintenance() {
  const dispatch = useDispatch();
  const selectOptions = [
    { value: "Activer", label: "Activer" },
    { value: "Maintenance", label: "Maintenance" },
  ];

  const [activeDate, setActiveDate] = useState(null);
  const [loadingActiveDate, setLoadingActiveDate] = useState(false);

  const handleActive = () => {
    Modal.confirm({
      title: "Confirm Change",
      content: `Confirmez la désactivation de site?`,
      okText: "Désactiver",
      okType: "danger",
      cancelText: "Annuler",
      async onOk() {
        const jwt = localStorage.getItem("token");
        try {
          await axios.put(
            `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`,
            {
              data: {
                maintenance: true,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          notification.success({
            message: "Mode maintenance activé",
            description: "Le site est maintenant en mode maintenance.",
          });
        } catch (error) {
          notification.error({
            message: "Erreur lors de l'activation du mode maintenance",
            description:
              error?.response?.data?.error?.message ||
              "Impossible d'activer le mode maintenance.",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleDeactive = () => {
    Modal.confirm({
      title: "Confirm Change",
      content: `Confirmez l'activation de site?`,
      okText: "Activer",
      okType: "danger",
      cancelText: "Annuler",
      async onOk() {
        const jwt = localStorage.getItem("token");
        try {
          await axios.put(
            `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`,
            {
              data: {
                maintenance: false,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
          notification.success({
            message: "Mode maintenance désactivé",
            description: "Le site est maintenant actif.",
          });
        } catch (error) {
          notification.error({
            message: "Erreur lors de la désactivation du mode maintenance",
            description:
              error?.response?.data?.error?.message ||
              "Impossible de désactiver le mode maintenance.",
          });
        }
      },
      onCancel() {},
    });
  };

  const handleActiveDateUpdate = async () => {
    if (!activeDate) {
      notification.warning({
        message: "Veuillez sélectionner une date d'activation",
      });
      return;
    }
    setLoadingActiveDate(true);
    const jwt = localStorage.getItem("token");
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}parameters/uhevts0oaweghxiwdvc58pei`,
        {
          data: {
            active_date: activeDate.toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      notification.success({
        message: "Date d'activation mise à jour",
        description: "La date d'activation de l'application mobile a été mise à jour.",
      });
      setActiveDate(null);
    } catch (error) {
      notification.error({
        message: "Erreur lors de la mise à jour de la date d'activation",
        description:
          error?.response?.data?.error?.message ||
          "Impossible de mettre à jour la date d'activation.",
      });
    } finally {
      setLoadingActiveDate(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Maintenance"
        buttons={[
          <div key="1" className="page-header-actions"></div>,
        ]}
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
                  <SelectGm
                    placeholder="Activer"
                    options={selectOptions}
                    style={{ width: 150 }}
                    onSelect={(e) => {
                      if (e.value === "Maintenance") {
                        handleActive();
                      } else if (e.value === "Activer") {
                        handleDeactive();
                      }
                    }}
                  />
                </Col>
              </div>
              {/* New section for Mobile Apps Activate Date */}
              <div style={{ marginTop: 32 }}>
                <h1 style={{ fontSize: "1.1rem" }}>Date d'activation des applications mobiles</h1>
                <h3 style={{ fontSize: "0.875rem", lineHeight: "1.5rem" }}>
                  Définissez la date à laquelle les applications mobiles seront activées.
                </h3>
                <Col sm={24} xs={24} style={{ marginTop: 16 }}>
                  <DatePicker
                    style={{ width: 250 }}
                    value={activeDate}
                    onChange={setActiveDate}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{ format: "HH:mm" }}
                    placeholder="Sélectionner une date et heure"
                  />
                  <Button
                    type="primary"
                    style={{marginTop:30 }}
                    loading={loadingActiveDate}
                    onClick={handleActiveDateUpdate}
                  >
                    Mettre à jour la date
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

export default Maintenance;
