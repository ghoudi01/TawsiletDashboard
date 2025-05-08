import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Spin, Select } from "antd";
import { Switch, NavLink, Route, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
// import CreateProject from "./overview/CreateProject";
import { ProjectHeader,    } from "./style";
import { Button } from "../../components/buttons/buttons";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import CreateUserModal from "./CreateUserModal";
const List = lazy(() => import("./overview/List"));

function Clients({ match }) {
  // const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(getReservations());
  //   }, []);

  // const searchData = useSelector((state) => state.headerSearchData);
  const clientsCount = useSelector(
    (store) => store?.user?.clients?.pageInfo?.total
  );
  const { path } = match;
  const [shouldPrint, setShouldPrint] = useState(false);
  const [shouldExportPdf, setShouldExportPdf] = useState(false);
  const [shouldExportExcel, setShouldExportExcel] = useState(false);
  //------------------------------ modal add user ------------------------------------------------------------------

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

  //----------------------------------------------------------------------------------------------------------------
  const [text, settext] = useState("");
  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Clients"
          subTitle={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="project-sort-search"
                style={{ marginRight: "1vw" }}
              >
                <input
                  onChange={(e) => settext(e.target.value)}
                  // dataSource={notData}
                  className="data_search_input"
                  placeholder="Rechercher ..."
                  patterns
                />
              </div>
              <>{clientsCount} Clients </>{" "}
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
              key="1"
              type="primary"
              size="default"
              className="btn_ADD"
              onClick={() => showModal(true)}
            >
              <FeatherIcon icon="plus" size={16} /> Ajouter un nouveau client
            </Button>,
          ]}
        />
      </ProjectHeader>
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            {/* <ProjectSorting>
              <div className="project-sort-bar">
                {/* <div className="project-sort-nav">
                  <nav>
                    <ul>
                      <li className="active">
                        <Link to="#">All</Link>
                      </li>
                      <li className="active">
                        <Link to="#">In Progress</Link>
                      </li>
                      <li className="active">
                        <Link to="#">Complete</Link>
                      </li>
                      <li className="active">
                        <Link to="#">Late</Link>
                      </li>
                      <li className="active">
                        <Link to="#">Early</Link>
                      </li>
                    </ul>
                  </nav>
                </div> */}

            {/* <div className="project-sort-group">
                  <div className="sort-group">
                    <span>Sort By:</span>
                    <Select defaultValue="category">
                      <Select.Option value="category">
                        Project Category
                      </Select.Option>
                      <Select.Option value="rate">Top Rated</Select.Option>
                      <Select.Option value="popular">Popular</Select.Option>
                      <Select.Option value="time">Newest</Select.Option>
                      <Select.Option value="price">Price</Select.Option>
                    </Select>
                    <div className="layout-style">
                      <NavLink to={`${path}/list`}>
                        <FeatherIcon icon="list" size={16} />
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </ProjectSorting>  */}
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
        <CreateUserModal onCancel={onCancel} visible={visible} />
      </Main>
    </>
  );
}

Clients.propTypes = {
  match: propTypes.object,
};

export default Clients;
