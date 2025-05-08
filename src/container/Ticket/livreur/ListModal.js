import { Col, Pagination, Row, Table, Button, Tag, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectListTitle } from "./style";

import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";


import OverviewModal from "./OverviewModal";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Dropdown } from "../../../components/dropdown/dropdown";

const ListModal = ({ text, user }) => {
  const dispatch = useDispatch();
  const reservations = useSelector((state) => state.reservations.reservations?.nodes);
  const filter = useSelector((state) => state?.reservations?.filter);

  const [open, setOpen] = useState(false);
  const [modalId, setmodalId] = useState();
  // const users = allUsers.filter(
  //   (user) => user?.__component === "section.client"
  // );

  const [selectedRows, setSelectedRows] = useState([]);

  //   const handleSelectAll = (checked) => {
  //     if (checked) {
  //       const allIds = users.map((value) => value.id);
  //       setSelectedRows(allIds);
  //     } else {
  //       setSelectedRows([]);
  //     }
  //   };

  const handleSelectRow = (checked, id) => {
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows?.filter((rowId) => rowId !== id)
      );
    }
  };

  const columns = [
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
      title: "Client email",
      dataIndex: "Client email",
      key: "Client email",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.name}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Date",
      title: "Date",
      dataIndex: "Date",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.date}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Payment",
      title: "Payment",
      dataIndex: "Payment",
      render: (text, record) => (
        <span className="date-finished">{record?.paytype}</span>
      ),
    },
    { id: "commandStatus", title: "Status", dataIndex: "commandStatus" },
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
 
  // useEffect(() => {
  //   dispatch(getReservations({ user_id: user?.id })); // Dispatch the action to get reservations
  // }, [user]);
  // Fetch users when component mounts
  useEffect(() => {
    if (reservations) {
      setState((prevState) => ({
        ...prevState,
        data: reservations,
      }));
    }
  }, [reservations]);

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };
  const filteredData = reservations
    // ?.filter((el) => el?.client_id?.data?.id === user?.id)
    // ?.filter((value) => {
    //   const commandStatus = value?.commandStatus;
    //   return (
    //     commandStatus &&
    //     commandStatus.toLowerCase().includes(filter?.toLowerCase())
    //   );
    // });

  const onHandleChange = (pagination) => {
    setState((prevState) => ({
      ...prevState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };
  const handleStatus = (value) => {
    switch (value) {
      case "Pending":
        return "rgb(158, 87, 229)";
        break;
      case "Canceled":
        return "darkorange";
        break;
      case "Dispatching":
        return "rgb(83, 180, 131)";
        break;
      case "Processing":
        return "darkgreen";
        break;
      case "Completed":
        return "darkblue";
      default:
        return "darkgray";
    }
  };

  const dataSource =
    filteredData.map((value) => ({
      key: value.id,
      id: value.id,
      pickupAddress: value?.pickUpAddress?.Address,
      deliveryAddress: value?.dropOfAddress?.Address,
      date: value?.departDate,
      paytype: value?.payType,
      name: value?.client_id?.data?.email,
      commandStatus: (
        <Tag
          color={handleStatus(value?.commandStatus)}
          className={value?.commandStatus}
        >
          {value?.commandStatus}
        </Tag>
      ),
      more: (
        <Dropdown
          className="wide-dropdwon"
          content={
            <>
              <Link to="#">View</Link>
              <Link to="#">Edit</Link>
              <Link to="#">Delete</Link>
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
          <Cards headless>
            <div className="table-responsive">
              <Table
                pagination={{
                  current: state.current,
                  pageSize: state.pageSize,
                  showSizeChanger: true,
                  onShowSizeChange: onShowSizeChange,
                }}
                dataSource={dataSource}
                columns={columns}
                onChange={onHandleChange}
              />
            </div>
          </Cards>
        </Col>
      </Row>
      <OverviewModal open={open} setOpen={setOpen} modalId={modalId} />
    </>
  );
};

export default ListModal;
