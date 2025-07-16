import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
} from "antd";
import FeatherIcon from "feather-icons-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { database } from '../../../config/firebase';
import { ref, remove } from 'firebase/database';

import { Dropdown } from "../../../components/dropdown/dropdown";
import { ProjectListTitle } from "../style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { getDriver, updateUser, usersDel } from "../../../redux/User/userSlice";
import OverwiewLivreur from "../OverwiewLivreur";
import SelectGm from "../../../selectGm/SelectGm";
import ChangeDriverInfo from "../../commandes/overview/ChangeDriverInfo";
import AssigneVehicule from "./AssigneVehicule";
import ChangeCompany from "./ChangeCompany";
import Loader from "../../../components/loaderLine/Loader";
import AssignParentDriver from "./AssignParentDriver";

import valid from "../../../static/img/Glyph.svg";
import invalid from "../../../static/img/refuse.svg";
import wait from "../../../static/img/wait.svg";
import {
  
  updateVehicule,
} from "../../../redux/vehicule/vehiculeSlice";
const Livreur = ({
  text,
  shouldPrint,
  setShouldPrint,
  setShouldExportPdf,
  shouldExportPdf,
  setShouldExportExcel,
  shouldExportExcel,
}) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user?.drivers?.results);
  const meta = useSelector((state) => state.user?.drivers?.pagination);
   const userRole = useSelector((state) => state?.user?.currentUser?.user_role);
  const current = useSelector((state) => state?.user?.currentUser);
  const isLoading = useSelector((state) => state?.user?.isLoading);
 
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openChangeCompany, setOpenChangeCompany] = useState(false);
  const [openAssignParent, setOpenAssignParent] = useState(false);
  const [modalId, setmodalId] = useState();
  const [driverDetais, setDriverDetais] = useState();
  const [ping, setPing] = useState(false);

  const [state, setState] = useState({
    data: users,
    current: 1,
    pageSize: 10,
  });

  const selectOptions = [
    { value: "Activer", label: "Activer" },
    { value: "Désactiver", label: "Désactiver" },
  ];


 const handlerUpdatePro=async(checked,record)=>{

if(checked===false)
  {
    
    for (const x of record.sub_drivers || []) {
    await dispatch(
      updateUser({
        id: x?.id,
        user: { vehicule: null },
      })
    );
  }
  
  for (const x of record.vehicules || []) {
    
      await dispatch(
        updateVehicule({
          id: x?.documentId,
          vehicule: { data:{driver: null} },
        })
      );
   
  }
  
  await dispatch(
    updateUser({
      id: record.id,
      user: { sub_drivers: [],vehicule:null,vehicules:[] },
    })
    
  )
}
 
 
 await dispatch(
    updateUser({
      id: record.id,
      user: { pro: checked },
    })
    
  )

  

  dispatch(getDriver({}));
 

  }

  // Handlers
  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? users?.map((value) => value.id) : []);
  };

  const handleSelectRow = (checked, id) => {
    setSelectedRows(prev =>
      checked ? [...prev, id] : prev.filter(rowId => rowId !== id)
    );
  };

  const onCancel = () => {
    setOpenUpdate(false);
    setOpenChangeCompany(false);
    setOpenAdd(false);
    setOpenAssignParent(false);
  };

  const onShowSizeChange = (current, pageSize) => {
    setState(prev => ({ ...prev, current, pageSize }));
  };

  const onHandleChange = (pagination) => {
    dispatch(
      getDriver({
        page: pagination.current,
        pageSize: pagination.pageSize,
        text,
      })
    );
    setState(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  // Export functions
  const printTable = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Table Print</title></head>
        <body>
          <style>
            @media print { 
              th, td { border: 1px solid black; padding: 0.5rem; } 
              table { border-collapse: collapse; width: 100%; } 
            }
          </style>
          <h2>Reservations Table</h2>
          <table>
            <tr>
              <th>ID</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Telephone</th>
              <th>Email</th>
              <th>Numero C.I</th>
              <th>Validation</th>
              <th>Company</th>
            </tr>
            ${dataSource.map(item => `
              <tr>
                <td>${item.id}</td>
                <td>${item.firstName}</td>
                <td>${item.lastName}</td>
                <td>${item.phoneNumber}</td>
                <td>${item.email}</td>
                <td>${item.cin}</td>
                <td>${item.validation}</td>
                <td>${item.driver_company.name}</td>
                <td>${item.pro}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString().replaceAll("/", "-");
    
    doc.text("Livreur Table", 10, 10);
    
    const tableColumnNames = [
      "ID", "Prénom", "Nom", "Telephone", "Email", 
      "Numero C.I", "Validation", "Company"
    ];

    const tableRows = dataSource.map(item => [
      item.id,
      item.firstName,
      item.lastName,
      item.phoneNumber,
      item.email,
      item.cin,
      item.validation,
      item.driver_company.name,
      item.pro,

    ]);
    doc.autoTable({
      head: [tableColumnNames],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { overflow: "linebreak" },
      headStyles: { fillColor: [41, 128, 185], textColor: "#fff" },
      columnStyles: Array(8).fill({ cellWidth: 20 }),
    });

    doc.save(`Chauffeurs-${formattedDate}.pdf`);
  };

  const exportToExcel = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString().replaceAll("/", "-");
    
    const tableColumnNames = [
      "ID", "Prénom", "Nom", "Telephone", "Email", 
      "Numero C.I", "Validation", "Company"
    ];
    
    const tableRows = dataSource.map(item => [
      item.id,
      item.firstName,
      item.lastName,
      item.phoneNumber,
      item.email,
      item.cin,
      item.validation,
      item.driver_company.name,
      item.pro,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([tableColumnNames, ...tableRows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "livreurs");
    XLSX.writeFile(workbook, `Chauffeurs-${formattedDate}.xls`);
  };

  // Table columns configuration
  const columns = [
    {
      title: (
        <Checkbox
          onChange={(e) => handleSelectAll(e.target.checked)}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < users.length
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

      render: (_, record) => (
        <ProjectListTitle>
          <p>{record?.id}</p>
        </ProjectListTitle>
      ),
    },
    {
      id: "Nom Complet",
      title: "Nom Complet",
      render: (_, record) => (
        <ProjectListTitle>
          <p>
            {record?.firstName} {record?.lastName}
          </p>
        </ProjectListTitle>
      ),
    },
    {
      id: "phone",
      title: "Numéro de téléphone",
      render: (_, record) => (
        <span className="date-finished">{record?.phoneNumber}</span>
      ),
    },
    {
      id: "email",
      title: "Adresse e-mail",
      render: (_, record) => (
        <ProjectListTitle>
          <p>{record?.email}</p>
        </ProjectListTitle>
      ),
    },
 
    {
      id: "pro",
      title: "pro",
      render: (_, record) => (
        <ProjectListTitle>
          <Switch
            checked={record?.pro}
            onChange={(checked) => {
              handlerUpdatePro(checked, record)
            }}
            disabled={![ "owner","agent_support"].includes}
          />
        </ProjectListTitle>
      ),
    },

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
 
  // Data source for the table
  const dataSource = users?.map((value) => ({
    key: value.id,
    id: value.id,
    documentId:value.documentId,
    firstName: value?.firstName,
    lastName: value?.lastName,
    phoneNumber: value?.phoneNumber,
    email: value?.email,
    cin: value?.cin,
    validation: value?.validation?.validation_state,
    company: value?.driver_company?.name,
    pro:value?.pro,
    sub_drivers:value?.sub_drivers,
    vehicules:value?.vehicules,
    vehicule:value?.vehicule,
    more: (
      <Dropdown
        className="wide-dropdwon"
        content={
          <>
           {[ "owner","agent_support"].includes(userRole)&&( <Link
              onClick={() => {
                setOpenAdd(true);
                setDriverDetais(value);
              }}
              to="#"
            >
              Assigner Voiture
            </Link>)}
          {!value?.pro&&[ "owner","agent_support"].includes(userRole)&&(  <Link
              onClick={() => {
                setOpenAssignParent(true);
                setDriverDetais(value);
              }}
              to="#"
            >
              Assigner au parent driver
            </Link>)}
            <Link
              onClick={() => {
                setOpen(true);
                setDriverDetais(value);
              }}
              to="#"
            >
              Afficher
            </Link>
           {[ "owner","agent_support"].includes&&( <Link
              onClick={() => {
                setOpenUpdate(true);
                setmodalId(value.id);
              }}
              to="#"
            >
              Modifier
            </Link>)}
            {["owner"].includes(userRole) && (
              <Link
                to="#"
                onClick={async (e) => {
                  Modal.confirm({
                    title: "Confirmation D'action",
                    content: "Etes vous sure de vouloir Suprimer cet client?",
                    okText: "Oui",
                    okType: "danger",
                    cancelText: "Annuler",
                    async onOk() {
                      try {
                        // Delete from Firebase
                        if (value.documentId) {
                          const driverRef = ref(database, `drivers/${value.documentId}`);
                          await remove(driverRef);
                        }
                        // Delete from main DB
                        await dispatch(usersDel(value.id));
                        dispatch(getDriver({}));
                      } catch (err) {
                        // Optionally handle error
                        console.error('Error deleting driver:', err);
                      }
                    },
                    onCancel() {
                      dispatch(getDriver({}));
                    },
                  });
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
    action: (
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", }}>
        
        {value?.validation?.validation_state === "waiting" ? (
          <img src={wait} style={{ width: "50%" }} alt="waiting" />
        ) : value?.validation?.validation_state === "valid" ? (
          <img src={valid} style={{ width: "50%" }} alt="valid" />
        ) : (
          <img src={wait} style={{ width: "50%" }} alt="invalid" />
        )}
      </div>
    ),
  }));
 
  // Effects
  useEffect(() => {
    dispatch(
      getDriver({
        page: 1,
        pageSize: state.pageSize,
        text,
      })
    );
    setState(prev => ({ ...prev, data: users }));
  }, [dispatch, text, ping]);

  useEffect(() => {
    if (shouldPrint) {
      printTable();
      setShouldPrint(false);
    }
    if (shouldExportPdf) {
      exportToPDF();
      setShouldExportPdf(false);
    }
    if (shouldExportExcel) {
      exportToExcel();
      setShouldExportExcel(false);
    }
  }, [shouldPrint, shouldExportPdf, shouldExportExcel]);

  return (
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
                pageSizeOptions: ["5", "10", "20", "50"],
                onShowSizeChange,
              }}
              dataSource={dataSource}
              columns={columns}
              onChange={onHandleChange}
            />
          </div>
        </Cards>
      </Col>

      <OverwiewLivreur
        open={open}
        setOpen={setOpen}
        driverDetais={driverDetais}
        setPing={setPing}
        ping={ping}
      />
      <ChangeDriverInfo
        visible={openUpdate}
        onCancel={onCancel}
        record={modalId}
      />
      
      {openAdd && (
        <AssigneVehicule
          record={modalId}
          visible={openAdd}
          onCancel={onCancel}
          driverDetais={driverDetais}
          usersList={users}
        />
      )}

      {openChangeCompany && (
        <ChangeCompany
          record={modalId}
          visible={openChangeCompany}
          onCancel={onCancel}
        />
      )}

      {openAssignParent && (
        <AssignParentDriver
          record={modalId}
          visible={openAssignParent}
          onCancel={onCancel}
          driverDetais={driverDetais}
          usersList={users?.filter(u => u.pro)}
        />
      )}
    </Row>
  );
};

export default Livreur;