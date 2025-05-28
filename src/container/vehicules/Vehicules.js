import React, { lazy, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Spin } from "antd";
import { Switch, Route } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { ProjectHeader } from "./style";
import { Button } from "../../components/buttons/buttons";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import CreateVehicule from "./overview/CreateVehicule";
 import FilterBar from "../../components/filtersBar/FilterBar";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";

const List = lazy(() => import("./overview/ListVehicule"));

function Project({ match }) {
  // const vehicules = useSelector((state) => state.headervehicules);
  const vehicules = useSelector((state) => state?.vehicules.vehicules);
  const meta = useSelector((state) => state?.vehicules.meta);
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const { path } = match;
  const [state, setState] = useState({
    notData: vehicules,
    visible: false,
    categoryActive: "all",
  });
  const { visible } = state;
  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };
  const [textFilter, setTextFilter] = useState("");

  const [activeFilter, setActiveFilter] = useState("");
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };
  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Vehicules"
          subTitle={
            <div style={{ display: "flex", alignItems: "center" }}>
              <>{meta?.total} Vehicules </>{" "}
            </div>
          }
          buttons={[
            <ExportButtonPageHeader
              key="2"
              setShouldPrint={setShouldPrint}
              setShouldExportPdf={setShouldExportPdf}
              setShouldExportExcel={setShouldExportExcel}
            />,
            <Button
              onClick={() => showModal()}
              type="1"
              size="default"
              className="btn_ADD"
            >
              <FeatherIcon icon="plus" size={16} />
              Créer un nouveau vehicule
            </Button>,
          ]}
        />
      </ProjectHeader>
      <FilterBar
        setFilterStatus={setFilterStatus}
        setTextFilter={setTextFilter}
      >
        {" "}
        <ul>
          <Link to="#" onClick={() => handleFilterClick("")}>
            {" "}
            <li
              onClick={() => setFilterStatus("")}
              className={activeFilter === "" ? "slected_filter_status_bg" : ""}
            >
              Tous
            </li>
          </Link>
          <Link to="#" onClick={() => handleFilterClick("valid")}>
            {" "}
            <li
              onClick={() => setFilterStatus("valid")}
              className={
                activeFilter === "valid" ? "slected_filter_status_bg" : ""
              }
            >
              Valide
            </li>
          </Link>
          <Link to="#" onClick={() => handleFilterClick("invalid")}>
            {" "}
            <li
              onClick={() => setFilterStatus("invalid")}
              className={
                activeFilter === "invalid" ? "slected_filter_status_bg" : ""
              }
            >
              Invalide
            </li>
          </Link>
          <Link to="#" onClick={() => handleFilterClick("waiting")}>
            {" "}
            <li
              onClick={() => setFilterStatus("waiting")}
              className={
                activeFilter === "waiting" ? "slected_filter_status_bg" : ""
              }
            >
              En attente
            </li>
          </Link>
        </ul>
      </FilterBar>
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <div>
              <List
                textFilter={textFilter}
                filterStatus={filterStatus}
                shouldPrint={shouldPrint}
                setShouldPrint={setShouldPrint}
                setShouldExportPdf={setShouldExportPdf}
                shouldExportPdf={shouldExportPdf}
                setShouldExportExcel={setShouldExportExcel}
                shouldExportExcel={shouldExportExcel}
              />
            </div>
          </Col>
        </Row>
        <CreateVehicule onCancel={onCancel} visible={visible} />
      </Main>
    </>
  );
}

Project.propTypes = {
  match: propTypes.object,
};

export default Project;
