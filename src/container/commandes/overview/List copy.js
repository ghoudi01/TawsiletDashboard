import { Col, Row, Table, Tag, Checkbox, Modal } from "antd";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectListTitle } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReservation,
  getCommands,
  updateReservation,
} from "../../../redux/reservations/reservationSlice";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { Dropdown } from "../../../components/dropdown/dropdown";
import ModalDash from "../../../components/modal/ModalDash";
import FeatherIcon from "feather-icons-react";
import SelectGm from "../../../selectGm/SelectGm";
import AssigneDriver from "./AssigneDriver";
import { sendNotification } from "../../../redux/notifications/notificationSlice";
import { updateDriver } from "../../../redux/User/userSlice";
import Loader from "../../../components/loaderLine/Loader";
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
}) => {
  const location = useLocation();

  const dispatch = useDispatch();
  const reservations = useSelector(
    (state) => state?.reservations?.commands?.nodes
  );
  const meta = useSelector((state) => state?.reservations?.commands?.pageInfo);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const role = useSelector((state) => state?.user?.currentUser?.user_role);
  const filter = useSelector((state) => state?.reservations?.filter);
  const isLoading = useSelector((state) => state?.reservations?.isLoading);
  const currentRole = useSelector(
    (state) => state?.user?.currentUser?.user_role
  );
  const [mappp, setMapp] = useState(reservations);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [userRole, setUserRole] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [ping, setPing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [userId, setUserId] = useState(null);
  const trigerNotifications = useSelector(
    (state) => state?.notification?.trigerNotifications
  );

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
  useEffect(() => {
    if (shouldPrint) {
      printTable();
      setShouldPrint(false);
    }
  }, [shouldPrint]);
  useEffect(() => {
    if (shouldExportPdf) {
      exportToPDF();
      setShouldExportPdf(false);
    }
  }, [shouldExportPdf]);
  useEffect(() => {
    if (shouldExportExcel) {
      exportToExcel();
      setShouldExportExcel(false);
    }
  }, [shouldExportExcel]);

  // const exportToCSV = () => {
  //   const csvData = dataSource.map((item) => ({
  //     ID: item.id,
  //     Pickup_Address: item.pickupAddress,
  //     Delivery_Address: item.deliveryAddress,
  //     Date_Creation: item.dateCreation,
  //     Date_Depart: item.dateDepart,
  //     ID_Client: item.idClient,
  //     Company: item.company,
  //     Payment_Method: item.payType.props.children[0].props.children,
  //     Status: handleStatusText(item.commandStatus),
  //   }));

  //   const csvColumns = Object.keys(csvData[0]);

  //   const csvContent = [
  //     csvColumns.join(","), // Header row
  //     ...csvData.map((item) => csvColumns.map((col) => item[col]).join(",")), // Data rows
  //   ].join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "reservations.csv";
  //   link.style.display = "none";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  const printTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Table Print</title></head><body>"
    );
    printWindow.document.write(
      "<style>@media print { th, td { border: 1px solid black; padding: 0.5rem; } table { border-collapse: collapse; width: 100%; } }</style>"
    );
    printWindow.document.write("<h2>Commandes Table</h2>");

    // Create a copy of the dataSource with only the relevant data
    const printableData = dataSource.map((item) => ({
      ID: item.id,
      Pickup_Address: item.pickupAddress,
      Delivery_Address: item.deliveryAddress,
      Date_Creation: item.dateCreation,
      Date_Depart: item.dateDepart,
      ID_Client: item.idClient.props.children,
      Company: item.company.props.children,
      Payment_Method: item.payType.props.children[0].props.children,
      Price: item.payType.props.children[1].props.children,
      Status: item.commandStatus.props.children,
    }));

    // Create a table for printing
    printWindow.document.write("<table>");
    printWindow.document.write(
      "<tr><th>ID</th><th>Pickup Address</th><th>Delivery Address</th><th>Date Creation</th><th>Date Depart</th><th>ID Client</th><th>Company</th><th>Payment Method</th><th>Prix</th><th>Status</th></tr>"
    );

    printableData.forEach((item) => {
      printWindow.document.write(`<tr>
        <td>${item.ID}</td>
        <td>${item.Pickup_Address}</td>
        <td>${item.Delivery_Address}</td>
        <td>${item.Date_Creation}</td>
        <td>${item.Date_Depart}</td>
        <td>${item.ID_Client}</td>
        <td>${item.Company}</td>
        <td>${item.Payment_Method}</td>
        <td>${item.Price}</td>
        <td>${item.Status}</td>
      </tr>`);
    });

    printWindow.document.write("</table>");

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Commandes Table", 10, 10);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString().replaceAll("/", "-");
    const fileName = `Commandes-${formattedDate}.pdf`;
    const tableColumnNames = [
      "ID",
      "Pickup Address",
      "Delivery Address",
      "Date Creation",
      "Date Depart",
      "ID Client",
      "Company",
      "Payment Method",
      "Price",
      "Status",
    ];

    const tableRows = dataSource.map((item) => {
      return [
        item.id,
        item.pickupAddress,
        item.deliveryAddress,
        item.dateCreation,
        item.dateDepart,
        item.idClient.props.children,
        item.company.props.children,
        item.payType.props.children[0].props.children,
        item.payType.props.children[1].props.children,
        item.commandStatus.props.children,
      ];
    });

    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { overflow: "linebreak" },
      headStyles: { fillColor: [41, 128, 185], textColor: "#fff" },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
        8: { cellWidth: 20 },
        9: { cellWidth: 20 }, // Adjust the width of the Status column here
      },
    });

    doc.save(fileName);
  };

  const exportToExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString().replaceAll("/", "-");
    const fileName = `Commandes-${formattedDate}.xls`;
    const tableColumnNames = [
      "ID",
      "Pickup Address",
      "Delivery Address",
      "Date Creation",
      "Date Depart",
      "ID Client",
      "Company",
      "Payment Method",
      "Price",
    ];

    const tableRows = dataSource.map((item) => [
      item.id,
      item.pickupAddress,
      item.deliveryAddress,
      item.dateCreation,
      item.dateDepart,
      item.idClient.props.children,
      item.company.props.children,
      item.payType.props.children[0].props.children,
      item.payType.props.children[1].props.children,
      item.commandStatus.props.children,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([tableColumnNames, ...tableRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");

    XLSX.writeFile(workbook, fileName);
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
      title: "Adresse de ramassage",
      dataIndex: "pickupAddress",
      render: (text, record, i) => (
        <ProjectListTitle>
          <p>{record?.pickupAddress}</p>
        </ProjectListTitle>
      ),
    },

    {
      id: "deliveryAddress",
      title: "Adressse de dépot",
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
    { id: "deparTime", title: "Heure de depart", dataIndex: "deparTime" },
    { id: "idClient", title: "idClient", dataIndex: "idClient" },
    { id: "company", title: "Société", dataIndex: "company" },
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
    const fetchData = async () => {
      if (currentId && currentRole === "company") {
        try {
          // Assuming setUserRole is an asynchronous function

          const response = await dispatch(
            getCommands({
              pagination: {
                page: 1,
                pageSize: state.pageSize,
              },
              startDate: dateFilter.startDate,
              endDate: dateFilter.endDate,
              reserved: true,
              text: textFilter,
              status: filterStatus,
              user: currentId,
              // sortBy: dateSortBy,
              // deepNumber: 3,
            })
          );

          if (response) {
            setMapp(response.payload.data.data);
          }
        } catch (error) {
          // Handle any errors that might occur during the data fetching
          console.error("Error fetching data:", error);
        }
      } else if (currentUser && currentRole === "agent") {
        try {
          const response = await dispatch(
            getCommands({
              pagination: {
                page: 1,
                pageSize: state.pageSize,
              },
              // deepNumber: 3,
              startDate: dateFilter.startDate,
              endDate: dateFilter.endDate,
              reserved: true,
              text: textFilter,
              status: filterStatus,
              user: currentUser?.company_id?.id,
              // sortBy: dateSortBy,
            })
          );

          if (response) {
            setMapp(response.payload.data.data);
          }
        } catch (error) {
          // Handle any errors that might occur during the data fetching
          console.error("Error fetching data:", error);
        }
      } else {
        try {
          const response = await dispatch(
            getCommands({
              pagination: {
                page: 1,
                pageSize: state.pageSize,
              },
              startDate: dateFilter.startDate,
              endDate: dateFilter.endDate,
              reserved: true,
              text: textFilter,
              // deepNumber: 3,
              status: filterStatus,

              // sortBy: dateSortBy,
            })
          );

          if (response) {
            setMapp(response.payload.data.data);
          }
        } catch (error) {
          // Handle any errors that might occur during the data fetching
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [
    userId,
    dispatch,
    trigerNotifications,
    textFilter,
    filterStatus,
    dateFilter,
    dateSortBy,
    ping,
  ]);

  // state.current,

  useEffect(() => {
    if (reservations) {
      setState((prevState) => ({
        ...prevState,
        data: reservations,
      }));
    }
  }, []);

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };

  const onHandleChange = async (pagination) => {
    try {
      let response = await dispatch(
        //on change Pagination Number
        getCommands({
          pagination: {
            page: pagination.current,
            pageSize: pagination.pageSize,
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
          // sortBy: dateSortBy,
        })
      );
      if (response) {
        setMapp(response.payload.data.data);
      }
      setState((prevState) => ({
        ...prevState,
        current: pagination.current,
        pageSize: pagination.pageSize,
      }));
    } catch (err) {
      throw err;
    }
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
        return "#53B483";
        break;
      case "Arrived":
        return "#53B483";
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
        return "En cours";
        break;
      case "Arrived":
        return "En cours";
        break;
      case "Completed":
        return "Livré";
      default:
        return "";
    }
  };

  const handleActive = ({ status, value }) => {
    const finalStatus = status === "Accepter" ? "Annuler" : "Accepter";

    Modal.confirm({
      title: "Confirm Change",
      content:
        value?.commandStatus ===
        (status === "Accepter" ? "Dispatching" : "Canceled")
          ? "Vous n'avez pas changer le status de cette commande ! veillez verifier votre choix"
          : `Voulez vous changes du ${finalStatus} à ${status}?`,
      okText: "Changer",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        if (
          value?.commandStatus ===
          (status === "Accepter" ? "Dispatching" : "Canceled")
        ) {
        } else {
          if (status === "Annuler") {
            dispatch(
              updateReservation({
                id: value?.id,

                body: {
                  data: {
                    commandStatus: "Pending",
                    company_id: null,
                    driver_id: null,
                  },
                },
              })
            ).then(() => {
              dispatch(
                updateDriver({
                  id: value?.driver_id?.data?.id,
                  isFree: true,
                })
              );
              dispatch(
                sendNotification({
                  id:
                    role === "owner" || role === "admin"
                      ? value?.company_id?.data?.id
                      : 227,
                  title: "Une commande a été anuulé.",
                  sendFrom: {
                    id: currentUser?.id,
                    name: currentUser?.name,
                  },
                  command: value?.id,
                  notification_type: "canceled",
                  types: ["notification", "email"],
                  smsCore: `${currentUser?.name}  a annulé la commande numéro : ${value?.refNumber}`,
                  notificationCore: "vous avez une notification",
                  saveNotification: true,
                  template_id: "d-8b266aac7fd64f73bab6ee0c80df8dbd",
                  dynamicTemplateData: {
                    commandeid: value?.id,
                  },
                })
              );
              setPing(!ping);
            });
          } else {
            dispatch(
              updateReservation({
                id: value?.id,

                body: {
                  data: {
                    commandStatus: "Dispatching",
                  },
                },
              })
            ).then(() => setPing(!ping));
          }
        }
      },
      onCancel() {},
    });
  };
  const [statusselected, setstatusselected] = useState();
  const handleDelete = (id, value) => {
    setSelectedId(id);

    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this item?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        {
          dispatch(
            updateDriver({
              id: value?.driver_id?.data?.id,
              isFree: true,
            })
          );
          dispatch(deleteReservation(id)).then(() => setPing(!ping));
        }
      },
      onCancel() {
        setSelectedId(null);
      },
    });
  };
  console.log("🚀 ~ mappp:", mappp);
  const dataSource = reservations.length
    ? reservations?.map((value, i) => ({
        key: value.id,
        id: value.id,
        pickupAddress: value?.pickUpAddress?.Address?.substring(0, 30) + "...",
        deliveryAddress:
          value?.dropOfAddress?.Address?.substring(0, 30) + "...",
        dateCreation: value?.createdAt,
        dateDepart: value?.departDate,
        deparTime: value?.deparTime?.slice(0, 5),
        idClient: (
          <p className="no-margin" style={{ color: "blue" }}>
            {" "}
            {value?.client_id?.data?.id}
          </p>
        ),
        company: (
          <p className="no-margin" style={{ color: "blue" }}>
            {" "}
            {value?.company_id?.name}
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
        action:
          value?.commandStatus === "Completed" ? null : (
            <SelectGm
              options={selectOptions}
              placeholder={
                value?.commandStatus === "Canceled" ? "Annuler" : "Accepter"
              }
              onSelect={(e) => {
                setstatusselected(e.value);
                handleActive({
                  status: e.value,
                  value: value,
                });
              }}
              active={value?.commandStatus === "Canceled" ? true : false}
            />
          ),
        more: (
          <Dropdown
            className="wide-dropdwon"
            content={
              <>
                {value?.commandStatus === "Dispatching" && (
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
                onChange={onHandleChange}
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
