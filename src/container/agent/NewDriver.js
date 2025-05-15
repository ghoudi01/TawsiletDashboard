import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Spin, Select, Steps } from "antd";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import { ProjectHeader, ProjectSorting } from "../admin/style";
import { Button } from "../../components/buttons/buttons";
import { getDriver, getDriversWithCars } from "../../redux/User/userSlice";
import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import Addagent from "./Addagent";
import { Cards } from "../../components/cards/frame/cards-frame";

const List = lazy(() => import("./List"));
//updateUser
function NewDriver({ match }) {
  const drivers = useSelector((state) => state?.user?.driversWithCars);
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);
  const [state, setState] = useState({
    //  notData: searchData,
    visible: false,
    categoryActive: "all",
  });
  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };
  useEffect(() => {
    dispatch(getDriversWithCars());
    
  }, [ dispatch]);

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };
  const [text, settext] = useState("");
  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Drivers"
          subTitle={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                className="project-sort-search"
                style={{ marginRight: "1vw" }}
              >
                <div className="project-sort-search">
                  <input
                    className="data_search_input"
                    type="text"
                    onChange={(e) => settext(e.target.value)}
                    placeholder="Rechercher ..."
                    patterns
                  />
                </div>
              </div>
            </div>
          }
          buttons={[
            userRole === "owner" ||
              userRole === "admin" ||
              (userRole === "company" && (
                <Button
                  className="btn_ADD"
                  key="1"
                  type="primary"
                  size="default"
                  onClick={() => showModal()}
                >
                  <FeatherIcon icon="plus" size={16} /> Créer un nouvel Agent
                </Button>
              )),
            // <Buttonobtenez><FeatherIcon icon="plus" size={16} />Créer un nouvel Agent</Buttonobtenez>
          ]}
        />
      </ProjectHeader>
      <Row>
        <Cards>
          <List text={text} data={drivers} />
        </Cards>
      </Row>
    </>
  );
}
NewDriver.propTypes = {
  match: propTypes.object,
};

export default NewDriver;
