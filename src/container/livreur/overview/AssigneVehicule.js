import React, { useState, useEffect, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  DatePicker,
  Badge,
  Dropdown,
  Menu,
  AutoComplete,
} from "antd";

import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";
import { Modal } from "antd";
import { CheckboxGroup } from "../../../components/checkbox/checkbox";
import { BasicFormWrapper } from "../../styled";
import { useDispatch } from "react-redux";
import {
  getDriver,
  getVehiculeList,
  getusers,
  updateUser,
} from "../../../redux/User/userSlice";
import { useSelector } from "react-redux";
import {
  createNewReservation,
  getReservations,
  updateReservation,
} from "../../../redux/reservations/reservationSlice.js";
import { getVehicule } from "../../../redux/vehicule/vehiculeSlice";
import { sendNotification } from "../../../redux/notifications/notificationSlice";

const { Option } = Select;
const dateFormat = "MM/DD/YYYY";

function AssigneVehicule({ visible, onCancel, usersList, driverDetais }) {
  const dispatch = useDispatch();

  const vehicules = useSelector((state) => state?.user?.vehiculeList);
  const drivers = useSelector((state) => state?.user?.drivers);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentUser = useSelector((store) => store?.user?.currentUser);

 

  const findMatchingId = async (id) => {
    for (const user of usersList) {
      if (user && Array.isArray(user)) {
        for (const account of user) {
          if (account.vehicule_id && account.vehicule_id.id === id) {
            const matchId = user.id;
            if (matchId === driverDetais?.id) {
              return;
            } else {
              const toUpdateBody = {
                    vehicule_id: null,
              };
              await dispatch(
                updateUser({
                  id: matchId,
                  user: toUpdateBody,
                })
              );
            }
          }
        }
      }
    }
    return null; // Return null if no match is found
  };
  const [options, setOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");

  // const [VehiculeList, setVehiculeList] = useState([]);
  const id_societe = driverDetais?.company_id?.id;

  const [toUpdate, setToUpdate] = useState({
    
        vehicule_id: {
          id: driverDetais?.vehicule_id?.id,
        },
    
  });

  // useEffect(() => {
  //   if (vehicules && id_societe) {
  //     setVehiculeList(
  //       vehicules
  //     );
  //   }
  // }, []);

  useEffect(() => {
    if (visible) {
      dispatch(
        getVehiculeList({
          companyId: driverDetais?.company_id?.id,
        })
      );
    }
    // dispatch(
    //   getVehicule(
    //     currentUser.user_role === "company"
    //       ? { user_id: currentUser?.id }
    //       : currentUser.user_role === "agent" && {
    //           user_id: currentUser?.company_id?.id,
    //         }
    //   )
    // );
  }, [visible]);

  const updatedOptions = useMemo(
    () =>
      vehicules?.length > 0 &&
      vehicules?.map((el) => ({
        value: el?.id || "", // Provide a default value for 'value' if 'id' is missing
        label: (
          <span>
            <img
              src={"../../images/Avatar.svg"}
              alt="Profile"
              style={{ marginRight: "8px", width: "34px", height: "34px" }}
            />
            {el?.mark || " nul"} {el?.model || "nul"}
          </span>
        ),
        fullName: (el?.mark + " " + el?.model).toUpperCase(),
      })),
    [vehicules]
  );

  // useEffect(() => {
  //   setToUpdate({

  //     data:{
  //       accountOverview: [
  //         {

  //           vehicule_id:record?.data?.vehicule_id
  //         },
  //       ],
  //     }

  //   });
  // }, [record]);

  useEffect(() => {
    setOptions(updatedOptions);
  }, [updatedOptions]);

  const [form] = Form.useForm();
  const isDisabled = !toUpdate?.vehicule_id;
  const [state, setState] = useState({
    visible,
    modalType: "primary",
    checked: [],
  });

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      setState({
        visible,
      });
    }

    return () => {
      unmounted = true;
    };
  }, [visible]);

  const handleCancel = () => {
    onCancel();
  };
  const [vehiculeid, setVehiculeid] = useState(null);

  return (
    <Modal
      type={state.modalType}
      title="Assigné un Vehicule"
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="reservation-modal">
        <form className="create_reservation_form">
          <span>Voiture</span>
          <AutoComplete
            className="create_reservation_select"
            options={options}
            onSelect={(clientId) => {
              const selectedDriver = options.find(
                (option) => option.value === clientId
              );
              setVehiculeid(clientId);
              setToUpdate((prevToUpdate) => ({
                ...prevToUpdate,
                
                    vehicule_id: { id: clientId },
               
              }));

              setSelectedLabel(
                `${selectedDriver.label.props.children[1]} ${selectedDriver.label.props.children[2]}`
              );
            }}
            placeholder={
              options?.length === 0
                ? "Aucun voiture disponible pour cette société "
                : "Saisir le nom du voiture ..."
            }
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e)}
            filterOption={(inputValue, option) =>
              option.fullName.includes(inputValue.toUpperCase())
            }
          />
        </form>
      </div>
      <div key="1" className="project-modal-footer">
        <Button
          size="default"
          className="btn_Suivant"
          key="back"
          outlined
          onClick={handleCancel}
        >
          Annuler
        </Button>
        <Button
          size="default"
          type="primary"
          className="btn_ADD"
          disabled={isDisabled}
          key="submit"
          onClick={async () => {
            try {
              await findMatchingId(vehiculeid).then(() =>
                dispatch(
                  updateUser({
                    id: driverDetais?.id,
                    user: toUpdate,
                  })
                )
              );

              // Dispatch other actions after updateUser is successful
              dispatch(
                sendNotification({
                  id: driverDetais?.id,
                  title: "Vous avez une notification.",
                  sendFrom: {
                    id: currentUser?.id,
                    name: currentUser?.name,
                  },
                  notification_type: "dispatched",
                  types: ["notification"],
                  smsCore: `${currentUser?.name} vous a assigné la voiture : ${driverDetais?.vehicule_id?.mark} matricule : ${driverDetais?.vehicule_id?.matriculation}`,
                  notificationCore: "vous avez une notification",
                  saveNotification: true,
                  template_id: "d-8b266aac7fd64f73bab6ee0c80df8dbd",
                })
              );

              // Dispatch getDriver action if needed
              dispatch(getDriver({}));

              // Close the modal
              handleCancel();
            } catch (error) {
              // Handle any errors that occur during the updateUser action
              console.error("Error updating user:", error);
              // Optionally, show an error message or notification to the user
            }
          }}
        >
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}

AssigneVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AssigneVehicule;
