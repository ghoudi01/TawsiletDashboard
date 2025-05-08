import React from "react";
import { 
  Modal, 
  Card, 
  Avatar, 
  Tag, 
  Divider, 
  Row, 
  Col,
  Typography 
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { capitalize } from "../../utility/utility";

const { Text } = Typography;

const OverviewModal = ({ open, setOpen, modalId }) => {
  const getRandomColor = () => {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IdcardOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <span>Admin Details</span>
        </div>
      }
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={700}
      // centered
      bodyStyle={{ padding: 0 }}
    >
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 8,
          boxShadow: 'none'
        }}
        cover={
          <div style={{ 
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            height: 120,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingBottom: 20
          }}>
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: getRandomColor(),
                border: '4px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }} 
            />
          </div>
        }
      >
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Text strong style={{ fontSize: 20, display: 'block' }}>
            {capitalize(modalId?.firstName)} {capitalize(modalId?.lastName)}
          </Text>
          <Tag color="blue" style={{ fontSize: 12, marginTop: 8 }}>
            ADMIN ID: {modalId?.id}
          </Tag>
        </div>

        <Divider style={{ margin: '24px 0' }} />

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <MailOutlined style={{ 
                fontSize: 18, 
                color: '#1890ff', 
                marginRight: 12,
                padding: 8,
                backgroundColor: '#e6f7ff',
                borderRadius: 4
              }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Email</Text>
                <div style={{ marginTop: 4 }}>
                  {modalId?.email || <Text type="secondary">N/A</Text>}
                </div>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <PhoneOutlined style={{ 
                fontSize: 18, 
                color: '#52c41a', 
                marginRight: 12,
                padding: 8,
                backgroundColor: '#f6ffed',
                borderRadius: 4
              }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Phone</Text>
                <div style={{ marginTop: 4 }}>
                  +{modalId?.phoneNumber || <Text type="secondary">N/A</Text>}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EnvironmentOutlined style={{ 
                fontSize: 18, 
                color: '#faad14', 
                marginRight: 12,
                padding: 8,
                backgroundColor: '#fffbe6',
                borderRadius: 4
              }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Address</Text>
                <div style={{ marginTop: 4 }}>
                  {modalId?.address || <Text type="secondary">No address provided</Text>}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};

export default OverviewModal;