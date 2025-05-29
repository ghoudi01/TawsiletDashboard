import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Spin, Select, Steps } from "antd";
import { Switch, NavLink, Route, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import CreateProject from "./overview/List";
import { ProjectHeader, ProjectSorting } from "./style";
import { AutoComplete } from "../../components/autoComplete/autoComplete";
import { Button } from "../../components/buttons/buttons";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import { getReservations } from "../../redux/reservations/reservationSlice";
import OverviewModal from "./OverviewModal";
import Addagent from "./Addagent";
import { Step } from "rc-steps";
import Updateagent from "./Updateagent";
import styled from "styled-components";
import Buttonobtenez from "../../components/buttonobtenez";
import plus from "../../static/img/icon/plus.svg";

const List = lazy(() => import("./overview/List"));

function Agents({ match }) {
  const users = useSelector((state) => state?.user?.agents?.results);
  const agents = users;
  const agentsCount = useSelector(
    (state) => state?.user?.agents?.pagination?.total
  );

  const current = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);
  const companyID = currentUser?.company_id?.id;

  const filteredUsers = agents?.filter((el) => el.company_id?.id === current);

  const filtereAgents = agents?.filter((el) => el.company_id?.id === companyID);

  // console.log(agents?.length,"admin")
  // console.log(current,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
  // const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(getReservations());
  //   }, []);

  // const searchData = useSelector((state) => state.headerSearchData);
  const { path } = match;

  const [state, setState] = useState({
    //  notData: searchData,
    visible: false,
    categoryActive: "all",
  });

  const { notData, visible } = state;

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
  const [text, settext] = useState("");
  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Agents"
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
            <Button
              className="btn_ADD"
              key="1"
              type="primary"
              size="default"
              onClick={() => showModal()}
            >
              <FeatherIcon icon="plus" size={16} /> Créer un nouvel Agent
            </Button>,
            // <Buttonobtenez><FeatherIcon icon="plus" size={16} />Créer un nouvel Agent</Buttonobtenez>
          ]}
        />
      </ProjectHeader>
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            <ProjectSorting></ProjectSorting>
            <div>
              <List text={text} />
            </div>
          </Col>
        </Row>
        {/* <OverviewModal    onCancel={onCancel} visible={visible} /> */}
        <Addagent onCancel={onCancel} visible={visible} match={match} />
      </Main>
    </>
  );
}
Agents.propTypes = {
  match: propTypes.object,
};

export default Agents;
