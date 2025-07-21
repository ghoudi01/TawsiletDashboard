import { Col, Row, Table, Tag, Checkbox, Modal } from "antd";
import "jspdf-autotable";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProjectListTitle } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReservation,
  getCommands,
  updateReservation,
} from "../../../redux/reservations/reservationSlice";
import { Dropdown } from "../../../components/dropdown/dropdown";
import ModalDash from "../../../components/modal/ModalDash";
import FeatherIcon from "feather-icons-react";
import AssigneDriver from "./AssigneDriver";
import { sendNotification } from "../../../redux/notifications/notificationSlice";
import { updateDriver } from "../../../redux/User/userSlice";
import Loader from "../../../components/loaderLine/Loader";
import CommandStatus from "../../../utility/enums/commandStatus";
import { useHistory } from "react-router-dom";
const Reservations = ({
  textFilter,
  filterStatus,
  dateFilter,
  dateSortBy,
  shouldPrint,
  setShouldPrint,
  setShouldExportPdf,
  shouldExportPdf,
  setShouldExportExcel,
  shouldExportExcel,
  
  meta,
  onHandlePageChange,
}) => {
  const dispatch = useDispatch();
  // const reservations = useSelector(
  //   (state) => state?.reservations?.commands?.nodes
  // );
  // const meta = useSelector((state) => state?.reservations?.commands?.pageInfo);
  const reservations = useSelector((state) => state?.reservations?.commands?.data);
console.log("reservations",reservations.length)
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const role = useSelector((state) => state?.user?.currentUser?.user_role);
  const isLoading = useSelector((state) => state?.reservations?.isLoading);
  const currentRole = useSelector(
    (state) => state?.user?.currentUser?.user_role
  );
  const [mappp, setMapp] = useState(reservations);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [openAdd, setOpenAdd] = useState(false);
  const [ping, setPing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const selectOptions = [
    { value: "Accepter", label: "Accepter" },
    { value: "Annuler", label: "Annuler" },
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
  const onCancel = () => {
    setOpenAdd(false);
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

  const history = useHistory();

  const handleRowClick = (record) => {
    return {
      onClick: () => {
        history.push(`/admin/details/${record.key}`); // Navigate to the details page with the id as a parameter
      },
    };
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
      title: "destination",
      dataIndex: "pickupAddress",
      render: (text, record, i) => (
        <ProjectListTitle>
          <p>{record?.pickupAddress}</p>
        </ProjectListTitle>
      ),
    },

    {
      id: "deliveryAddress",
      title: "dépot",
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

  
    { id: "idClient", title: "Client", dataIndex: "idClient" ,},
    { id: "driver", title: "driver", dataIndex: "driver" },
    { id: "payType", title: "Methode de paiemant", dataIndex: "payType" },
    // { id: "action", title: "", dataIndex: "action" },
    {
      title: "...",
      dataIndex: "more",
      key: "more",
    },
    {
      id: "commandStatus",
      title: "Status",
      dataIndex: "commandStatus",
      fixed: "right",
      width: 100,
    },
  ];

  const [state, setState] = useState({
    data: reservations,
    current: 1,
    pageSize: 10,
  });

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };

  // Handle status colors
  const handleStatus = (value) => {
    switch (value) {
      case CommandStatus.PENDING:
      case CommandStatus.DISPATCHED_TO_PARTNER:
        return "#9E57E5";
      case CommandStatus.CANCELED_BY_CLIENT:
      case CommandStatus.CANCELED_BY_PARTNER:
        return "#F3935D";
      case CommandStatus.ASSIGNED_TO_DRIVER:
      case CommandStatus.DRIVER_ON_ROUTE_TO_PICKUP:
      case CommandStatus.ARRIVED_AT_PICKUP:
      case CommandStatus.PICKED_UP:
      case CommandStatus.ON_ROUTE_TO_DELIVERY:
      case CommandStatus.ARRIVED_AT_DELIVERY:
        return "#53B483";
      case CommandStatus.DELIVERED:
      case CommandStatus.COMPLETED:
        return "#59B4D1";
      case CommandStatus.FAILED_PICKUP:
      case CommandStatus.FAILED_DELIVERY:
        return "#FF5B5B";
      default:
        return "gray";
    }
  };

  // Handle status text
  const handleStatusText = (value) => {
    switch (value) {
      // case CommandStatus.PENDING:
      //   return "En attente";
      case CommandStatus.CANCELED_BY_CLIENT:
      case CommandStatus.CANCELED_BY_PARTNER:
        return "Annulé";
      case CommandStatus.DISPATCHED_TO_PARTNER:
        return "En attente";
      case CommandStatus.ASSIGNED_TO_DRIVER:
        return "Assigné au conducteur";
      case CommandStatus.DRIVER_ON_ROUTE_TO_PICKUP:
        return "En route pour le ramassage";
      case CommandStatus.ARRIVED_AT_PICKUP:
        return "Arrivé au ramassage";
      case CommandStatus.PICKED_UP:
        return "Ramassé";
      case CommandStatus.ON_ROUTE_TO_DELIVERY:
        return "En route pour la livraison";
      case CommandStatus.ARRIVED_AT_DELIVERY:
        return "Arrivé à la livraison";
      case CommandStatus.DELIVERED:
        return "Livré";
      case CommandStatus.COMPLETED:
        return "Terminé";
      case CommandStatus.FAILED_PICKUP:
        return "Échec du ramassage";
      case CommandStatus.FAILED_DELIVERY:
        return "Échec de la livraison";
      default:
        return "";
    }
  };
  const updateTheReservation = (record) => {
    dispatch(
      updateReservation({
        id: record?.documentId,
        data: {
          commandStatus: "Pending",
          company_id: null,
          driver_id: null,
        },
      })
    ).then(() => {
      dispatch(
        getCommands({
          Pagination: { page: 1, pageSize: 10 },
          currentUser,
        })
      );
      if (record?.driver_id?.documentId) {
        dispatch(
          updateDriver({
            id: record?.driver_id?.documentId,
            isFree: true,
          })
        );
      }

      // dispatch(
      //   sendNotification({
      //     id:
      //       role === "owner" || role === "admin"
      //         ? record?.company_id?.data?.id
      //         : 227,
      //     title: "Une commande a été anuulé.",
      //     sendFrom: {
      //       id: currentUser?.id,
      //       name: currentUser?.name,
      //     },
      //     command: record?.id,
      //     notification_type: "canceled",
      //     types: ["notification", "email"],
      //     smsCore: `${currentUser?.name}  a annulé la commande numéro : ${record?.refNumber}`,
      //     notificationCore: "vous avez une notification",
      //     saveNotification: true,
      //     template_id: "d-8b266aac7fd64f73bab6ee0c80df8dbd",
      //     dynamicTemplateData: {
      //       commandeid: record?.id,
      //     },
      //   })
      // );
      setPing(!ping);
    });
  };
 
  const [statusselected, setstatusselected] = useState();
   

  const dataSource = reservations?.length
    ? reservations?.map((value, i) => ({
        key: value.documentId,
        id: value.id,
        pickupAddress: value?.pickUpAddress?.Address?.substring(0, 30) + "...",
        deliveryAddress:
          value?.dropOfAddress?.Address?.substring(0, 30) + "...",
        dateCreation: new Date(value?.createdAt)
          .toLocaleDateString("en-US")
          .replaceAll("/", "-"),
        dateDepart: value?.departDate,
        deparTime: value?.deparTime?.slice(0, 5),
        idClient: (
          <p className="no-margin" style={{ color: "blue" }}>
            {value?.client?.firstName} {value?.client?.lastName}
          </p>
        ),
        driver: (
          <p className="no-margin" style={{ color: "blue" }}>
            {" "}
            {value?.driver?.firstName} {value?.driver?.lastName}
          </p>
        ),
        payType: (
          <div className="table_paytype">
            <label style={{ display: "none" }} htmlFor="">
              {value?.payType}
            </label>
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
              backgroundColor: `${handleStatus(value?.commandStatus) + "50"}`,
              color: `${handleStatus(value?.commandStatus)}`,
            }}
            color={handleStatus(value?.commandStatus)}
            className={value?.commandStatus}
          >
            {handleStatusText(value?.commandStatus)}
          </Tag>
        ),
        // action:
        //   value?.commandStatus === "Completed" ? null : (
        //     <SelectGm
        //       options={selectOptions}
        //       placeholder={
        //         value?.commandStatus === "Canceled" ? "Annuler" : "Accepter"
        //       }
        //       onSelect={(e) => {
        //         setstatusselected(e.value);
        //         handleActive({
        //           status: e.value,
        //           value: value,
        //         });
        //       }}
        //       active={value?.commandStatus === "Canceled" ? true : false}
        //     />
        //   ),
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
                {value?.commandStatus === "Dispatched_to_partner" && (
                  <Link
                    to="#"
                    onClick={() => {
                      setOpenAdd(true);
                      setSelectedData(value);
                    }}
                  >
                    {" "}
                    Assigner Chauffeur
                  </Link>
                )}

                {value?.commandStatus === "Dispatched_to_partner" && (
                  <Link
                    style={{ color: "red" }}
                    onClick={() => updateTheReservation(value)}
                  >
                    Refuse la commande
                  </Link>
                )}
                {/* {role === "owner" && (
                  <Link to="#" onClick={() => handleDelete(value.id, value)}>
                    Supprimer
                  </Link>
                )} */}
              </>
            }
          >
            <Link to="#">
              <FeatherIcon icon="more-horizontal" size={18} />
            </Link>
          </Dropdown>
        ),
      }))
    : [];

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
                  current: meta?.page,
                  pageSize: meta?.pageSize,
                  total: meta?.total,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                }}
                dataSource={dataSource}
                columns={columns}
                onChange={onHandlePageChange}
                onRow={handleRowClick}
                rowClassName={() => "clickable-row"}
                // loading={isLoading}
              />
            </div>
          </Cards>
        </Col>
      </Row>
      {open ? (
        <ModalDash
          filter={{
            pagination: {
              current: meta?.current,
              pageSize: meta?.pageSize,
            },
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate,
            text: textFilter,
            status: filterStatus,
            reserved: true,
            user:
              currentRole === "company"
                ? currentId
                : currentRole === "agent"
                ? currentUser?.company_id?.id
                : "",
            // deepNumber: 3,
            sortBy: dateSortBy,
          }}
          record={selectedData}
          open={open}
          setOpen={setOpen}
          setSelectedId={setSelectedId}
          setPing={setPing}
          ping={ping}
        />
      ) : null}

      {openAdd ? (
        <AssigneDriver
          record={selectedData}
          visible={openAdd}
          onCancel={onCancel}
          setPing={setPing}
          ping={ping}
        />
      ) : null}
    </>
  );
};

export default Reservations;
