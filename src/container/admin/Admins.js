import React, { lazy, useState, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Spin,
  Checkbox,
  Select,
  Steps,
  Modal,
  Tag,
  Dropdown,
} from "antd";
import { Switch, NavLink, Route, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import propTypes from "prop-types";
import CreateProject from "./overview/List";
import { ProjectHeader, ProjectListTitle, ProjectSorting } from "./style";
import { AutoComplete } from "../../components/autoComplete/autoComplete";
import { Button } from "../../components/buttons/buttons";

import { Main } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import { getReservations } from "../../redux/reservations/reservationSlice";
// import OverviewModal from "./OverviewModal";
// import Addagent from "./Addagent";
import { Step } from "rc-steps";
// import Updateagent from "./Updateagent";
import styled from "styled-components";
import Buttonobtenez from "../../components/buttonobtenez";
import plus from "../../static/img/icon/plus.svg";
import {
  getAdmins,
  getAgent,
  getusers,
  usersDel,
} from "../../redux/User/userSlice";
import Addadmin from "./Addadmin";
import OverviewModal from "./OverviewModal";

const List = lazy(() => import("./overview/List"));

function Admins({ match }) {
  const [text, settext] = useState("");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  const adminsCount = useSelector(
    (state) => state?.user?.admins?.pagination?.total
  );
  // const owner = users?.filter((user) => user?.user_role === "owner");
  // console.log("admins", admins);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentname = useSelector(
    (state) => state?.user?.currentUser?.name
  );
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);
  const { path } = match;
  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openU, setOpenU] = useState(false);
  const [modalId, setmodalId] = useState();
  const [modaldata, setmodaldata] = useState();
  const [UpdateModal, setUpdateModal] = useState(false);
  const [addAgent, setAddAgent] = useState(false);
  const [ping, setPing] = useState(false);
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
  const showAdd = () => {
    setOpenA(true);
  };
  const showUpdate = () => {
    setOpenU(true);
  };
  const [selectedRows, setSelectedRows] = useState([]);
  // console.log(selectedRows);
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = users?.map((value) => value.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (checked, id) => {
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows?.filter((rowId) => rowId !== id)
      );
    }
  };

  // useEffect(() => {
  //   dispatch(getusers()); // Dispatch the action to get users
  //   // console.log("admin");
  // }, [dispatch,ping]);

  const handleDelete = (id) => {
    setmodalId(id);
    Modal.confirm({
      title: `Supprimer Agent `,
      content: "Êtes-vous sûr de supprimer cet élément?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        dispatch(usersDel(id)).then(() => {
          dispatch(getusers());
          setPing(!ping);
        });
      },
      onCancel() {
        setmodalId(null);
      },
    });
  };
  const columns = [
    {
      title: () => (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          indeterminate={
            selectedRows?.length > 0 && selectedRows?.length < users?.length
          }
          checked={selectedRows?.length === users?.length}
        />
      ),
      dataIndex: "id",
      key: "checkbox",
      render: (id) => (
        <Checkbox
          onChange={(e) => handleSelectRow(e.target.checked, id)}
          checked={selectedRows.includes(id)}
        />
      ),
    },
    {
      id: "id",
      title: "ID",
      dataIndex: "id",

      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.id}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Nom Complet",
      title: "Nom Complet",
      dataIndex: "Nom Complet",
      render: (text, record) => (
        <ProjectListTitle>
          <div style={{ display: "flex", gap: "10px" }}>
            <p> {record?.firstName} </p>
            <p> {record?.lastName}</p>
          </div>
        </ProjectListTitle>
      ),
    },

    {
      id: "Numéro de téléphone",
      title: "Numéro de téléphone",
      dataIndex: "Numéro de téléphone",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.phoneNumber}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Adresse e-mail",
      title: "Adresse e-mail",
      dataIndex: "Adresse e-mail",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.email}</p>
        </ProjectListTitle>
      ),
    },

    {
      id: "Société",
      title: "Société",
      dataIndex: "Société",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{currentname}</p>
        </ProjectListTitle>
      ),
    },

    {
      id: "Status",
      title: "Status",
      dataIndex: "Status",
    },

    {
      title: "",
      dataIndex: "more",
      key: "more",
    },
  ];
  const dataSource =
    users?.map((value) => ({
      key: value.id,
      id: value.documentId,
      username: value?.username,
      phoneNumber: value?.phoneNumber,
      email: value?.email,
      firstName: value?.firstName,
      lastName: value?.lastName,

      Status:
        value?.blocked === false ? (
          <Tag color="darkgreen">Activé</Tag>
        ) : (
          <Tag color="darkred">Désactivé</Tag>
        ),
      more: (
        <Dropdown
          className="wide-dropdwon"
          content={
            <>
              <Link
                onClick={() => {
                  setOpen(true);
                  setmodalId(value.documentId);
                }}
                to="#"
              >
                Voir
              </Link>
              <Link
                onClick={() => {
                  showUpdate();
                  // setOpenU(true);
                  setmodalId(value.documentId);
                  setmodaldata(value);
                  // handleDelete(value.id)
                }}
                to="#"
              >
                Modifier
              </Link>

              <Link
                onClick={() => {
                  setOpenD(true);
                  setmodalId(value.documentId);

                  handleDelete(value.documentId);
                }}
                to="#"
              >
                Supprimer
              </Link>
            </>
          }
        >
          <Link to="#">
            <FeatherIcon icon="more-horizontal" size={18} />
          </Link>
        </Dropdown>
      ),
    })) || [];

  return (
    <>
      <ProjectHeader>
        <PageHeader
          ghost
          title="Admins"
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
              </div>{" "}
              
            </div>
          }
          buttons={[
            userRole === "owner" && (
              <Button
                className="btn_ADD"
                key="1"
                type="primary"
                size="default"
                onClick={() => showModal()}
              >
                <FeatherIcon icon="plus" size={16} />
                Créer un nouveau Admin
              </Button>
            ),
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
        <OverviewModal onCancel={onCancel} visible={visible} />
        <Addadmin onCancel={onCancel} visible={visible} match={match} />
      </Main>
    </>
  );
}
Admins.propTypes = {
  match: propTypes.object,
};

export default Admins;
