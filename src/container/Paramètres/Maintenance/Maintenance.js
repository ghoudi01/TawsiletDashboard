import React, { useState } from "react";
import { Row, Col, Checkbox, Select, Input, Modal } from "antd";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Button } from "../../../components/buttons/buttons";
import { ShareButtonPageHeader } from "../../../components/buttons/share-button/share-button";
import { ExportButtonPageHeader } from "../../../components/buttons/export-button/export-button";
import { CalendarButtonPageHeader } from "../../../components/buttons/calendar-button/calendar-button";
import SelectGm from "../../../selectGm/SelectGm";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useRef } from "react";
import { updatePrices } from "../../../redux/pricing/settingSlice";
import { useDispatch } from "react-redux";

function Maintenance() {
  const dispatch = useDispatch();
  const [showMaintenace, setShowMaintenace] = useState(false);
  

  const selectOptions = [
    { value: "Activer", label: "Activer" },
    /*         { value: "Coming Soon", label: "Coming Soon" }, */
    { value: "Maintenance", label: "Maintenance" },
  ];
  /*    const selectOptionsMobile = [
        { value: "Activer", label: "Activer" },
        { value: "Desactiver", label: "Desactiver" },

    ]; */

  const handleActive = () => {

    Modal.confirm({
      title: "Confirm Change",
      content: `Confirmez la désactivation de site?`,
      okText: "Désactiver",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        dispatch(
          updatePrices({
            id: 1,
            newPrice: {
              data: {
                maintenance: true,
              },
            },
          })
        );
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
      onOk() {
        dispatch(
          updatePrices({
            id: 1,
            newPrice: {
              data: {
                maintenance: false,
              },
            },
          })
        );
      },
      onCancel() {},
    });
  };
  return (
    <>
      <PageHeader
        title="Maintenance"
        buttons={[
          <div key="1" className="page-header-actions">
            {/* <CalendarButtonPageHeader />
            <ExportButtonPageHeader />
            <ShareButtonPageHeader /> */}
          </div>,
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
                      /*   if (e.value === "Coming Soon") {
                                                setShowComing(!showComing);
                                                setShowMaintenace(false)
                                            }
                                            else */ if (
                        e.value === "Maintenance"
                      ) {
                        /*   setShowComing(false); */
                        handleActive();
                      } else if (e.value === "Activer") {
                        /*  setShowComing(false) */
                        handleDeactive();
                      }
                    }}
                  />
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
