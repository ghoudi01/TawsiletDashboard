import React, { useState } from "react";
import { Modal, Typography, Divider, Tag, Card, Avatar, Space } from "antd";
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HistoryOutlined,
  EditOutlined 
} from '@ant-design/icons';
import styled from "styled-components";
import ListModal from "./ListModal";

const { Title, Text, Paragraph } = Typography;

const OverviewModal = ({ open, setOpen, modalId }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const clientName = modalId 
    ? `${modalId?.firstName} ${modalId?.lastName}` 
    : "Client inconnu";
  const phoneNumber = modalId?.phoneNumber || "Non renseigné";
  const email = modalId?.email || "Non renseigné";
  const profilePicture = modalId?.profilePicture?.url || null;

  return (
    <StyledModal
      title="Détails du client"
      open={open}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
      footer={null}
      width={700}
      // centered
      className="client-modal"
    >
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
            {modalId?.status === 'active' && (
              <Tag color="green" className="status-tag">Actif</Tag>
            )}
          </Title>
          <Text type="secondary" className="client-id">
            ID: {modalId?.id   || 'N/A'}
          </Text>
        </div>
      </div>

      <Divider orientation="left" className="section-divider">
        {/* <Space> */}
          <UserOutlined />
          <span style={{marginLeft:10}}>Informations personnelles</span>
        {/* </Space> */}
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

      <Divider orientation="left" className="section-divider" >
        {/* <Space> */}
          <HistoryOutlined />
          <span style={{marginLeft:10}}>Historique des commandes</span>
        {/* </Space> */}
      </Divider>

      <div className="order-history">
        {modalId ? (
          <ListModal user={modalId} />
        ) : (
          <EmptyCard>
            <Paragraph type="secondary">
              Aucune commande trouvée pour ce client
            </Paragraph>
          </EmptyCard>
        )}
      </div>
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