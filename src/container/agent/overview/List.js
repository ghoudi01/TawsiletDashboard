import {
  Col,
  Pagination,
  Row,
  Table,
  Button,
  Tag,
  Checkbox,
  Modal,
  Switch,
  Spin,
} from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectListTitle } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { getAgent, getusers, usersDel } from "../../../redux/User/userSlice";
import { Dropdown } from "../../../components/dropdown/dropdown";
import OverviewModal from "../OverviewModal";
import AddAgent from "../Addagent";
import Updateagent from "../Updateagent";
import Addagent from "../Addagent";
import Loader from "../../../components/loaderLine/Loader";

const Agent = ({ text }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.agents);
  const meta = useSelector((state) => state?.user?.agents?.pagination);
  // const drivers = useSelector((state) => state.user.drivers);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  // looding
  const isLoading = useSelector((state) => state?.user?.isLoading);


  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openU, setOpenU] = useState(false);
  const [modalId, setmodalId] = useState();
  const [modaldata, setmodaldata] = useState();
  const showUpdate = () => {
    setOpenU(true);
  };
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = users.map((value) => value.id);
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

  useEffect(() => {
    dispatch(getAgent({ page: 1, pageSize: state.pageSize, text: text })); // Dispatch the action to get users
  }, [dispatch, text]);

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
      id: "Role",
      title: "Role",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.user_role}</p>
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

  const [state, setState] = useState({
    data: users,
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (users) {
      setState((prevState) => ({
        ...prevState,
        data: users,
      }));
    }
  }, [users]);

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };

  const onHandleChange = (pagination) => {
    dispatch(
      getAgent({
        page: pagination.current,
        pageSize: pagination.pageSize,
        text: text,
      })
    );

    setState((prevState) => ({
      ...prevState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };
 
  // company
  const dataCompany =
    users
      ?.map((value) => ({
        key: value.id,
        id: value.id,
        username: value?.username,
        phoneNumber: value?.phoneNumber,
        email: value?.email,
        firstName: value?.firstName,
        lastName: value?.lastName,
        company_id: value?.company_id,
        user_role:
          value?.user_role,

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
                    setmodalId(value);
                  }}
                  to="#"
                >
                  Voir
                </Link>
                <Link
                  onClick={() => {
                    showUpdate();
                    // setOpenU(true);
                    setmodalId(value);
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

                    Modal.confirm({
                      title: `Supprimer Agent N° ${value?.id} `,
                      content: "Êtes-vous sûr de supprimer cet élément?",
                      okText: "Supprimer",
                      okType: "danger",
                      cancelText: "Annuler",
                      onOk() {
                        dispatch(usersDel(value?.id)).then(() => {
                          dispatch(getAgent({ page: 1, pageSize: 10 }));
                        });
                      },
                      onCancel() {},
                    });
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
  // admin owner
  const dataSource =
    users
      ?.map((value) => ({
        key: value.id,
        id: value.id,
        username: value?.username,
        phoneNumber: value?.phoneNumber,
        email: value?.email,
        firstName: value?.firstName,
        lastName: value?.lastName,
        company_id: value?.company_id,
        user_role:
          value?.user_role,
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
                    setmodalId(value);
                  }}
                  to="#"
                >
                  Voir
                </Link>
                <Link
                  onClick={() => {
                    showUpdate();
                    // setOpenU(true);
                    setmodalId(value);
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

                    Modal.confirm({
                      title: `Supprimer Agent N° ${value?.id} `,
                      content: "Êtes-vous sûr de supprimer cet élément?",
                      okText: "Supprimer",
                      okType: "danger",
                      cancelText: "Annuler",
                      onOk() {
                        dispatch(usersDel(value?.id)).then(() => {
                          dispatch(getusers());
                        });
                      },
                      onCancel() {},
                    });
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
  // agents
  const dataagents =
    users?.map((value) => ({
      key: value.id,
      id: value.id,
      username: value?.username,
      phoneNumber: value?.phoneNumber,
      email: value?.email,
      firstName: value?.firstName,
      lastName: value?.lastName,
      company_id: value?.agent_company,
      user_role: value?.user_role,

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
                  setmodalId(value);
                }}
                to="#"
              >
                Voir
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
      <Row gutter={25}>
        <Col xs={24}>
          {isLoading && <Loader />}
          <Cards headless>
            <div className="table-responsive">
              {currentUser?.user_role === "owner" ||
              currentUser?.user_role === "admin" ? (
                <Table
                  className="table-striped-rows"
                  pagination={{
                    current: state.current,
                    pageSize: state.pageSize,
                    total: meta?.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],

                    onShowSizeChange: onShowSizeChange,
                  }}
                  dataSource={dataSource}
                  columns={columns}
                  onChange={onHandleChange}
                  // loading={isLoading}
                />
              ) : currentUser?.user_role === "company" ? (
                <Table
                  className="table-striped-rows"
                  pagination={{
                    current: state?.current,
                    pageSize: state?.pageSize,
                    total: meta?.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["1", "5", "10", "20", "50"],

                    onShowSizeChange: onShowSizeChange,
                  }}
                  dataSource={dataCompany}
                  columns={columns}
                  onChange={onHandleChange}
                  // loading={isLoading}
                />
              ) : (
                <Table
                  className="table-striped-rows"
                  pagination={{
                    current: state?.current,
                    pageSize: state?.pageSize,
                    total: meta?.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    onShowSizeChange: onShowSizeChange,
                  }}
                  dataSource={dataagents}
                  columns={columns}
                  onChange={onHandleChange}
                  // loading={isLoading}
                />
              )}
            </div>
          </Cards>
        </Col>
      </Row>
      <OverviewModal
        open={open}
        setOpen={setOpen}
        modalId={modalId}
        modaldata={modaldata}
      />

      <Addagent
        onCancel={() => setOpenA(false)}
        visible={openA}
        modalId={modalId}
      />
      <Updateagent
        onCancel={() => setOpenU(false)}
        visible={openU}
        modalId={modalId}
        modaldata={modaldata}
      />
    </>
  );
};

export default Agent;
