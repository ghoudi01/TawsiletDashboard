import React, { useState, useEffect } from "react";
import { Modal, Typography, Divider, Tag, Card, Avatar, Space, Image, Select, Input, message } from "antd";
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HistoryOutlined,
  EditOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import styled from "styled-components";
import ListModal from "./ListModal";
import axios from "axios";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const OverviewModal = ({ open, setOpen, modalId }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState(null);
  const [womanValidationState, setWomanValidationState] = useState(null);
  const [womanValidationDescription, setWomanValidationDescription] = useState("");
  const [submittingWomanValidation, setSubmittingWomanValidation] = useState(false);

  useEffect(() => {
    if (open && modalId?.id) {
      setLoadingUser(true);
      setError(null);
      const token = localStorage.getItem("token");
      axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users/${modalId.id}?pLevel=4`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          setUserData(res.data || res);
        })
        .catch((err) => {
          setError("Erreur lors du chargement des données utilisateur");
        })
        .finally(() => {
          setLoadingUser(false);
        });
    } else if (!open) {
      setUserData(null);
      setError(null);
    }
  }, [open, modalId?.id]);

  useEffect(() => {
    if (open && (userData || modalId)) {
      const client = userData || modalId;
      if (client?.womanValidation?.validation_state === "waiting") {
        setWomanValidationState("waiting");
        setWomanValidationDescription("");
      } else {
        setWomanValidationState(null);
        setWomanValidationDescription("");
      }
    }
  }, [open, userData, modalId]);

  const handleCancel = () => {
    setOpen(false);
  };

  // Use userData if available, otherwise fallback to modalId
  const client = userData || modalId;
  const clientName = client 
    ? `${client?.firstName || ""} ${client?.lastName || ""}` 
    : "Client inconnu";
  const phoneNumber = client?.phoneNumber || "Non renseigné";
  const email = client?.email || "Non renseigné";
  const profilePicture = client?.profilePicture?.url || null;

  // Handler for submitting woman validation
  const handleWomanValidationSubmit = async () => {
    if (!client?.id) return;
    if (womanValidationState !== "valid" && womanValidationState !== "invalid") {
      message.error("Veuillez sélectionner une option de validation.");
      return;
    }
    if (womanValidationState === "invalid" && !womanValidationDescription.trim()) {
      message.error("Veuillez fournir une description pour l'invalidation.");
      return;
    }
    setSubmittingWomanValidation(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}usersbyrole/client/woman-validation`,
        {
          id: client.id,
          womanValidation: {
            validation_state: womanValidationState,
            description: womanValidationState === "invalid" ? womanValidationDescription : "",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Validation mise à jour avec succès.");
      setOpen(false);
    } catch (err) {
      message.error("Erreur lors de la mise à jour de la validation.");
    } finally {
      setSubmittingWomanValidation(false);
    }
  };

  return (
    <StyledModal
      title="Détails du client"
      open={open}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      footer={null}
      width={700}
      className="client-modal"
    >
      {loadingUser ? (
        <div>Chargement...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <div className="client-header">
            <Avatar 
              size={80} 
              src={profilePicture} 
              icon={<UserOutlined />}
              className="client-avatar"
            />
            <div className="client-info">
              <Title level={3} className="client-name">
                {clientName}
                {client?.status === 'active' && (
                  <Tag color="green" className="status-tag">Actif</Tag>
                )}
              </Title>
              <Text type="secondary" className="client-id">
                ID: {client?.id   || 'N/A'}
              </Text>
            </div>
          </div>

          <Divider orientation="left" className="section-divider">
            <UserOutlined />
            <span style={{marginLeft:10}}>Informations personnelles</span>
          </Divider>

          <div className="client-details">
            <DetailCard 
              icon={<PhoneOutlined />} 
              title="Téléphone" 
              value={phoneNumber} 
            />
            <DetailCard 
              icon={<MailOutlined />} 
              title="Email" 
              value={email} 
            />
          </div>

          {/* CIN Images Section */}
          <Divider orientation="left" className="section-divider">
            <IdcardOutlined />
            <span style={{marginLeft:10}}>Documents d'identité</span>
          </Divider>
          <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
            {/* user_with_cin */}
            {client?.user_with_cin?.url && (
              <div>
                <Text strong>Photo avec CIN</Text>
                <Image
                  width={120}
                  src={client.user_with_cin.url}
                  alt="user_with_cin"
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
            {/* cinFront */}
            {client?.cinFront?.url && (
              <div>
                <Text strong>CIN Recto</Text>
                <Image
                  width={120}
                  src={client.cinFront.url}
                  alt="CIN Recto"
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
            {/* cinBack */}
            {client?.cinBack?.url && (
              <div>
                <Text strong>CIN Verso</Text>
                <Image
                  width={120}
                  src={client.cinBack.url}
                  alt="CIN Verso"
                  style={{ marginTop: 8 }}
                />
              </div>
            )}
            {/* If no images */}
            {!client?.user_with_cin?.url && !client?.cinFront?.url && !client?.cinBack?.url && (
              <Text type="secondary">Aucune image d'identité disponible.</Text>
            )}
          </div>

          {/* Woman Validation Section */}
          {client?.womanValidation != null && (
            <div style={{ marginBottom: 24 }}>
              <Divider orientation="left" className="section-divider">
                <span>Validation Femme</span>
              </Divider>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <Text strong>Statut de validation :</Text>
                <Select
                  style={{ width: 180 }}
                  value={womanValidationState === "waiting" ? undefined : womanValidationState}
                  placeholder="Choisir..."
                  onChange={setWomanValidationState}
                  disabled={submittingWomanValidation}
                >
                  <Option value="valid">Valider</Option>
                  <Option value="invalid">Invalider</Option>
                </Select>
              </div>
              {womanValidationState === "invalid" && (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Description :</Text>
                  <Input.TextArea
                    rows={3}
                    value={womanValidationDescription}
                    onChange={e => setWomanValidationDescription(e.target.value)}
                    placeholder="Décrivez la raison de l'invalidation..."
                    disabled={submittingWomanValidation}
                  />
                </div>
              )}
              <div>
                <button
                  className="ant-btn ant-btn-primary"
                  style={{ marginTop: 8 }}
                  onClick={handleWomanValidationSubmit}
                  disabled={submittingWomanValidation || !womanValidationState || (womanValidationState === "invalid" && !womanValidationDescription.trim())}
                >
                  {submittingWomanValidation ? "Envoi..." : "Mettre à jour la validation"}
                </button>
              </div>
            </div>
          )}

          <Divider orientation="left" className="section-divider" >
            <HistoryOutlined />
            <span style={{marginLeft:10}}>Historique des commandes</span>
          </Divider>

          <div className="order-history">
            <ListModal user={client} />
          </div>
        </>
      )}
    </StyledModal>
  );
};

const DetailCard = ({ icon, title, value }) => (
  <Card bordered={false} className="detail-card">
    <Space size="middle">
      <div className="detail-icon">{icon}</div>
      <div className="detail-content">
        <Text type="secondary" className="detail-title">{title}</Text>
        <Text strong className="detail-value">{value}</Text>
      </div>
    </Space>
  </Card>
);

const EmptyCard = styled(Card)`
  text-align: center;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 24px;
  }

  .client-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 20px;

    .client-avatar {
      background-color: #f0f2f5;
      font-size: 32px;
    }

    .client-info {
      .client-name {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .client-id {
        font-size: 13px;
      }

      .status-tag {
        margin-left: 8px;
      }
    }
  }

  .client-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .detail-card {
      background: #f9f9f9;
      border-radius: 8px;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }

      .detail-icon {
        font-size: 18px;
        color: #1890ff;
      }

      .detail-content {
        .detail-title {
          display: block;
          font-size: 13px;
        }

        .detail-value {
          display: block;
          font-size: 15px;
          margin-top: 4px;
        }
      }
    }
  }

  .order-history {
    max-height: 400px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
  }

  .section-divider {
    margin: 24px 0;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.65);

    .anticon {
      color: #1890ff;
    }
  }
`;

export default OverviewModal;