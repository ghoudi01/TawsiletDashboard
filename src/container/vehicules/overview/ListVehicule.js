import { Col, Row, Table, Modal, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import ViewVehicule from "./ViewVehicule";
import UpdateVehicule from "./UpdateVehicule";
import { ProjectListTitle } from "../style";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  deleteVehicule,
  getVehicule,
} from "../../../redux/vehicule/vehiculeSlice";
import { Dropdown } from "../../../components/dropdown/dropdown";
import valid from "../../../static/img/Glyph.svg";
import invalid from "../../../static/img/refuse.svg";
import wait from "../../../static/img/wait.svg";
import { current } from "@reduxjs/toolkit";
import ChangeCompany from "./ChangeCompany";
import Loader from "../../../components/loaderLine/Loader";
const Vehicules = ({
  textFilter,
  filterStatus,
  shouldPrint,
  setShouldPrint,
  setShouldExportPdf,
  shouldExportPdf,
  setShouldExportExcel,
  shouldExportExcel,
}) => {
  const [selectedId, setSelectedId] = useState();
  const [selectedata, setSelecteData] = useState();
  const meta = useSelector((state) => state?.vehicules?.meta);
   const dispatch = useDispatch();

  const vehicules = useSelector((state) => state?.vehicules?.vehicules);

  const [AddModalVisible, setAddModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [isViewModalVisible, setViewModalVisible] = useState(false);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentuser = useSelector((state) => state?.user?.currentUser);

  const currentRole = useSelector(
    (state) => state?.user?.currentUser?.user_role
  );
  const [userRole, setUserRole] = useState(null);
  const [showCompanyChanger, setShowCompanyChanger] = useState(false);

 
  const isLoading = useSelector((state) => state?.vehicules?.isLoading);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
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
  const handleSelectRow = (checked, id) => {
    if (checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, id]);
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((rowId) => rowId !== id)
      );
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    setState((prevState) => ({
      ...prevState,
      current,
      pageSize,
    }));
  };
  const onHandleChange = (pagination) => {
    // You can create pagination in here
    setState((prevState) => ({
      ...prevState,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };
  const [state, setState] = useState({
    data: vehicules,
    current: 1,
    pageSize: 10,
  });
  const [ping, setPing] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (currentId && currentRole === "company") {
        try {
          // Assuming setUserRole is an asynchronous function

          const response = await dispatch(
            getVehicule({
              text: textFilter,
              status: filterStatus,
              user_id: currentId,
              deepNumber: 3,
            })
          );
          // console.log(response.payload.data.data, "response");
          // if (response) {
          //   setMapp(response.payload.data.data);
          // }
        } catch (error) {
          // Handle any errors that might occur during the data fetching
          console.error("Error fetching data:", error);
        }
      } else if (currentId && currentRole === "agent") {
        try {
          // Assuming setUserRole is an asynchronous function

          const response = await dispatch(
            getVehicule({
              text: textFilter,
              status: filterStatus,
              user_id: currentuser?.company_id?.id,
              deepNumber: 3,
            })
          );
          // console.log(response.payload.data.data, "response");
          // if (response) {
          //   setMapp(response.payload.data.data);
          // }
        } catch (error) {
          // Handle any errors that might occur during the data fetching
          console.error("Error fetching data:", error);
        }
      } else {
        try {
          await setUserRole(currentId); // Assuming setUserRole is an asynchronous function

          dispatch(
            getVehicule({
              status: filterStatus,
              text: textFilter,
            })
          );
          // console.log(response.payload.data.data, "response");
          // if (response) {
          //   setMapp(response.payload.data.data);
          // }
        } catch (error) {
          // Handle any errors that might occur during the data fetching
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();

    setState({ data: vehicules, current: 1, pageSize: 10 });
  }, [currentId, dispatch, textFilter, filterStatus, ping]);
  // console.log(mappp, "mappppp");
  // useEffect(() => {
  //   if (vehicules) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       data: vehicules,
  //     }));
  //   }
  // }, [vehicules]);

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

  const printTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Table Print</title></head><body>"
    );
    printWindow.document.write(
      "<style>@media print { th, td { border: 1px solid black; padding: 0.5rem; } table { border-collapse: collapse; width: 100%; } }</style>"
    );
    printWindow.document.write("<h2>Reservations Table</h2>");

    // Create a copy of the dataSource with only the relevant data
    const printableData = dataSource.map((item) => ({
      ID: item.id,
      marque: item.mark,
      model: item.model,
      annees: item.year,
      matriculation: item.matriculation,
      dateAssurance: item.assuranceDate,
      validation: item.validation,
      company_id: item.company_id,
    }));

    // Create a table for printing
    printWindow.document.write("<table>");
    printWindow.document.write(
      "<tr><th>ID</th><th>marque</th><th>model</th><th>annees</th><th>matriculation</th><th>date Assurance</th><th>Validation</th></tr>"
    );

    printableData.forEach((item) => {
      printWindow.document.write(`<tr>
        <td>${item.ID}</td>
        <td>${item.marque}</td>
        <td>${item.model}</td>
        <td>${item.annees}</td>
        <td>${item.matriculation}</td>
        <td>${item.dateAssurance}</td>
        <td>${item.validation}</td>
        <td>${item.company_id}</td>
   
      
      </tr>`);
    });

    printWindow.document.write("</table>");

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Véhicules Table", 10, 10);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString().replaceAll("/", "-");
    const fileName = `Vehicules-${formattedDate}.pdf`;
    const tableColumnNames = [
      "ID",
      "marque",
      "model",
      "Année",
      "matriculation",
      "Date assurance",
      "Validation",
      "company",
    ];

    const tableRows = dataSource.map((item) => {
      return [
        item.id,
        item.mark,
        item.model,
        item.year,
        item.matriculation,
        item.assuranceDate,
        item.validation,
        item.company,
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
      },
    });

    doc.save(fileName);
  };

  const exportToExcel = () => {
    const tableColumnNames = [
      "ID",
      "marque",
      "model",
      "Année",
      "matriculation",
      "Date assurance",
      "Validation",
      "company",
      "name",
    ];
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString().replaceAll("/", "-");
    const fileName = `Vehicules-${formattedDate}.xls`;
    const tableRows = dataSource.map((item) => [
      item.id,
      item.mark,
      item.model,
      item.year,
      item.matriculation,
      item.assuranceDate,
      item.validation,
      item.company,
      item.name,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([tableColumnNames, ...tableRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "vehicules");

    XLSX.writeFile(workbook, fileName);
  };
  const columns = [
    {
      title: () => (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < vehicules?.length
          }
          checked={selectedRows.length === vehicules?.length}
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
      id: "pickupAddress",
      title: "Marque.véhicule",
      dataIndex: "pickupAddress",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.mark}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "deliveryAddress",
      title: "Modèle.véhicule",
      dataIndex: "deliveryAddress",

      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.model}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Année",
      title: "Année",
      dataIndex: "date",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.year}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Immatriculation",
      title: "Immatriculation",
      dataIndex: "clientId",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.matriculation}</p>
        </ProjectListTitle>
      ),
    },

    currentuser?.user_role === "owner"
      ? {
          id: "Company",
          title: "Société",
          dataIndex: "Company",
          render: (text, record) => (
            <ProjectListTitle>
              <p>{record?.company}</p>
            </ProjectListTitle>
          ),
        }
      : {},

    {
      id: "assuranceDate",
      title: "Date d'assurance",
      dataIndex: "assuranceDate",
      render: (text, record) => (
        <ProjectListTitle>
          <p>{record?.assuranceDate}</p>
        </ProjectListTitle>
      ),
    },
    // {
    // id: "assuranceDate",
    // title: "assuranceDate",
    // dataIndex: "assuranceDate",
    // },
    // {
    //   id: "Status",
    //   title: "Status",
    //   dataIndex: "Status",
    // },
    {
      title: "",

      dataIndex: "action",
      key: "action",
    },
    {
      title: "",
      dataIndex: "more",
      key: "more",
    },
  ];

  const showModalView = () => {
    setViewModalVisible(true);
  };

  // const showModalAdd = () => {
  //   setAddModalVisible(true);
  // };
  const showModalUpdate = () => {
    setUpdateModalVisible(true);
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  const dataSource = vehicules?.map((value) => {
    return {
      key: value.id,
      id: value.id,
      mark: value?.mark,
      model: value?.model,
      year: value?.year,
      matriculation: value?.matriculation,
      assuranceDate: value?.assuranceDate,
      validation: value?.validation?.validation_state,
      company: value?.company?.name ? value?.company?.name : "",
      // name:
      //   value?.company_id.data !== null
      //     ? value?.company_id?.data
      //         ?.name
      //     : "",
      action: (
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          {value.validation?.validation_state === "waiting" ? (
            <img src={wait} className="validation_icon_driver" />
          ) : value.validation?.validation_state === "valid" ? (
            <img src={valid} className="validation_icon_driver" />
          ) : (
            <img src={invalid} className="validation_icon_driver" />
          )}
        </div>
      ),
      more: (
        <Dropdown
          className="wide-dropdwon"
          content={
            <>
              <Link
                onClick={() => {
                  showModalView();
                  setSelectedId(value?.id);
                  setSelecteData(value);
                }}
                type="1"
                size="default"
                to="#"
              >
                Voir
              </Link>
              {currentRole === "owner" && (
                <Link
                  onClick={() => {
                    setShowCompanyChanger(!showCompanyChanger);
                    setSelectedId(value?.id);
                    setSelecteData(value);
                  }}
                  type="1"
                >
                  Change société
                </Link>
              )}

              <Link
                onClick={() => {
                  showModalUpdate();
                  setSelectedId(value?.id);
                  setSelecteData(value);
                }}
                type="1"
              >
                Modifier
              </Link>

              {(currentRole === "owner" || currentRole === "admin") && (
                <Link
                  to="#"
                  onClick={() => {
                    Modal.confirm({
                      title: `Supprimer Vehicule N° ${value?.id} `,
                      content:
                        "Etes vous sure de vouloir supprimer cette vehicule?",
                      okText: "Supprimer",
                      okType: "danger",
                      cancelText: "Annuler",
                      onOk() {
                        dispatch(deleteVehicule(value?.id));
                      },
                      onCancel() {
                        setSelectedId(null);
                      },
                    });
                    setTimeout(() => {
                      dispatch(
                        getVehicule({
                          pagination: {
                            current: 1,
                            pageSize: meta.pageSize,
                          },
                          text: textFilter,
                          status: filterStatus,
                          user_id: userRole,
                          deepNumber: 2,
                        })
                      );
                    }, 2000);
                  }}
                >
                  Supprimer
                </Link>
              )}
            </>
          }
        >
          <Link to="#">
            <FeatherIcon icon="more-horizontal" size={18} />
          </Link>
        </Dropdown>
      ),
    };
  });

  return (
    <Row gutter={25}>
      <Col xs={24}>
        {isLoading && <Loader />}
        <Cards headless>
          <div className="table-responsive">
            <Table
              className="table-striped-rows"
              pagination={{
                current: state?.page,
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

      <ViewVehicule
        onCancel={() => setViewModalVisible(false)}
        visible={isViewModalVisible}
        record={selectedId}
        recorddata={selectedata}
        meta={meta}
        userRole={currentRole}
        name={dataSource}
      />

      <UpdateVehicule
        onCancel={() => setUpdateModalVisible(false)}
        visible={isUpdateModalVisible}
        record={selectedId}
        recorddata={selectedata}
        setPing={setPing}
        ping={ping}
      />
      <ChangeCompany
        onCancel={() => setShowCompanyChanger(false)}
        visible={showCompanyChanger}
        record={selectedata}
      />
    </Row>
  );
};

export default Vehicules;
