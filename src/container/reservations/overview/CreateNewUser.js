import React, { useState, useEffect } from "react";
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
} from "antd";

import propTypes from "prop-types";

import { useDispatch } from "react-redux";

import { getusers, registerUser } from "../../../redux/User/userSlice";
import { Button } from "../../../components/buttons/buttons";

function CreateNewUser({ visible, onCancel, newUser, setnewUser }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getusers());
  }, []);

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
    onCancel(false);
  };

  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!newUser?.firstName) {
      errors.firstName = "First name is required.";
    }

    if (!newUser?.lastName) {
      errors.lastName = "Last name is required.";
    }

    if (!newUser.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }

    if (!newUser.email) {
      errors.email = "Email is required.";
    }

    if (!newUser.password) {
      errors.password = "Password is required.";
    }

    if (newUser.password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!newUser?.adress) {
      errors.adress = "Address is required.";
    }

    setInputErrors(errors);

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleOk = () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      dispatch(registerUser(newUser));
      setnewUser({
        username: "",
        email: "",
        phoneNumber: null,
        user_role: "client",
        password: "",
        accountOverview: [
          {
            __component: "section.client",
            firstName: "",
            lastName: "",
            adress: "",
          },
        ],
      });
      setConfirmPassword("");
      handleCancel();
    }
  };

  return (
    <>
      <div className="reservation-modal">
        <p className="sectionModalAdd">Information du client</p>

        <div className="newUserModal">
          <div className="create_reservation_details modalInput">
            <span>Nom du client</span>
            <Input
              placeholder="Nom du client.."
              value={newUser?.firstName}
              onChange={(e) => {
                const updatedAccountOverview = {
                  ...newUser?.accountOverview[0],
                  firstName: e.target.value,
                };
                setnewUser({
                  ...newUser,
                  accountOverview: [updatedAccountOverview],
                });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  firstName: null,
                }));
              }}
            />
            {inputErrors.firstName && (
              <div style={{ color: "red" }}>{inputErrors.firstName}</div>
            )}
          </div>

          <div className="create_reservation_details modalInput">
            <span>Prénom du client</span>
            <Input
              placeholder="Prénom du client.."
              value={newUser?.lastName}
              onChange={(e) => {
                const updatedAccountOverview = {
                  ...newUser?.accountOverview[0],
                  lastName: e.target.value,
                };
                setnewUser({
                  ...newUser,
                  accountOverview: [updatedAccountOverview],
                });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  lastName: null,
                }));
              }}
            />
            {inputErrors.lastName && (
              <div style={{ color: "red" }}>{inputErrors.lastName}</div>
            )}
          </div>

          <div className="create_reservation_details modalInput">
            <span>Numéro de téléphone</span>
            <Input
              placeholder="Numéro de téléphone.."
              value={newUser.phoneNumber}
              onChange={(e) => {
                setnewUser({
                  ...newUser,
                  phoneNumber: e.target.value,
                });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  phoneNumber: null,
                }));
              }}
            />
            {inputErrors.phoneNumber && (
              <div style={{ color: "red" }}>{inputErrors.phoneNumber}</div>
            )}
          </div>

          <div className="create_reservation_details modalInput">
            <span>Adresse e-mail</span>
            <Input
              placeholder="adresse e-mail.."
              value={newUser.email}
              onChange={(e) => {
                setnewUser({
                  ...newUser,
                  email: e.target.value,
                  username: e.target.value,
                });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  email: null,
                }));
              }}
            />
            {inputErrors.email && (
              <div style={{ color: "red" }}>{inputErrors.email}</div>
            )}
          </div>
          <div className="create_reservation_details">
            <span>Adresse du client</span>
            <Input
              placeholder="adresse du client.."
              value={newUser?.adress}
              onChange={(e) => {
                const updatedAccountOverview = {
                  ...newUser?.accountOverview[0],
                  adress: e.target.value,
                };
                setnewUser({
                  ...newUser,
                  accountOverview: [updatedAccountOverview],
                });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  adress: null,
                }));
              }}
            />
            {inputErrors.adress && (
              <div style={{ color: "red" }}>{inputErrors.adress}</div>
            )}
          </div>
          <div className="create_reservation_details">
            <span>Mot de passe</span>
            <Input
              placeholder="Mot de passe.."
              value={newUser.password}
              type="password"
              onChange={(e) => {
                setnewUser({ ...newUser, password: e.target.value });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  password: null,
                }));
              }}
            />
            {inputErrors.password && (
              <div style={{ color: "red" }}>{inputErrors.password}</div>
            )}
          </div>

          <div className="create_reservation_details">
            <span>Confirmer le mot de passe</span>
            <Input
              placeholder="Confirmer le mot de passe.."
              value={confirmPassword}
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  confirmPassword: null,
                }));
              }}
            />
            {inputErrors.confirmPassword && (
              <div style={{ color: "red" }}>{inputErrors.confirmPassword}</div>
            )}
          </div>
        </div>
      </div>
      <div key="1" className="project-modal-footer-addUser">
        <Button
          size="default"
          className="btn_Suivant"
          key="back"
          onClick={handleCancel}
        >
          Annuler
        </Button>

        <Button
          size="default"
          key="submit"
          onClick={handleOk}
          className="btn_Suivant"
        >
          Enregistré
        </Button>
      </div>
    </>
  );
}

CreateNewUser.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateNewUser;
