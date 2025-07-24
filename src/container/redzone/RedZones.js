import React, { useState, useEffect } from "react";
import { Row, Col, Table, Input, Spin, Alert,  Modal } from "antd";
import { Main, TableWrapper } from "../styled";
import { PageHeader } from "../../components/page-headers/page-headers";
import axios from "axios";
import { GoogleMap, DrawingManager, Polygon, useJsApiLoader } from "@react-google-maps/api";
import AddRedZoneModal from "./AddRedZoneModal";
import { Button } from "../../components/buttons/buttons";
import FeatherIcon from "feather-icons-react";

function RedZones() {
  const [searchText, setSearchText] = useState("");
  const [redZones, setRedZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Move fetchRedZones outside useEffect so it can be called after add/delete
  const fetchRedZones = async () => {
    setLoading(true);
    setError(null);
    try {
      const jwt = localStorage.getItem("token");
      const response = await axios.get(`${process.env.REACT_APP_BACKUP_URL}red-zones`,{
          headers: { Authorization: `Bearer ${jwt}` },
      });
      setRedZones(response.data.data);
    } catch (err) {
      setError("Erreur lors du chargement des zones rouges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedZones();
  }, []);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Supprimer la zone rouge",
      content: "Êtes-vous sûr de vouloir supprimer cette zone rouge ?",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      async onOk() {
        try {
          const jwt = localStorage.getItem("token");
          await axios.delete(`${process.env.REACT_APP_BACKUP_URL}red-zones/${id}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          // Instead of just removing from state, reload from server
          await fetchRedZones();
        } catch (err) {
          Modal.error({
            title: "Erreur",
            content: "Erreur lors de la suppression de la zone rouge.",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nom de la zone",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <input
          type="checkbox"
          checked={record.active === true}
          onChange={async (e) => {
            const newActive = e.target.checked;
            try {
              const jwt = localStorage.getItem("token");
              await axios.put(
                `${process.env.REACT_APP_BACKUP_URL}red-zones/${record.documentId}`,
                { data: { active: newActive } },
                { headers: { Authorization: `Bearer ${jwt}` } }
              );
              setRedZones((prevZones) =>
                prevZones.map((zone) =>
                  zone.id === record.id ? { ...zone, active: newActive } : zone
                )
              );
            } catch (err) {
              Modal.error({
                title: "Erreur",
                content: "Erreur lors de la mise à jour du statut de la zone rouge.",
              });
            }
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="table-actions">
          <Button
            className="btn-icon"
            type="danger"
            shape="circle"
            onClick={() => handleDelete(record.documentId)}
          >
            <FeatherIcon icon="trash-2" size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const filteredZones = redZones.filter(
    (zone) =>
      zone.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      zone.region?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <PageHeader
        ghost
        title="Red Zones"
        subTitle={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="project-sort-search" style={{ marginRight: "1vw" }}>
              <Input
                className="data_search_input"
                type="text"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Rechercher ..."
                value={searchText}
              />
            </div>
            <Button type="primary" onClick={() => setAddModalOpen(true)}>
              Ajouter une zone rouge
            </Button>
          </div>
        }
      />
      <Main>
        <Row gutter={25}>
          <Col xs={24}>
            {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
            {loading ? (
              <Spin size="large" />
            ) : (
              <TableWrapper className="table-data-view table-responsive">
                <Table
                  columns={columns}
                  dataSource={filteredZones}
                  rowKey="id"
                  locale={{ emptyText: "Aucune zone rouge trouvée." }}
                />
              </TableWrapper>
            )}
          </Col>
        </Row>
      </Main>
      <AddRedZoneModal
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        onOk={async (newZone) => {
          setAddModalOpen(false);
          // After adding, reload the list
          await fetchRedZones();
        }}
      />
    </>
  );
}

export default RedZones; 