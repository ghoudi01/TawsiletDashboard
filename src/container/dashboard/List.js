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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectListTitle } from "./style";
import { Cards } from "../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReservation,
  getReservations,
  updateReservation,
} from "../../redux/reservations/reservationSlice";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Dropdown } from "../../components/dropdown/dropdown";
import ModalDash from "../../components/modal/ModalDash";
import FeatherIcon from "feather-icons-react";
import { getusers } from "../../redux/User/userSlice";
import livraisonImage from "../../static/img/livraison.png";
import carte_Banquaire from "../../static/img/carte_Banquaire.png";
import ReserveModal from "../reservations/overview/ReserveModal";

const Reservations = ({ textFilter, filterStatus, dateSortBy, dateFilter }) => {
  const location = useLocation();

  const dispatch = useDispatch();
  const reservations = useSelector((state) => state?.reservations?.reservations?.nodes);
  const meta = useSelector((state) => state?.reservations?.meta);
  const client = useSelector((state) => state?.user?.users);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const isLoading = useSelector((state) => state?.reservations?.isLoading);
  const filter = useSelector((state) => state.reservations.filter);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openReserver, setOpenReserver] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loader, setLoader] = useState(isLoading);

  const selectOptions = [
    { value: "Activer", label: "Activer" },
    { value: "Désactiver", label: "Désactiver" },
  ];

  const handleSelectAll = (checked) => {
    const currentPageData = dataSource.slice(
      (state.current - 1) * state.pageSize,
      state.current * state.pageSize
    );
    const currentPageIds = currentPageData.map((value) => value.id);

    if (checked) {
      setSelectedRows(currentPageIds);
    } else {
      setSelectedRows([]);
    }
  };
  const handleActive = ({ status, id }) => {
    const finalStatus = status === "Dispatching" ? "Canceled" : "Dispatching";

    Modal.confirm({
      title: "Confirm Change",
      content: `Are you sure you want to change ${status} to ${finalStatus}?`,
      okText: "Changer",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        dispatch(
          updateReservation({
            id: id,

            body: {
              data: {
                commandStatus: finalStatus,
              },
            },
          })
        ).then(() => dispatch(getReservations()));
      },
      onCancel() {
        setSelectedStatus((prev) => prev);
      },
    });
  };
  const handleSelectRow = (checked, id) => {
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((rowId) => rowId !== id)
      );
    }
  };

  const columns = [
    {
      title: () => (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < reservations.length
          }
          checked={selectedRows?.length === reservations?.length}
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
    { id: "id", title: "ID", dataIndex: "id" },
    {
      id: "pickupAddress",
      title: "Adresse de départ",
      dataIndex: "pickupAddress",
      render: (text, record, i) => (
        <ProjectListTitle>
          <p className="no-margin" style={{ margin: "0" }}>
            {record?.pickupAddress}
          </p>
        </ProjectListTitle>
      ),
    },

    {
      id: "deliveryAddress",
      title: "Adressse d'arrivée",
      dataIndex: "deliveryAddress",
      render: (text, record) => (
        <span className="date-finished">{record?.deliveryAddress}</span>
      ),
    },
    {
      id: "dateCreation",
      title: "Date de Creation",
      dataIndex: "dateCreation",
    },
    { id: "dateDepart", title: "Date de depart", dataIndex: "dateDepart" },
    { id: "idClient", title: "idClient", dataIndex: "idClient" },

    { id: "payType", title: "Methode de paiemant", dataIndex: "payType" },
    { id: "commandStatus", title: "Status", dataIndex: "commandStatus" },

    { id: "action", title: "", dataIndex: "action" },

    {
      title: "",
      dataIndex: "more",
      key: "more",
    },
  ];

  const [state, setState] = useState({
    data: reservations,
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (reservations) {
      setState((prevState) => ({
        ...prevState,
        data: reservations,
      }));
    }
  }, [dispatch, reservations]);

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };

  const onHandleChange = (pagination) => {
    dispatch(
      //on change Pagination Number
      getReservations({
        pagination: {
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
        // startDate: dateFilter.startDate,
        // endDate: dateFilter.endDate,
        text: textFilter,
        free: true,
        deepNumber: 3,
        sortBy: dateSortBy,
      })
    );
    setState((prevState) => ({
      ...prevState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const handleStatus = (value) => {
    switch (value) {
      case "Pending":
        return "#9E57E5";
        break;
      case "Canceled":
        return "#F3935D";
        break;
      case "Dispatching":
        return "#53B483";
        break;
      case "Processing":
        return "green";
        break;
      case "Completed":
        return "#59B4D1";
      default:
        return "gray";
    }
  };
  const handleStatusText = (value) => {
    switch (value) {
      case "Pending":
        return "En attente";
        break;
      case "Canceled":
        return "Annulés";
        break;
      case "Dispatching":
        return "En cours";
        break;
      case "Processing":
        return "En traitement";
        break;
      case "Completed":
        return "Livré";
      default:
        return "";
    }
  };
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this item?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        dispatch(deleteReservation(id)).then(() => {
          dispatch(getReservations());
        });
      },
      onCancel() {
        setSelectedId(null);
      },
    });
  };

  const dataSource = reservations
    ? reservations
        
        .map((value, i) => ({
          key: value?.id,
          id: value?.id,
          pickupAddress:
            value?.pickUpAddress?.Address.substring(0, 30) + "...",
          deliveryAddress:
            value?.dropOfAddress?.Address.substring(0, 30) + "...",
          dateCreation: value?.createdAt.slice(0, 10),
          dateDepart: value?.departDate,
          idClient: (
            <div className="table_cell_flex">
              <p className="no-margin" style={{ color: "blue" }}>
                {" "}
                {value?.client_id?.data?.id}
              </p>
            </div>
          ),

          payType: (
            <div className="table_paytype">
              <p className="no-margin">{value?.totalPrice} TND</p>{" "}
              {value?.payType?.toLowerCase() === "livraison" ? (
                <img src="../../images/livraison.png" />
              ) : (
                <img src="../../images/carte_Banquaire.png" />
              )}
            </div>
          ),
          commandStatus: (
            <Tag
              style={{
                backgroundColor: `${
                  handleStatus(value?.commandStatus) + "50"
                }`,
                color: `${handleStatus(value?.commandStatus)}`,
              }}
              color={handleStatus(value?.commandStatus)}
              className={value?.commandStatus}
            >
              {handleStatusText(value?.commandStatus)}
            </Tag>
          ),

          action: (
            <>
              {value?.paymentStatus === "linkSend" ? (
                <Button className="btn__impayer">Impayé</Button>
              ) : value?.commandStatus === "Completed" ? (
                <Button className="btn__livre">Livré</Button>
              ) : value?.commandStatus !== "Canceled" ? (
                <Button
                  className="btn__reserver"
                  onClick={() => {
                    setSelectedId(value.id);
                    setOpenReserver(true);
                  }}
                >
                  Réserver
                </Button>
              ) : null}
            </>
          ),

          more: (
            <Dropdown
              className="wide-dropdwon"
              content={
                <>
                  <Link
                    to="#"
                    onClick={() => {
                      setOpen(true);
                      setSelectedData(value);
                    }}
                  >
                    {" "}
                    Voir{" "}
                  </Link>

                  <Link
                    to="#"
                    onClick={() => {
                      handleDelete(value.id);
            
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
        }))
    : reservations;

  return (
    <>
      <Row gutter={25}>
        <Col xs={24}>
          <Cards headless>
            <div className="table-responsive">
              <Table
                className="table-striped-rows"
                pagination={{
                  current: meta?.page,
                  pageSize: meta?.pageSize,
                  total: meta?.total,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                }}
                dataSource={dataSource}
                columns={columns}
                onChange={onHandleChange}
                loading={isLoading}
              />
            </div>
          </Cards>
        </Col>
      </Row>
      <ModalDash
        setSelectedId={setSelectedId}
        record={selectedData}
        open={open}
        setOpen={setOpen}
      />
      <ReserveModal
        reservationId={selectedId}
        open={openReserver}
        setOpen={setOpenReserver}
      />
    </>
  );
};

export default Reservations;
