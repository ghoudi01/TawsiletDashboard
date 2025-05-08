import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Modal,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import FeatherIcon from "feather-icons-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import { Cards } from "../../../components/cards/frame/cards-frame";
import { Dropdown } from "../../../components/dropdown/dropdown";
import Loader from "../../../components/loaderLine/Loader";
import SelectGm from "../../../selectGm/SelectGm";
import { ProjectHeader, ProjectListTitle } from "../style";
import ViewSociété from "./ViewSociété";
import UpdateSociete from "../UpdateSociete";
import Addsociété from "../Addsociété";
import valid from "../../../static/img/Glyph.svg";
import invalid from "../../../static/img/refuse.svg";
import wait from "../../../static/img/wait.svg";
import {
  getCompanies,
  updateUser,
  usersDel,
} from "../../../redux/User/userSlice";

const selectOptions = [
  { value: "Activer", label: "Activer" },
  { value: "Désactiver", label: "Désactiver" },
];

const Sociétés = ({
  textFilter,
  filterStatus,
  setShouldPrint,
  setShouldExportPdf,
  setShouldExportExcel,
  shouldPrint,
  shouldExportPdf,
  shouldExportExcel,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [selectedata, setSelecteData] = useState();
  const [UpdateModal, setUpdateModal] = useState(false);
  const [AddModal, setAddModal] = useState(false);
  const [ViewModal, setViewModal] = useState(false);

  // Redux selectors
  const meta = useSelector((state) => state?.user?.companies?.pageInfo);
  const societes = useSelector((state) => state?.user?.companies?.nodes);
  console.log("🚀 ~ societes:", societes)
  const currentuser = useSelector((state) => state?.user?.currentUser);
  const isLoading = useSelector((state) => state?.user?.isLoading);

  // Export handlers
  const printTable = () => {
    const printableData = societes.map((item) => ({
      ID: item?.id,
      owner: item?.nameOwner,
      phone: item?.phoneNumber,
      email: item?.email,
      kabis: item?.kabis,
      rcPro: item?.assurance_rc_pro,
      address: item?.address,
      region: item?.region,
      codePostal: item?.postalCode,
      city: item?.city,
    }));

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>Table Print</title></head>
      <body>
        <h2>Sociétés Table</h2>
        <table>
          <tr>
            <th>ID</th><th>Gérant</th><th>Telephone</th><th>Email</th>
            <th>KABIS</th><th>Assurance RC pro</th><th>Adresse</th>
            <th>Region</th><th>Code postal</th><th>ville</th>
          </tr>
          ${printableData
            .map(
              (item) => `
            <tr>
              <td>${item.ID}</td><td>${item.owner}</td><td>${item.phone}</td>
              <td>${item.email}</td><td>${item.kabis}</td><td>${item.rcPro}</td>
              <td>${item.address}</td><td>${item.region}</td>
              <td>${item.codePostal}</td><td>${item.city}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportHandlers = useMemo(
    () => ({
      print: printTable,
      pdf: () => {
        const doc = new jsPDF();
        doc.text("Sociétés Table", 10, 10);
        doc.autoTable({
          head: [
            [
              "ID",
              "Gerant",
              "Telephone",
              "Email",
              "Kabis",
              "Assurance RC pro",
              "Adresse",
              "Region",
              "Code postal",
              "Ville",
            ],
          ],
          body: societes.map((item) => [
            item?.id,
            item?.nameOwner,
            item?.phoneNumber,
            item?.email,
            item?.kabis,
            item?.assurance_rc_pro,
            item?.address,
            item?.region,
            item?.postalCode,
            item?.city,
          ]),
        });
        doc.save(
          `Sociétés-${new Date().toLocaleDateString().replaceAll("/", "-")}.pdf`
        );
      },
      excel: () => {
        const worksheet = XLSX.utils.json_to_sheet(
          societes.map((item) => ({
            ID: item?.id,
            Gerant: item?.nameOwner,
            Telephone: item?.phoneNumber,
            Email: item?.email,
            Kabis: item?.kabis,
            "Assurance RC pro": item?.assurance_rc_pro,
            Adresse: item?.address,
            Region: item?.region,
            "Code postal": item?.postalCode,
            Ville: item?.city,
          }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sociétés");
        XLSX.writeFile(
          workbook,
          `Société-${new Date().toLocaleDateString().replaceAll("/", "-")}.xls`
        );
      },
    }),
    [societes]
  );

  useEffect(() => {
    if (shouldPrint) {
      exportHandlers.print();
      setShouldPrint(false);
    }
    if (shouldExportPdf) {
      exportHandlers.pdf();
      setShouldExportPdf(false);
    }
    if (shouldExportExcel) {
      exportHandlers.excel();
      setShouldExportExcel(false);
    }
  }, [shouldPrint, shouldExportPdf, shouldExportExcel, exportHandlers]);

  // Data fetching
 // In Sociétés component
useEffect(() => {
  const fetchData = async () => {
    await dispatch(
      getCompanies({
        pagination: { current: 1, pageSize: meta?.pageSize },
        text: textFilter,
        status: filterStatus,
      })
    );
  };
  fetchData();
}, [textFilter, filterStatus, dispatch]);

  // Table handlers
  const handleSelectAll = useCallback(
    (checked) => {
      setSelectedRows(checked ? societes.map((v) => v.id) : []);
    },
    [societes]
  );

  const handleSelectRow = useCallback((checked, id) => {
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((v) => v !== id)
    );
  }, []);

  // Table configuration
  const columns = useMemo(
    () => [
      {
        title: (
          <Checkbox
            indeterminate={
              selectedRows.length > 0 && selectedRows?.length < societes.length
            }
            checked={selectedRows.length === societes?.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
        ),
        render: (_, record) => (
          <Checkbox
            checked={selectedRows.includes(record.id)}
            onChange={(e) => handleSelectRow(e.target.checked, record.id)}
          />
        ),
      },
      { title: "ID", dataIndex: "documentId" },
      { title: "Nom de Société", dataIndex: "name" },
      { title: "Email", render: (_, record) => record.owner?.email },
      { title: "Numéro", render: (_, record) => record.owner?.phoneNumber },
      { title: "Adresse", render: (_, record) => record.owner?.address },
      {
        title: "Nom. propriétaire",
        render: (_, record) => record.owner?.firstName + record.owner?.lastName,
      },

      {
        title: "Action",
        fixed: "right",
        width: 100,
        render: (_, record) => (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* <SelectGm
              options={selectOptions}
              placeholder={record.blocked ? "Désactiver" : "Activer"}
              onSelect={(value) =>
                Modal.confirm({
                  title: "Confirmation d'action",
                  content: "Changer le statut de cet utilisateur?",
                  onOk: () =>
                    dispatch(
                      updateUser({
                        id: record.id,
                        user: { blocked: value === "Désactiver" },
                      })
                    ).then(() =>
                      dispatch(
                        getCompanies({
                          pagination: {
                            current: meta.page,
                            pageSize: meta.pageSize,
                          },
                          text: textFilter,
                          status: filterStatus,
                        })
                      )
                    ),
                })
              }
            /> */}
            <Dropdown
              content={
                <>
                  <Link
                    onClick={() => {
                      console.log(record)
                      setViewModal(true);
                      setSelecteData(record);
                      setSelectedId(record.documentId)
                    }}
                  >
                    Voir
                  </Link>
                  {currentuser?.user_role === "owner" && (
                    <>
                      {/* <Link
                        onClick={() => {
                          setUpdateModal(true);
                          setSelecteData(record);
                        }}
                      >
                        Modifier
                      </Link> */}
                      {/* <Link
                        onClick={() =>
                          Modal.confirm({
                            title: `Supprimer Société N° ${record.id}`,
                            content: "Supprimer cette société?",
                            onOk: () =>
                              dispatch(usersDel(record.id)).then(() =>
                                dispatch(
                                  getCompanies({
                                    pagination: {
                                      current: meta.page,
                                      pageSize: meta.pageSize,
                                    },
                                    text: textFilter,
                                    status: filterStatus,
                                  })
                                )
                              ),
                          })
                        }
                      >
                        Supprimer
                      </Link> */}
                    </>
                  )}
                </>
              }
            >
              <Link>
                <FeatherIcon icon="more-horizontal" size={18} />
              </Link>
            </Dropdown>
            {record.confirmed == null ? (
              <Tag color="gray">En Attente</Tag>
             
            ) : record.confirmed ? (
              <Tag color="darkgreen">Activé</Tag>
             
            ) : (
              <Tag color="#cc0000">Désactivé</Tag>
            )}
          </div>
        ),
      },
      // {
      //   title: "Status",
      //   render: (_, record) =>
      //     record.confirmed && !record.blocked ? (
      //       <Tag color="darkgreen">Activé</Tag>
      //     ) : !record.confirmed ? (
      //       <Tag color="#cc0000">Attente de confirmation</Tag>
      //     ) : (
      //       <Tag color="#cc0000">Désactivé</Tag>
      //     ),
      // },
      // {
      //   title: "",
      //   render: (_, record) => (

      //   ),
      // },
    ],
    [selectedRows, societes, handleSelectAll, handleSelectRow, currentuser]
  );

  return (
    <>
      <ProjectHeader>
        {/* <Button type="primary" onClick={() => setAddModal(true)}>
          <FeatherIcon icon="plus" size={16} />
          Créer une nouvelle Société
        </Button> */}
      </ProjectHeader>

      <Row gutter={25}>
        <Col xs={24}>
          {isLoading && <Loader />}
          <Cards headless>
            <div className="table-responsive">
              <Table
                className="table-striped-rows"
                columns={columns}
                dataSource={societes}
                pagination={{
                  total: meta?.total,
                  pageSizeOptions: ["5", "10", "20", "50"],
                  showSizeChanger: true,
                }}
                onChange={(pagination) =>
                  dispatch(
                    getCompanies({
                      page: pagination.current,
                      pageSize: pagination.pageSize,
                      text: textFilter,
                      status: filterStatus,
                    })
                  )
                }
              />
            </div>
          </Cards>
        </Col>
      </Row>

      <UpdateSociete
        visible={UpdateModal}
        onCancel={() => setUpdateModal(false)}
        recorddata={selectedata}
      />
      
      <Addsociété visible={AddModal} onCancel={() => setAddModal(false)} />

      <ViewSociété
        textFilter={textFilter}
        filterStatus={filterStatus}
        visible={ViewModal}
        onCancel={() => setViewModal(false)}
        companyId={selectedId}

      />
    </>
  );
};

export default Sociétés;
