import React, { lazy, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col } from "antd";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
// import CreateProject from "./overview/CreateProject";
import { ProjectHeader } from "./style";
import { Button } from "../../components/buttons/buttons";
import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import ModalAdd from "./ModalAdd";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
import FilterBar from "./utils/filtersBar/FilterBar";
import { Link } from "react-router-dom";
import { getDriver } from "../../redux/User/userSlice";

const List = lazy(() => import("./overview/List"));

function Livreur({ match, usersList }) {
  const users = useSelector((state) => state.user?.drivers.results);
  const currentUser = useSelector((store) => store?.user?.currentUser);
  const driversCount = useSelector(
    (state) => state.user?.drivers?.pagination?.total
  );
  const current = useSelector((state) => state?.user?.currentUser?.id);
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);
  const filteredUsers = users?.filter(
    (el) => el.company_id?.id === current
  );
  const { path } = match;
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("");
  const [text, settext] = useState("");

  //------------------------------ modal add user ------------------------------------------------------------------
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  const [state, setState] = useState({
    visible: false,
  });
  const { notData, visible } = state;
  const showModal = (x) => {
    setState({
      ...state,
      visible: x,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentuser = useSelector((state) => state?.user?.currentUser);
  const meta = useSelector((state) => state?.vehicules?.meta);
  const currentRole = useSelector(
    (state) => state?.user?.currentUser?.user_role
  );

  useEffect(() => {
    dispatch(getDriver({ page: 1, pageSize: 10, status: activeFilter, text }));
  }, [dispatch, activeFilter, text]);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Chauffeur"
          subTitle={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="project-sort-search"
                style={{ marginRight: "1vw" }}
              >
                <input
                  className="data_search_input"
                  onChange={(e) => settext(e.target.value)}
                  placeholder="Rechercher ..."
                  patterns
                />
              </div>{" "}
              <>{driversCount} Chauffeurs </>{" "}
            </div>
          }
          buttons={[
            <ExportButtonPageHeader
              key="2"
              setShouldPrint={setShouldPrint}
              setShouldExportPdf={setShouldExportPdf}
              setShouldExportExcel={setShouldExportExcel}
            />,
           (["owner", "agent","admin"].includes(currentUser?.user_role)  && <Button
              key="1"
              type="primary"
              size="default"
              className="btn_Suivant"
              onClick={() => showModal(true)}
            >
              <FeatherIcon icon="plus" size={16} /> Ajouter un nouveau livreur
            </Button> )
          ]}
        />
      </ProjectHeader>
      <FilterBar>
        <ul>
          <Link to="#" onClick={() => handleFilterClick("")}>
            <li
              className={!activeFilter ? "slected_filter_status_bg" : ""}
            >
              Tous
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => handleFilterClick("valid")}
          >
            <li
              className={
                activeFilter === "valid" ? "slected_filter_status_bg" : ""
              }
            >
              Valide
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => handleFilterClick("invalid")}
          >
            <li
              className={
                activeFilter === "invalid" ? "slected_filter_status_bg" : ""
              }
            >
              désactiver
            </li>
          </Link>
          <Link
            to="#"
            onClick={() => handleFilterClick("waiting")}
          >
            <li
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
                text={text}
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
        <ModalAdd onCancel={onCancel} visible={visible} />
      </Main>
    </>
  );
}

Livreur.propTypes = {
  match: propTypes.object,
};

export default Livreur;
