import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Spin, Select } from "antd";
import { Switch, NavLink, Route, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
// import CreateProject from "./overview/CreateProject";
import { ProjectHeader, ProjectSorting } from "./style";
import { AutoComplete } from "../../components/autoComplete/autoComplete";
import { Button } from "../../components/buttons/buttons";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import { getReservations } from "../../redux/reservations/reservationSlice";
import CreateLivreurModal from "./CreateLivreurModal";
import ModalAdd from "./ModalAdd";
import { ExportButtonPageHeader } from "../../components/buttons/export-button/export-button";
import { getVehicule } from "../../redux/vehicule/vehiculeSlice";

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

  // const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(getReservations());
  //   }, []);

  // const searchData = useSelector((state) => state.headerSearchData);
  const { path } = match;
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
  const dispatch = useDispatch();
  const currentRole = useSelector(
    (state) => state?.user?.currentUser?.user_role
  );

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (currentId && currentRole === "company") {
  //       try {
  //         // Assuming setUserRole is an asynchronous function

  //         const response = await dispatch(
  //           getVehicule({
  //             pagination: {
  //               current: 1,
  //               pageSize: meta.pageSize,
  //             },

  //             user_id: currentId,
  //           })
  //         );
  //       } catch (error) {
  //         // Handle any errors that might occur during the data fetching
  //         console.error("Error fetching data:", error);
  //       }
  //     } else if (currentId && currentRole === "agent") {
  //       try {
  //         // Assuming setUserRole is an asynchronous function

  //         const response = await dispatch(
  //           getVehicule({
  //             pagination: {
  //               current: 1,
  //               pageSize: meta.pageSize,
  //             },

  //             user_id: currentuser?.company_id?.id,
  //           })
  //         );
  //         // console.log(response.payload.data.data, "response");
  //       } catch (error) {
  //         // Handle any errors that might occur during the data fetching
  //         console.error("Error fetching data:", error);
  //       }
  //     } else {
  //       try {
  //         // Assuming setUserRole is an asynchronous function

  //         const response = await dispatch(
  //           getVehicule({
  //             pagination: {
  //               current: 1,
  //               pageSize: meta.pageSize,
  //             },
  //           })
  //         );
  //         // console.log(response.payload.data.data, "response");
  //       } catch (error) {
  //         // Handle any errors that might occur during the data fetching
  //         console.error("Error fetching data:", error);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [currentId, dispatch]);

  //----------------------------------------------------------------------------------------------------------------
  const [text, settext] = useState("");
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
                  // dataSource={notData}
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
           (["company", "agent","admin"].includes(currentUser?.user_role)  && <Button
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
        <ModalAdd onCancel={onCancel} visible={visible} />
      </Main>
    </>
  );
}

Livreur.propTypes = {
  match: propTypes.object,
};

export default Livreur;
