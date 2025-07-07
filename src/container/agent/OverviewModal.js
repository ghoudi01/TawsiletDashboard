import { Modal, Card, Typography, Divider, Avatar, Tag, Space } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import React from "react";

const { Title, Text } = Typography;

const OverviewModal = ({ open, setOpen, modalId }) => {
  const handleCancel = () => {
    setOpen(false);
  };

  const agentInfo = {
    name: modalId ? `${modalId.firstName} ${modalId.lastName}` : "Nom inconnu",
    phone: modalId?.phoneNumber || "Non renseigné",
    email: modalId?.email || "Non renseigné",
    region: modalId?.region || " region non disponible",
    status: "active",
  };

  return (
    <StyledModal
      title={
        <Space>
          <IdcardOutlined />
          <span>Agent N°{modalId?.id}</span>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      width={600}
      footer={null}
      // centered
    >
      <AgentCard bordered={false}>
        <div className="agent-header">
          <Avatar size={64} icon={<UserOutlined />} className="agent-avatar" />
          <div className="agent-title">
            <Title level={4} className="agent-name">
              {agentInfo.name}
            </Title>
            <Tag color={agentInfo.status === "active" ? "green" : "red"}>
              {agentInfo.status === "active" ? "Actif" : "Inactif"}
            </Tag>
          </div>
        </div>

        <Divider orientation="left" className="info-divider">
          Informations de l'agent
        </Divider>

        <div className="agent-details">
          <div className="detail-row">
            <DetailItem
              icon={<PhoneOutlined />}
              title="Téléphone"
              value={agentInfo.phone}
            />
            <DetailItem
              icon={<MailOutlined />}
              title="Email"
              value={agentInfo.email}
            />
          </div>
          <DetailItem
            icon={<EnvironmentOutlined />}
            title="region"
            value={agentInfo.address}
            fullWidth
          />
        </div>
      </AgentCard>
    </StyledModal>
  );
};

const DetailItem = ({ icon, title, value, fullWidth = false }) => (
  <DetailItemContainer fullWidth={fullWidth}>
    <div className="detail-icon-container">
      {React.cloneElement(icon, { className: 'detail-icon' })}
    </div>
    <div className="detail-content" style={{flexDirection: "column", gap:30}}>
      <Text type="secondary" className="detail-title">{title}</Text>
      <Text strong className="detail-value">
        {value || <span className="empty-value">Non renseigné</span>}
      </Text>
    </div>
  </DetailItemContainer>
);

const DetailItemContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: ${props => props.fullWidth ? '#f9f9f9' : 'transparent'};
  border-radius: 8px;
  width: ${props => props.fullWidth ? '100%' : 'calc(50% - 8px)'};
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
  }

  .detail-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: #e6f7ff;
    border-radius: 50%;
    margin-right: 12px;
    
    .detail-icon {
      color: #1890ff;
      font-size: 16px;
    }
  }

  .detail-content {
    flex: 1;
    flex-direction: column;
    .detail-title {
      font-size: 13px;
      line-height: 1.3;
      margin-bottom: 2px;
      margin-right:10px
    }
    
    .detail-value {
      font-size: 15px;
      line-height: 1.4;
      word-break: break-word;
    }
    
    .empty-value {
      color: rgba(0, 0, 0, 0.25);
      font-style: italic;
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-header {
    border-bottom: none;
  }
`;

const AgentCard = styled(Card)`
  padding: 24px;
  
  .agent-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;

    .agent-avatar {
      background-color: #f0f5ff;
      color: #1890ff;
    }

    .agent-title {
      .agent-name {
        margin: 0;
        line-height: 1.2;
      }
    }
  }

  .info-divider {
    margin: 20px 0;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 500;
    font-size: 15px;
    border-top-color: #f0f0f0;
  }

  .agent-details {
    .detail-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
  }
`;

export default OverviewModal;