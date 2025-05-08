import {
  Col,
  Pagination,
  Row,
  Table,
  Button,
  Tag,
  Checkbox,
  Modal,
} from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectListTitle } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import {
  getClients,
  updateUser,
  usersDel,
} from "../../../redux/User/userSlice";
import { Dropdown } from "../../../components/dropdown/dropdown";
import OverviewModal from "../OverviewModal";
import DeleteModal from "../DeleteModal";
import SelectGm from "../../../selectGm/SelectGm";
import Loader from "../../../components/loaderLine/Loader";

const Client = ({
  text,
  shouldPrint,
  setShouldPrint,
  setShouldExportPdf,
  shouldExportPdf,
  setShouldExportExcel,
  shouldExportExcel,
}) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.clients?.results);
 
  const meta = useSelector((state) => state?.user?.clients?.pagination);
  const isLoading = useSelector((state) => state?.user?.isLoading);
  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [modalId, setmodalId] = useState();
  // const users = allUsers.filter(
  //   (user) => user?.__component === "section.client"
  // );

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { value: "Activer", label: "Activer" },
    { value: "Désactiver", label: "Désactiver" },
  ]);
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
    dispatch(
      getClients({
        page: 1,
        pageSize: 10,
        text: text,
      })  
    ); // Dispatch the action to get users
    setState({ data: users, current: 1, pageSize: 10 });
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
      dataIndex: "Nom Complet",
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
        <ProjectListTitle style={{ width: "20vw", overflow: "hidden" }}>
          <p style={{ width: "100%", overflow: "hidden" }}>
            {record?.firstName} {" "}
            {record?.lastName}
          </p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Numéro de téléphone",
      title: "Numéro de téléphone",
      dataIndex: "Numéro de téléphone",
      render: (text, record) => (
        <span className="date-finished">{record?.phoneNumber}</span>
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
    // {
    //   id: "numéro de carte d'identité",
    //   title: "numéro de carte d'identité",
    //   dataIndex: "numéro de carte d'identité",
    //   render: (text, record) => (
    //     <ProjectListTitle>
    //       <p>{record.cin}</p>
    //     </ProjectListTitle>
    //   ),
    // },

    { id: "action", title: "", dataIndex: "action" },
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
      getClients({
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
      firstName: value?.firstName,
      lastName: value?.lastName,
      phoneNumber: value?.phoneNumber,
      email: value?.email,
      cin: value?.cin,
      blocked: value?.blocked,
      action: (
        <SelectGm
          options={selectOptions}
          placeholder={value?.blocked === false ? "Activer" : "Désactiver"}
          onSelect={(e) => {
            Modal.confirm({
              title: "Confirmation D'action",
              content:
                "Etes vous sure de vouloir changer le statut de cet client?",
              okText: "Oui",
              okType: "danger",
              cancelText: "Annuler",
              onOk() {
                dispatch(
                  updateUser({
                    id: value.id,
                    user: { blocked: !value.blocked },
                  })
                ).then(() => {
                  dispatch(getClients({}));
                });
              },
              onCancel() {
                dispatch(getClients({}));
              },
            });
          }}
          active={value.blocked}
        />
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
                to="#"
                onClick={(e) => {
                  Modal.confirm({
                    title: "Confirmation D'action",
                    content: "Etes vous sure de vouloir Suprimer cet client?",
                    okText: "Oui",
                    okType: "danger",
                    cancelText: "Annuler",
                    onOk() {
                    
                      dispatch(usersDel(value.id)).then(() => {
                        dispatch(getClients({}));
                      });
                    },
                    onCancel() {
                      dispatch(getClients({}));
                    },
                  });
                }}
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
                  showSizeChanger: true,
                  pageSizeOptions: ["5", "10", "20", "50"],
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
      <OverviewModal open={open} setOpen={setOpen} modalId={modalId} />
      {/* <DeleteModal open={open} setOpen={setOpen} modalId={modalId} /> */}
    </>
  );
};

export default Client;
