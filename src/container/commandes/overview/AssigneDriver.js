import React, { useState, useEffect, useMemo } from "react";
import { Form, AutoComplete, Modal } from "antd";
import { Button } from "../../../components/buttons/buttons";
import { useDispatch, useSelector } from "react-redux";
import propTypes from "prop-types";
import { updateDriver, getDriverList } from "../../../redux/User/userSlice";
import { sendNotification } from "../../../redux/notifications/notificationSlice";
import { updateReservation } from "../../../redux/reservations/reservationSlice";
import CommandStatus from "../../../utility/enums/commandStatus";
import axios from "axios";

const AssignDriver = ({ visible, onCancel, record, setPing, ping }) => {
  console.log("🚀 ~ AssignDriver ~ record:", record);
  const dispatch = useDispatch();

  const drivers = useSelector((state) => state?.user?.driverList);
  const currentUser = useSelector((state) => state?.user?.currentUser);

  const [options, setOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [toUpdate, setToUpdate] = useState({
    data: { driver_id: "", commandStatus: CommandStatus.ASSIGNED_TO_DRIVER },
  });

  const companyId = useSelector(
    (store) => store?.reservations?.viewedCommand?.company_id?.documentId
  );
  console.log("🚀 ~ AssignDriver ~ companyId:", companyId);
  // const companyId = record?.company_id?.documentId;

  // Populate driver options based on available drivers
  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (companyId) {
      const companyDrivers = axios
        .post(
          `${process.env.REACT_APP_BACKUP_URL}userslist/company-drivers`,
          { companyId: companyId },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        )
        .then((res) => {
          console.log("🚀 ~ useEffect ~ res:", res.data);
          const availableDrivers = res.data.filter((driver) => driver);
          const updatedOptions = availableDrivers.map((driver) => ({
            value: driver?.documentId || "",
            label: (
              <span>
                <img
                  src={driver?.profilePicture?.url || "../../images/Avatar.svg"}
                  alt="Profile"
                  style={{ marginRight: "8px", width: "34px", height: "34px" }}
                />
                {driver?.firstName || ""} {driver?.lastName || ""}
              </span>
            ),
            fullName: `${driver?.firstName} ${driver?.lastName}`.toUpperCase(),
          }));
          setOptions(updatedOptions);
        });
      // console.log("🚀 ~ useEffect ~ companyDrivers:", companyDrivers);
    }
  }, [drivers, companyId]);

  // Fetch drivers list when modal is opened
  // useEffect(() => {
  //   if (visible) {
  //     dispatch(getDriverList({ companyId }));
  //   }
  // }, [visible, companyId, dispatch]);

  const handleSelectDriver = (driverId) => {
    const selectedDriver = options.find((option) => option.value === driverId);
    setToUpdate((prev) => ({
      ...prev,
      data: { ...prev.data, driver_id: driverId },
    }));
    setSelectedLabel(
      `${selectedDriver?.label.props.children[1]} ${selectedDriver?.label.props.children[3]}`
    );
  };

  const handleSave = async () => {
    const previousDriverId = toUpdate?.data?.driver_id;
    const currentDriverId = record?.driver_id;

    if (!previousDriverId) return; // Ensure a driver is selected

    try {
      await dispatch(
        updateReservation({ id: record?.documentId, data: toUpdate.data })
      ).then(() => {
        setPing(!ping);
        onCancel();
      }); // Close the modal);

      // Update drivers' availability
      if (currentDriverId) {
        dispatch(
          updateDriver({ id: currentDriverId?.documentId, isFree: true })
        );
      }
      dispatch(updateDriver({ id: previousDriverId, isFree: false }));

      // Send notification to the driver
      // dispatch(
      //   sendNotification({
      //     id: previousDriverId,
      //     title: "Vous avez été assigné à une commande.",
      //     sendFrom: {
      //       id: currentUser?.documentId,
      //       name: currentUser?.name,
      //     },
      //     command: record?.documentId,
      //     notification_type: "dispatched",
      //     types: ["notification", "email"],
      //     smsCore: `${currentUser?.name} vous a assigné à la commande numéro : ${record?.refNumber}`,
      //     notificationCore: "Vous avez une notification",
      //     saveNotification: true,
      //     template_id: "d-8b266aac7fd64f73bab6ee0c80df8dbd",
      //     dynamicTemplateData: {
      //       commandeid: record?.documentId,
      //     },
      //   })
      // );
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const [form] = Form.useForm();
  const isSaveDisabled = !toUpdate.data.driver_id;

  return (
    <Modal
      title="Assigner un Chauffeur"
      visible={visible}
      footer={null}
      onCancel={onCancel}
    >
      <div className="reservation-modal">
        <form className="create_reservation_form">
          <span>Chauffeur</span>
          <AutoComplete
            className="create_reservation_select"
            options={options}
            onSelect={handleSelectDriver}
            placeholder={
              options.length === 0
                ? "Aucun Chauffeur disponible pour cette société :("
                : "Saisir le nom du Chauffeur ..."
            }
            value={selectedLabel}
            onChange={setSelectedLabel}
            filterOption={(inputValue, option) =>
              option.fullName.includes(inputValue.toUpperCase())
            }
          />
        </form>
      </div>

      <div className="project-modal-footer">
        <Button size="default" outlined onClick={onCancel}>
          Annuler
        </Button>
        <Button
          size="default"
          type="primary"
          disabled={isSaveDisabled}
          onClick={handleSave}
        >
          Sauvegarder
        </Button>
      </div>
    </Modal>
  );
};

AssignDriver.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  record: propTypes.object,
  setPing: propTypes.func.isRequired,
  ping: propTypes.bool.isRequired,
};

export default AssignDriver;
