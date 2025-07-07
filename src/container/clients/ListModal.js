import React, { useEffect, useState } from "react";
import { 
  Table, 
  Tag, 
  Card, 
  Space, 
  Typography, 
  Dropdown, 
  Menu, 
  Button,
  Badge,
  Avatar,
  Tooltip
} from "antd";
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  ShopOutlined,
  FlagOutlined,
  WarningOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import OverviewModal from "./OverviewModal";

const { Text, Title } = Typography;

// Status Constants and Configuration
const CommandStatus = {
  PENDING: 'PENDING',
  DISPATCHED_TO_PARTNER: 'DISPATCHED_TO_PARTNER',
  CANCELED_BY_CLIENT: 'CANCELED_BY_CLIENT',
  CANCELED_BY_PARTNER: 'CANCELED_BY_PARTNER',
  ASSIGNED_TO_DRIVER: 'ASSIGNED_TO_DRIVER',
  DRIVER_ON_ROUTE_TO_PICKUP: 'DRIVER_ON_ROUTE_TO_PICKUP',
  ARRIVED_AT_PICKUP: 'ARRIVED_AT_PICKUP',
  PICKED_UP: 'PICKED_UP',
  ON_ROUTE_TO_DELIVERY: 'ON_ROUTE_TO_DELIVERY',
  ARRIVED_AT_DELIVERY: 'ARRIVED_AT_DELIVERY',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  FAILED_PICKUP: 'FAILED_PICKUP',
  FAILED_DELIVERY: 'FAILED_DELIVERY'
};

const statusConfig = {
  [CommandStatus.PENDING]: {
    color: '#9E57E5',
    text: 'En attente',
    icon: <ClockCircleOutlined />,
    badgeStatus: 'processing'
  },
  [CommandStatus.DISPATCHED_TO_PARTNER]: {
    color: '#9E57E5',
    text: 'En attente partenaire',
    icon: <ClockCircleOutlined />,
    badgeStatus: 'processing'
  },
  [CommandStatus.CANCELED_BY_CLIENT]: {
    color: '#F3935D',
    text: 'Annulé (client)',
    icon: <CloseCircleOutlined />,
    badgeStatus: 'warning'
  },
  [CommandStatus.CANCELED_BY_PARTNER]: {
    color: '#F3935D',
    text: 'Annulé (partenaire)',
    icon: <CloseCircleOutlined />,
    badgeStatus: 'warning'
  },
  [CommandStatus.ASSIGNED_TO_DRIVER]: {
    color: '#53B483',
    text: 'Assigné au conducteur',
    icon: <CarOutlined />,
    badgeStatus: 'success'
  },
  [CommandStatus.DRIVER_ON_ROUTE_TO_PICKUP]: {
    color: '#53B483',
    text: 'En route pour ramassage',
    icon: <CarOutlined />,
    badgeStatus: 'success'
  },
  [CommandStatus.ARRIVED_AT_PICKUP]: {
    color: '#53B483',
    text: 'Arrivé au ramassage',
    icon: <ShopOutlined />,
    badgeStatus: 'success'
  },
  [CommandStatus.PICKED_UP]: {
    color: '#53B483',
    text: 'Ramassé',
    icon: <CheckCircleOutlined />,
    badgeStatus: 'success'
  },
  [CommandStatus.ON_ROUTE_TO_DELIVERY]: {
    color: '#53B483',
    text: 'En route pour livraison',
    icon: <CarOutlined />,
    badgeStatus: 'success'
  },
  [CommandStatus.ARRIVED_AT_DELIVERY]: {
    color: '#53B483',
    text: 'Arrivé à livraison',
    icon: <FlagOutlined />,
    badgeStatus: 'success'
  },
  [CommandStatus.DELIVERED]: {
    color: '#59B4D1',
    text: 'Livré',
    icon: <CheckCircleOutlined />,
    badgeStatus: 'default'
  },
  [CommandStatus.COMPLETED]: {
    color: '#59B4D1',
    text: 'Terminé',
    icon: <CheckCircleOutlined />,
    badgeStatus: 'default'
  },
  [CommandStatus.FAILED_PICKUP]: {
    color: '#FF5B5B',
    text: 'Échec ramassage',
    icon: <WarningOutlined />,
    badgeStatus: 'error'
  },
  [CommandStatus.FAILED_DELIVERY]: {
    color: '#FF5B5B',
    text: 'Échec livraison',
    icon: <WarningOutlined />,
    badgeStatus: 'error'
  },
  DEFAULT: {
    color: 'gray',
    text: 'Inconnu',
    icon: null,
    badgeStatus: 'default'
  }
};

const StatusDisplay = ({ status }) => {
  const config = statusConfig[status] || statusConfig.DEFAULT;
  return (
    <Tooltip title={config.text}>
      <Tag 
        color={config.color} 
        icon={config.icon}
        style={{ 
          margin: 0,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {config.text}
      </Tag>
    </Tooltip>
  );
};

const ListModal = ({ user }) => {
  const [reservations, setReservations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const jwt = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}commands?filters[client][$eq]=${user?.id}&populate[0]=pickUpAddress&populate[1]=dropOfAddress`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        setReservations(response.data.data);
      } catch(err) {
        console.error("Error fetching commands:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, [user?.id]);

  const handleViewDetails = (record) => {
    setSelectedReservation(record);
    setOpenModal(true);
  };

  const actionMenu = (record) => (
    <Menu>
      <Menu.Item 
        key="view" 
        icon={<EyeOutlined />}
        onClick={() => handleViewDetails(record)}
      >
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />}>
        <Link to={`/reservations/edit/${record.key}`}>Edit</Link>
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />}>
        <Link to={`/reservations/delete/${record.key}`}>Delete</Link>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'ID Réservation',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Tooltip title={`#${id}`}>
          <Link to={`/admin/details/${id}`}>
            <TruncatedText strong>#{id}</TruncatedText>
          </Link>
        </Tooltip>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    // {
    //   title: 'Client',
    //   dataIndex: 'client',
    //   key: 'client',
    //   render: (_, record) => (
    //     <Space>
    //       <Avatar size="small" src={record.avatar} icon={<UserOutlined />} />
    //       <Text>{record.name}</Text>
    //     </Space>
    //   ),
    // },
    {
      title: 'Point de Ramassage',
      dataIndex: 'pickupAddress',
      key: 'pickupAddress',
      ellipsis: true,
      render: (address) => (
        <Tooltip title={address}>
          <Text ellipsis>{address}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Point de Livraison',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      ellipsis: true,
      render: (address) => (
        <Tooltip title={address}>
          <Text ellipsis>{address}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Prix',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
     },
    {
      title: 'Paiement',
      dataIndex: 'paytype',
      key: 'paytype',
      render: (paytype) => (
        <Tag color={paytype === 'Cash' ? 'green' : 'geekblue'}>
          {paytype}
        </Tag>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <StatusDisplay status={status} />,
      filters: Object.entries(statusConfig)
        .filter(([key]) => key !== 'DEFAULT')
        .map(([key, { text }]) => ({ text, value: key })),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    // {
    //   title: 'Actions',
    //   key: 'actions',
    //   align: 'right',
    //   render: (_, record) => (
    //     <Dropdown overlay={actionMenu(record)} trigger={['click']}>
    //       <Button type="text" icon={<MoreOutlined />} />
    //     </Dropdown>
    //   ),
    // },
  ];

  const dataSource = reservations?.map(reservation => {
    // Normalize the status by converting to uppercase and trimming
    const normalizedStatus = reservation.commandStatus 
      ? reservation.commandStatus.trim().toUpperCase()
      : null;
  
    return {
      key: reservation.documentId,
      id: reservation.refNumber,
      pickupAddress: reservation.pickUpAddress?.Address,
      deliveryAddress: reservation.dropOfAddress?.Address,
      totalPrice: reservation.totalPrice+" DT",
      paytype: reservation.payType,
      name: reservation.client_id?.data?.email,
      avatar: reservation.client_id?.data?.profilePicture?.url,
      status: normalizedStatus,
      originalData: reservation
    };
  }) || [];

  return (
    <StyledContainer>
      {/* <Title level={4} className="reservations-title">
        Historique des Réservations
      </Title> */}
      
      <TableCard bordered={false}>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} réservations`,
          }}
          onChange={(pagination) => setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
          })}
          rowClassName="reservation-row"
        /> 
      </TableCard>

      <OverviewModal 
        open={openModal} 
        setOpen={setOpenModal} 
        modalId={selectedReservation?.originalData} 
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  .reservations-title {
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.85);
  }
`;

const TableCard = styled(Card)`
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  
  .ant-table {
    border-radius: 8px;
    
    .reservation-row {
      transition: all 0.3s;
      
      &:hover {
        background: #fafafa;
      }
    }
    
    .ant-table-thead > tr > th {
      background: #f9f9f9;
      font-weight: 600;
    }
  }
`;

const TruncatedText = styled(Text)`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
`;

export default ListModal;