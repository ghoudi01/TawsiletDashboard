import React, { useEffect, useState, useCallback } from "react";
import { AutoComplete, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

import {
  getCommandDetailsById,
  getReservations,
  updateReservation,
} from "../../../redux/reservations/reservationSlice";

const ReserveModal = ({ reservationId, open, setOpen, ping, setPing,carType,refNumber }) => {
  const dispatch = useDispatch();
  const [driversList, setDriversList] = useState([]);
  const [selectedLabelDriver, setSelectedLabelDriver] = useState("");
  const [reservationBody, setReservationBody] = useState({
    id: reservationId,
    data: {
    
      driver: "",
    },
  });

  useEffect(() => {
    setReservationBody(prev => ({ ...prev, id: reservationId }));
  }, [reservationId]);

  useEffect(() => {
    const fetchDriversWithVehicleType = async () => {
      try {
        const jwt = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}users/`,
          {
            params: {
              'filters[user_role][$eq]': 'driver',
              'populate[0]': 'vehicule',
              'populate[1]': 'vehicule.type'
            },
            headers: { Authorization: `Bearer ${jwt}` }
          }
        );
      

        // Filter drivers with vehicle type ID 1
        const filteredDrivers = response.data.filter(
          driver => driver?.vehicule?.type?.id === carType
        );

        setDriversList(filteredDrivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    if (open) {
      fetchDriversWithVehicleType();
    }
  }, [open]);

  const driverOptions = driversList?.map((driver) => ({
    value: driver?.documentId || "",
    label: `${driver?.firstName || ""} ${driver?.lastName || ""}`,
  }));

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleReservation = useCallback(async () => {
    try {
      console.log(reservationBody)
     await dispatch(updateReservation(reservationBody));
      await dispatch(getCommandDetailsById(reservationId));
      setPing(prev => !prev);
      dispatch(getReservations());
      handleCancel();
    } catch (error) {
      console.error("Error updating reservation:", error);
    }
  }, [dispatch, reservationBody, reservationId, setPing, handleCancel]);

  const handleDriverSelect = useCallback((driverId) => {
    const selectedDriver = driverOptions.find(
      (option) => option.value === driverId
    );

    setReservationBody(prev => ({
      ...prev,
      data: {
        ...prev.data,
        driver: driverId,
      },
    }));
    setSelectedLabelDriver(selectedDriver?.label || "");
  }, [driverOptions]);

  return (
    <Modal
      open={open}
      onOk={handleReservation}
      onCancel={handleCancel}
      closable={false}
      title={`Réservez la commande numéro ${refNumber} à un chauffeur`}
    >
      <AutoComplete
        className="create_reservation_select"
        options={driverOptions}
        onSelect={handleDriverSelect}
        placeholder="Saisir le nom du chauffeur..."
        value={selectedLabelDriver}
        onChange={setSelectedLabelDriver}
        filterOption={(inputValue, option) =>
          option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      />
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
};

export default ReserveModal;
