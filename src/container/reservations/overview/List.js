import { Col, Row, Table, Checkbox } from "antd";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import { ProjectListTitle } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import {
  getReservations,
  updateReservation,
} from "../../../redux/reservations/reservationSlice";
import ModalDash from "../../../components/modal/ModalDash";
import ReserveModal from "./ReserveModal";
import Loader from "../../../components/loaderLine/Loader";
import { transformReservations } from "../utils/transformReservations";
import { useHistory } from "react-router-dom";
const Reservations = ({
  dateSortBy,
  dateFilter,
  shouldPrint,
  setShouldPrint,
  setShouldExportPdf,
  shouldExportPdf,
  setShouldExportExcel,
  shouldExportExcel,
  filters,
  setPing,
  ping,
  trashView,
  reservations,
}) => {
  console.log("🚀 ~ reservations:", reservations);

  const dispatch = useDispatch();
  const meta = useSelector(
    (state) => state?.reservations?.reservations?.pageInfo
  );
  const isLoading = useSelector((state) => state?.reservations?.isLoading);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openReserver, setOpenReserver] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [selectedId, setSelectedId] = useState(null);

  const handleStatus = (value) => {
    switch (value) {
      case "Pending":
        return "#9E57E5";
      case "Canceled_by_partner":
        return "#F3935D";
      case "Canceled_by_client":
        return "#F36355";
      case "Dispatching":
        return "#53B483";
      case "Processing":
        return "green";
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
      case "Canceled_by_partner":
        return "Annulés";
      case "Canceled_by_client":
        return "Annulés par client";
      case "Dispatching":
        return "En cours";
      case "Processing":
        return "En traitement";
      case "Completed":
        return "Livré";
      default:
        return "";
    }
  };

  const [dataSource, setDataSource] = useState(
    transformReservations(
      reservations,
      handleStatus,
      handleStatusText,
      trashView,
      setSelectedId,
      setOpenReserver,
      dispatch,
      updateReservation,
      getReservations,
      setOpen,
      setSelectedData
    )
  );

  useEffect(() => {
    setDataSource(
      transformReservations(
        reservations,
        handleStatus,
        handleStatusText,
        trashView,
        setSelectedId,
        setOpenReserver,
        dispatch,
        updateReservation,
        getReservations,
        setOpen,
        setSelectedData
      )
    );
  }, [dispatch, reservations, ping, trashView]);

  // const selectOptions = [
  //   { value: "Activer", label: "Activer" },
  //   { value: "Désactiver", label: "Désactiver" },
  // ];

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

  const history = useHistory();

  const handleRowClick = (record) => {
    return {
      onClick: () => {
        history.push(`/admin/details/${record.key}`); // Navigate to the details page with the id as a parameter
      },
    };
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
    { id: "deparTime", title: "Heure de depart", dataIndex: "deparTime" },
    { id: "idClient", title: "Client", dataIndex: "idClient" },

    { id: "payType", title: "Methode de paiemant", dataIndex: "payType" },

    // { id: "action", title: "", dataIndex: "action" },

    {
      title: "",
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
          page: pagination?.current,
          pageSize: pagination?.pageSize,
        },
        filters,
      })
    );
    setState((prevState) => ({
      ...prevState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

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
                onRow={handleRowClick}
                rowClassName={() => "clickable-row"}
                // loading={isLoading}
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
        ping={ping}
        setPing={setPing}
      />
    </>
  );
};

export default Reservations;
