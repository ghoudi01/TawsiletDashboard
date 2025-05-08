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
import {
  getusers,
  usersDel,
  getUserById,
  getAgent,
  getAdmins,
} from "../../../redux/User/userSlice";
import { Dropdown } from "../../../components/dropdown/dropdown";
import OverviewModal from "../OverviewModal";
import UpdateAdmin from "../UpdateAdmin";
import Loader from "../../../components/loaderLine/Loader";

const Admin = ({ text }) => {
  const dispatch = useDispatch();

  const users = useSelector((state) => state?.user?.admins?.results);
  const meta = useSelector((state) => state?.user?.admins?.pagination);

  const owner = users?.user_role === "owner";

  // looding

  const adminUpdate = useSelector((state) => state.user.getted);

  const isLoading = useSelector((state) => state?.user?.isLoading);
  const [loader, setLoader] = useState(isLoading);
  //  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentname = useSelector(
    (state) => state?.user?.currentUser.name
  );

  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openU, setOpenU] = useState(false);
  const [modalId, setmodalId] = useState();
  const [modaldata, setmodaldata] = useState();
  const [UpdateModal, setUpdateModal] = useState(false);
  const [addAgent, setAddAgent] = useState(false);

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
    dispatch(getAdmins({ page: 1, pageSize: 10, text: text })); // Dispatch the action to get users
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
      id: "Société",
      title: "Société",
      dataIndex: "Société",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.company}</p>
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
      getAdmins({
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

  const dataSource =
    users?.map((value) => ({
      key: value.id,
      id: value.id,
      username: value?.username,
      phoneNumber: value?.phoneNumber,
      email: value?.email,
      firstName: value?.firstName,
      lastName: value?.lastName,
      company:
        value?.length !== 0 &&
        value?.company_id !== null
          ? value?.company_id?.name
          : null,

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
              {/* {<Link
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
              </Link>} */}

              <Link
                onClick={() => {
                  setOpenD(true);
                  Modal.confirm({
                    title: `Supprimer l'admin N°${value?.id} `,
                    content: "Êtes-vous sûr de supprimer cet élément?",
                    okText: "Supprimer",
                    okType: "danger",
                    cancelText: "Annuler",
                    onOk() {
                      dispatch(usersDel(value?.id)).then(() => {
                        dispatch(
                          getAdmins({ page: 1, pageSize: 10, text: text })
                        );
                      });
                    },
                    onCancel() {
                      setmodalId(null);
                    },
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

  return (
    <>
      <Row gutter={25}>
        <Col xs={24}>
          {isLoading && <Loader />}
          <Cards headless>
            <div className="table-responsive">
              <Table
                className="table-striped-rows"
                pagination={{
                  current: state?.current,
                  pageSize: state?.pageSize,
                  total: meta?.total,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                }}
                dataSource={dataSource}
                columns={columns}
                onChange={onHandleChange}
                // loading={isLoading}
              />
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

      {/* <Addagent
                onCancel={() => setOpenA(false)}
                visible={openA}
                modalId={modalId}
              /> */}
      <UpdateAdmin
        onCancel={() => setOpenU(false)}
        visible={openU}
        modalId={modalId}
        modaldata={modaldata}
      />
    </>
  );
};

export default Admin;
