import React, { useEffect, useState, useCallback } from "react";
import { AutoComplete, Modal, Input, List, Avatar, Select, Form, Tag, Button, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import { Button as CustomButton } from "../../../components/buttons/buttons";
import { database } from "../../../config/firebase";
import { ref, onValue, set, remove } from "firebase/database";

import {
  getCommandDetailsById,
  getReservations,
  updateReservation,
} from "../../../redux/reservations/reservationSlice";

// OneSignal constants
const ONESIGNAL_DRIVER_APP_ID="87722266-09fa-4a1f-a5f4-e1ef4aefa03d"
const ONESIGNAL_DRIVER_APP_API_KEY="os_v2_app_q5zcezqj7jfb7jpu4hxuv35ahxdci3erpime6heocseppjvuztl72dqiaqjukutop3dklgilac3m53leqsvkhnjdc5tkspsarhjlaky"

// Custom styles
const customStyles = {
  searchInput: {
    marginBottom: 20,
  },
  searchInputFocus: {
    borderColor: "#dbb961",
    boxShadow: "0 0 0 2px rgba(219, 185, 97, 0.2)",
  },
  selectedItem: {
    backgroundColor: "rgba(219, 185, 97, 0.1) !important",
    borderLeft: "3px solid #dbb961",
  },
  listItem: {
    cursor: "pointer",
    padding: "12px 24px",
    borderBottom: "1px solid #f0f0f0",
    transition: "all 0.3s ease",
  },
  listItemHover: {
    backgroundColor: "rgba(219, 185, 97, 0.05)",
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  filterSelect: {
    minWidth: '120px',
  },
  requestButton: {
    backgroundColor: "#dbb961",
    borderColor: "#dbb961",
    color: "white",
    marginLeft: "8px",
  },
  requestButtonDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#d9d9d9",
    color: "rgba(0, 0, 0, 0.25)",
    cursor: "not-allowed",
  },
};

// Tunisian regions
const tunisianRegions = [
  { value: "Tunis", label: "Tunis" },
  { value: "Ariana", label: "Ariana" },
  { value: "Ben Arous", label: "Ben Arous" },
  { value: "Manouba", label: "Manouba" },
  { value: "Nabeul", label: "Nabeul" },
  { value: "Zaghouan", label: "Zaghouan" },
  { value: "Bizerte", label: "Bizerte" },
  { value: "Beja", label: "Béja" },
  { value: "Jendouba", label: "Jendouba" },
  { value: "Kef", label: "Le Kef" },
  { value: "Siliana", label: "Siliana" },
  { value: "Sousse", label: "Sousse" },
  { value: "Monastir", label: "Monastir" },
  { value: "Mahdia", label: "Mahdia" },
  { value: "Sfax", label: "Sfax" },
  { value: "Kairouan", label: "Kairouan" },
  { value: "Kasserine", label: "Kasserine" },
  { value: "Sidi Bouzid", label: "Sidi Bouzid" },
  { value: "Gabes", label: "Gabès" },
  { value: "Medenine", label: "Médenine" },
  { value: "Tataouine", label: "Tataouine" },
  { value: "Gafsa", label: "Gafsa" },
  { value: "Tozeur", label: "Tozeur" },
  { value: "Kebili", label: "Kébili" },
];

// Notification function
const sendNotificationToDrivers = async (command,driver) => {
  // Prepare ride info
  const rideInfo = {
    type: "new_command",
    
    coordonneFrom: {
      longitude:  command?.data?.pickUpAddress?.coordonne?.latitude,
      latitude:  command?.data?.pickUpAddress?.coordonne?.latitude,
    },
    coordonneTo: {
      longitude: command?.data?.dropOfAddress?.coordonne?.latitude,
      latitude:  command?.data?.dropOfAddress?.coordonne?.latitude,
    },
    commandId: command?.data?.id,
    refNumber: command?.data?.refNumber,
    price: command?.data?.price || 0,
    time: command?.data?.duration || 0,
    distanceBetweenPickupAndDropoff: command?.data?.distance || 0,
    from: command?.data?.pickUpAddress?.Address||"",
    to: command?.data?.dropOfAddress?.Address||"",
    currentUser: {
      id: command?.data?.client?.id,
      firstName: command?.data?.client?.firstName,
      lastName: command?.data?.client?.lastName,
      phoneNumber: command?.data?.client?.phoneNumber
    },
   
  };

  return axios.post(
    'https://onesignal.com/api/v1/notifications',
    {
      app_id: ONESIGNAL_DRIVER_APP_ID,
      "include_aliases": {
        "external_id": [String(driver.id)]
      },
      "target_channel": "push",
      headings: { en: 'Nouveau trajet' },
      contents: {
        en: 'Vous avez une nouvelle demande de course !',
        ar: 'لديك طلب رحلة جديد!',
      },
      "mutable_content": true,
      "android_channel_id": 'ec037fdf-e9b4-4020-babd-181a1dd77ad4',
      priority: 10,
      data: rideInfo,
    },
    {
      headers: {
        Authorization: `Basic ${ONESIGNAL_DRIVER_APP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  );
};

const ReserveModal = ({ reservationId, open, setOpen, ping, setPing, carType, refNumber }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const [driversList, setDriversList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [driverStatuses, setDriverStatuses] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [requestingDrivers, setRequestingDrivers] = useState({});
  const [reservationBody, setReservationBody] = useState({
    id: reservationId,
    data: {
      driver: "",
      region: "",
    },
  });
   useEffect(() => {
    setReservationBody(prev => ({ ...prev, id: reservationId }));
  }, [reservationId]);

  // Firebase listener for driver statuses
  useEffect(() => {
    if (open) {
      const driversRef = ref(database, "drivers");
      const unsubscribe = onValue(driversRef, (snapshot) => {
        const firebaseData = snapshot.val();
        if (firebaseData) {
          const statuses = Object.entries(firebaseData).reduce((acc, [id, driver]) => {
            acc[id] = {
              isFree: driver?.isFree || false,
              isActive: driver?.isActive || false,
              lastSeen: driver?.lastSeen,
              lastUpdated: driver?.lastUpdated
            };
            return acc;
          }, {});
          setDriverStatuses(statuses);
        }
      });

      return () => unsubscribe();
    }
  }, [open]);

  useEffect(() => {
    const fetchDriversWithVehicleTypeAndRegion = async () => {
      try {
        setLoading(true);
        const jwt = localStorage.getItem("token");
        
        // Build query parameters
        const params = {
          'filters[user_role][$eq]': 'driver',
          'populate[0]': 'vehicule',
          'populate[1]': 'vehicule.type'
        };

        // Add region filter if selected
        console.log("selectedRegion",selectedRegion)
        if (selectedRegion) {
          params['filters[region][$eq]'] = selectedRegion;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}users/`,
          {
            params,
            headers: { Authorization: `Bearer ${jwt}` }
          }
        );

        // Filter drivers with vehicle type ID
        const filteredDrivers = response.data.filter(
          driver => driver?.vehicule?.type?.id === carType
        );

        setDriversList(filteredDrivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDriversWithVehicleTypeAndRegion();
    }
  }, [open, carType, selectedRegion]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    setSelectedDriver(null);
    setSelectedRegion(null);
    setSearchText("");
    setStatusFilter('all');
    setRequestingDrivers({});
  }, [setOpen]);

  const handleReservation = useCallback(async () => {
    if (!selectedDriver || !selectedRegion) return;

    try {
      await dispatch(updateReservation({
        ...reservationBody,
        data: {
          ...reservationBody.data,
          driver: selectedDriver.documentId,
          region: selectedRegion,
        },
      }));
      await dispatch(getCommandDetailsById(reservationId));
      setPing(prev => !prev);
      dispatch(getReservations());
      handleCancel();
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  }, [dispatch, reservationBody, reservationId, setPing, handleCancel, selectedDriver, selectedRegion]);

  const handleDriverSelect = useCallback((driver) => {
    setSelectedDriver(driver);
  }, []);

  const handleRegionSelect = useCallback((value) => {
    setSelectedRegion(value);
  }, []);

  const handleRequestDriver = useCallback(async (driver) => {
    if (!currentUser) {
      message.error("Vous devez être connecté pour faire une demande");
      return;
    }

    try {
      // Fetch reservation details
      const jwt = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}commands/${reservationId}?populate[0]=pickUpAddress&populate[1]=pickUpAddress.coordonne&populate[2]=dropOfAddress&populate[3]=dropOfAddress.coordonne&populate[4]=client`,
        {
          headers: { Authorization: `Bearer ${jwt}` }
        }
      );

      const command = response.data;
      console.log("Command data:", command);

      const requestId = `request_${Date.now()}`;
      const requestRef = ref(database, `rideRequests/${requestId}`);
       
      // Create request object with command data
      const requestData = {
        status: "searching",
        orderId: command?.data?.documentId,
        refNumber: command?.data?.refNumber,
        price: command?.data?.totalPrice || 0,
        time: command?.data?.duration || 0,
        distance: command?.data?.distance || 0,
      reservation:true,
        pickupAddress : {
          latitude: command?.data?.pickUpAddress?.coordonne?.latitude|| 0,
          longitude:command?.data?.pickUpAddress?.coordonne?.longitude|| 0,
          address:command?.data?.pickUpAddress?.Address||"",
        },
        dropAddress  : {
          latitude: command?.data?.dropOfAddress?.coordonne?.latitude|| 0,
          longitude:command?.data?.dropOfAddress?.coordonne?.longitude|| 0,
          address:command?.data?.dropOfAddress?.Address||"",

        },
        user: {
          id: command?.data?.client?.id,
          firstName: command?.data?.client?.firstName,
          lastName: command?.data?.client?.lastName,
          phoneNumber: command?.data?.client?.phoneNumber
        },
        notifiedDrivers:{
          [driver.id]:true
        }
       
       
      };
      sendNotificationToDrivers(command,driver).then(res=>{
      
      }).catch(err=>console.log(err))
      // Set the request in Firebase
      await set(requestRef, requestData);
      setRequestingDrivers(prev => ({ ...prev, [driver.documentId]: requestId }));

      // Set timeout to remove request after 50 seconds
      const timeoutId = setTimeout(() => {
        remove(requestRef);
        setRequestingDrivers(prev => {
          const newState = { ...prev };
          delete newState[driver.documentId];
          return newState;
        });
        message.info("Le temps de réponse est écoulé");
      }, 45000);

      // Set up listener for driver response
      const unsubscribe = onValue(requestRef,async (snapshot) => {
        const request = snapshot.val();
        if (request) {
          if (request.status==="accepted") {
            // Clear the timeout to prevent removing the requestRef
            clearTimeout(timeoutId);
            message.success("Le chauffeur a accepté votre demande!");
           
            unsubscribe();
          
            await dispatch(getCommandDetailsById(reservationId));
            setPing(prev => !prev);
            dispatch(getReservations());
            handleCancel();
          }
        }
      });

    } catch (error) {
      console.error("Error creating request:", error);
      message.error("Erreur lors de la création de la demande");
    }
  }, [currentUser, selectedRegion, setPing, reservationId]);

  const getDriverStatus = (driverId) => {
    const status = driverStatuses[driverId];
    if (!status) return { color: 'default', text: 'Offline' };
    
    if (!status.isActive) return { color: 'error', text: 'Offline' };
    if (!status.isFree) return { color: 'warning', text: 'Occupe' };
    return { color: 'success', text: 'Disponible' };
  };

  const filteredDrivers = driversList.filter(driver => {
    // Text filter
    const matchesText = `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchText.toLowerCase());
    if (!matchesText) return false;

    // Status filter
    if (statusFilter !== 'all') {
      const status = driverStatuses[driver.documentId];
      if (!status) return false;

      switch (statusFilter) {
        case 'disponible':
          return status.isActive && status.isFree;
        case 'occupe':
          return status.isActive && !status.isFree;
        case 'offline':
          return !status.isActive;
        default:
          return true;
      }
    }

    return true;
  });

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      closable={false}
      title={`Réservez la commande numéro ${refNumber} à un chauffeur`}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Annuler
        </Button>,
        <Button
          key="reserve"
          type="primary"
          style={customStyles.requestButton}
          disabled={!selectedDriver || !selectedRegion}
          onClick={handleReservation}
        >
          Réserver
        </Button>,
      ]}
    >
      <div className="reservation-modal" style={{ padding: "20px 0" }}>
        <Form layout="vertical" style={{width:"-webkit-fill-available"}}>
          <Form.Item label="Région" required>
            <Select
              placeholder="Sélectionner une région"
              options={tunisianRegions}
              onChange={handleRegionSelect}
              value={selectedRegion}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <div style={customStyles.filterRow}>
            <Form.Item label="Statut" style={{ marginBottom: 0, flex: 1 }}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={customStyles.filterSelect}
                options={[
                  { value: 'all', label: 'Tous' },
                  { value: 'disponible', label: 'Disponible' },
                  { value: 'occupe', label: 'Occupe' },
                  { value: 'offline', label: 'Offline' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Rechercher" style={{ marginBottom: 0, flex: 2 }}>
              <Input
                placeholder="Saisir le nom du chauffeur..."
                prefix={<SearchOutlined style={{ color: "#dbb961" }} />}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                style={customStyles.searchInput}
              />
            </Form.Item>
          </div>

          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={filteredDrivers}
            style={{
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #f0f0f0",
              borderRadius: "8px",
            }}
            renderItem={(driver) => {
              const status = getDriverStatus(driver.documentId);
              const isRequesting = requestingDrivers[driver.documentId];
              const isDriverAvailable = status.color === 'success';

              return (
                <List.Item
                  onClick={() => handleDriverSelect(driver)}
                  style={{
                    ...customStyles.listItem,
                    ...(selectedDriver?.id === driver.id ? customStyles.selectedItem : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDriver?.id !== driver.id) {
                      e.currentTarget.style.backgroundColor = customStyles.listItemHover.backgroundColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDriver?.id !== driver.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={driver?.profilePicture?.url}
                        style={{ width: 40, height: 40 }}
                      >
                        {!driver?.profilePicture?.url && `${driver.firstName?.[0]}${driver.lastName?.[0]}`}
                      </Avatar>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{`${driver.firstName} ${driver.lastName}`}</span>
                        <Tag color={status.color}>{status.text}</Tag>
                      </div>
                    }
                    description={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{`Téléphone: ${driver.phoneNumber || "N/A"}`}</span>
                        <Button
                          type="primary"
                          style={isRequesting || !isDriverAvailable ? customStyles.requestButtonDisabled : customStyles.requestButton}
                          disabled={isRequesting || !isDriverAvailable}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequestDriver(driver);
                          }}
                        >
                          {isRequesting ? "Demande en cours..." : "Demander"}
                        </Button>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
            locale={{
              emptyText: "Aucun chauffeur disponible",
            }}
          />
        </Form>
      </div>

      
    </Modal>
  );
};

ReserveModal.propTypes = {
  reservationId: PropTypes.shape({
    refNumber: PropTypes.string,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  ping: PropTypes.bool.isRequired,
  setPing: PropTypes.func.isRequired,
  carType: PropTypes.number.isRequired,
  refNumber: PropTypes.string.isRequired,
};

export default ReserveModal;
