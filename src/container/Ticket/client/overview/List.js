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

import { useDispatch, useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";

import { Dropdown } from "../../../../components/dropdown/dropdown";
import OverviewModal from "../OverviewModal";
import DeleteModal from "../DeleteModal";
import SelectGm from "../../../../selectGm/SelectGm";
import Loader from "../../../../components/loaderLine/Loader";
import { Cards } from "../../../../components/cards/frame/cards-frame";
import { useHistory } from "react-router-dom";
// Update imports to use ticket-related actions
import {
  getTickets,
  updateTicket,
  deleteTicket,
} from "../../../../redux/tickets/ticketSlice";
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
  const tickets = useSelector((state) => state?.tickets?.tickets?.data); // Fetch tickets from Redux store
  const meta = useSelector((state) => state?.ticket?.meta); // Pagination metadata for tickets
  const isLoading = useSelector((state) => state?.ticket?.isLoading); // Loading state for tickets
  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(false);
  const [modalId, setmodalId] = useState();

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { value: "Activer", label: "Activer" },
    { value: "Désactiver", label: "Désactiver" },
  ]);
  // Function to get French translations


  const getActionClass = (action) => {
    switch (action) {
      case "resolved":
        return "sl-value resolved";
      case "open":
        return "sl-value open";
      case "inProgress":
        return "sl-value inProgress";
      default:
        return ""; // Default class if no match
    }
  };

  const getActionStyle = (action) => {
    switch (action) {
      case "resolved":
        return { color: "green" };
      case "open":
        return { color: "red" };
      case "inProgress":
        return { color: "rgb(56, 21, 255)" };
      default:
        return {}; // Default style if no match
    }
  };
  const getLabelInFrench = (value) => {
    switch (value) {
      case "resolved":
        return "Résolu"; // French translation for "Resolved"
      case "open":
        return "Ouvert"; // French translation for "Open"
      case "inProgress":
        return "En Cours"; // French translation for "In Progress"
      default:
        return value; // Fallback to the original value if no translation is found
    }
  };
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = tickets?.map((value) => value.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };
  const history = useHistory();
  const handleRowClick = (record) => {
    return {
      onClick: (e) => {
        e.stopPropagation();
        history.push(`/admin/detailsTicket/${record.id}`); // Navigate to the details page with the id as a parameter
      },
    };
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
      getTickets({
        page: 1,
        pageSize: 10,
        text: text,
        user_role: "client"
      })
    ); // Dispatch the action to fetch tickets
    setState({ data: tickets, current: 1, pageSize: 10 });
  }, [dispatch, text]);

  const columns = [
    // {
    //   title: () => (
    //     <Checkbox
    //       onChange={(e) => handleSelectAll(e.target.checked)}
    //       indeterminate={
    //         selectedRows?.length > 0 && selectedRows?.length < tickets?.length
    //       }
    //       checked={selectedRows?.length === tickets?.length}
    //     />
    //   ),
    //   dataIndex: "refNumber",
    //   key: "checkbox",
    //   render: (refNumber) => (
    //     <Checkbox
    //       onChange={(e) => handleSelectRow(e.target.checked, refNumber)}
    //       checked={selectedRows.includes(refNumber)}
    //     />
    //   ),
    // },

    {
      id: "refNumber",
      title: "Command N°",
      dataIndex: "refNumber",
      render: (text, record) => (
        <ProjectListTitle>
          <Link to={`/admin/details/${record?.command?.documentId}`}>
            {" "}
            <span className="date-finished">#{record?.command?.refNumber}</span>
          </Link>
        </ProjectListTitle>
      ),
    },
    {
      id: "title",
      title: "Title",
      dataIndex: "title",
      render: (text, record) => (
        <ProjectListTitle>
          <span className="date-finished">{record?.title}</span>
        </ProjectListTitle>
      ),
    },
    {
      id: "description",
      title: "Description",
      dataIndex: "description",
      render: (text, record) => (
        <ProjectListTitle>
          <span
            className="date-finished"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
            }}
          >
            {record?.description}
          </span>
        </ProjectListTitle>
      ),
    },
    // {
    //   id: "attachment",
    //   title: "Attachment",
    //   dataIndex: "attachment",
    //   render: (text, record) => {
    //     const attachment = record?.attachment;
    //     if (!attachment) {
    //       return <span>No attachment</span>;
    //     }

    //     // Check if the attachment is an image or video
    //     const isImage = attachment.type?.startsWith("image");
    //     const isVideo = attachment.type?.startsWith("video");

    //     if (isImage) {
    //       return (
    //         <img
    //           src={attachment.url}
    //           alt="Attachment"
    //           style={{ width: "100px", height: "auto" }}
    //         />
    //       );
    //     } else if (isVideo) {
    //       return (
    //         <video controls style={{ width: "100px", height: "auto" }}>
    //           <source src={attachment.url} type={attachment.type} />
    //           Your browser does not support the video tag.
    //         </video>
    //       );
    //     } else {
    //       return <span>Unsupported attachment type</span>;
    //     }
    //   },
    // },
    {
      id: "client",
      title: "Client",
      dataIndex: "client",
      render: (text, record) => (
        <ProjectListTitle>
          <span className="date-finished">
            {record?.user?.firstName || "N/A"}
          </span>{" "}
          <span className="date-finished">
            {record?.user?.lastName || "N/A"}
          </span>
        </ProjectListTitle>
      ),
    },
    {
      id: "Numéro de téléphone",
      title: "Numéro de téléphone",
      dataIndex: "Numéro de téléphone",
      render: (text, record) => (
        <ProjectListTitle>
          <span className="date-finished">{record?.user?.phoneNumber}</span>
        </ProjectListTitle>
      ),
    },
    {
      id: "createdAt",
      title: "Date de Création",
      dataIndex: "createdAt",
      render: (text, record) => (
        <ProjectListTitle>
          <span className="date-finished">
            {new Date(record?.createdAt).toLocaleDateString("en-US")}
          </span>
        </ProjectListTitle>
      ),
    },
    {
      id: "action",
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
 
        <ProjectListTitle>
          <span
            className={`date-finished ${getActionClass(record?.action)}`}
            style={getActionStyle(record?.action)}
          >
            {getLabelInFrench(record?.action)} 
          </span>
        </ProjectListTitle>
      ),
    },
  ];

  const [state, setState] = useState({
    data: tickets,
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (tickets) {
      setState((prevState) => ({
        ...prevState,
        data: tickets,
      }));
    }
  }, [tickets]);

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };

  const onHandleChange = (pagination) => {
    dispatch(
      getTickets({
        page: pagination.current,
        pageSize: pagination.pageSize,
        text: text,
        user_role: "client"
      })
    );
    setState((prevState) => ({
      ...prevState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const dataSource =
    tickets?.map((value) => ({
      key: value.id,
      id: value.documentId,
      title: value.title,
      command: value.command,
      description: value.description,
      attachment: value.attachment,
      client: value.client,
      createdAt: value.createdAt,
      action: value.action,
      user: value.user,
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
                onRow={handleRowClick}
                rowClassName={() => "clickable-row"}
              />
            </div>
          </Cards>
        </Col>
      </Row>
      <OverviewModal open={open} setOpen={setOpen} modalId={modalId} />
    </>
  );
};

export default Client;
