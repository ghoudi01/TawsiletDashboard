import React, { useState, useEffect } from "react";
import { Form, Input } from "antd";

import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";
import { Modal } from "../../../components/modals/antd-modals";

import { useDispatch } from "react-redux";
import {
  getClients,
  getusers,
  registerUser,
} from "../../../redux/User/userSlice";

function CreateTicketModal({ visible, onCancel }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (visible) {
      dispatch(getusers());
    }
  }, [visible]);

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

  const [newUser, setnewUser] = useState({
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
        // adress: "",
      },
    ],
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!newUser?.firstName) {
      errors.firstName = "Le prénom est requis.";
    }

    if (!newUser?.lastName) {
      errors.lastName = "Le nom est obligatoire.";
    }

    const phoneNumberRegex = /^[\d\s\-()+]+$/;

    if (!newUser?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    } else if (!phoneNumberRegex.test(newUser?.phoneNumber)) {
      errors.phoneNumber = "Veuillez saisir un numéro de téléphone valide.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newUser?.email) {
      errors.email = "Veuillez saisir votre e-mail.";
    } else if (!emailRegex.test(newUser?.email)) {
      errors.email = "Veuillez saisir une adresse e-mail valide.";
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-|]{8,}$/;

    if (!newUser?.password) {
      errors.password = "Veuillez saisir votre mot de passe.";
    } else if (!passwordRegex.test(newUser.password)) {
      errors.password =
        "Le mot de passe doit contenir au moins un chiffre, une lettre et être d'au moins 8 caractères de long.";
    }

    if (newUser.password !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    // if (!newUser?.adress) {
    //   errors.adress = "L'adresse est requise.";
    // }

    setInputErrors(errors);

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  const handleOk = () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      dispatch(registerUser(newUser)).then(() => dispatch(getClients()));
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
    <Modal
      type={state.modalType}
      title="Créer une nouvelle ticket"
      onOk={handleOk}
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="reservation-modal">
        <p className="sectionModalAdd">Information du ticket</p>

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
              type="number"
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
          {/* <div className="create_reservation_details modalInput">
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
          </div> */}

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

          {/* <div className="create_reservation_details"> */}
          <Form.Item
            wrapperCol={{ sm: 24 }}
            style={{ width: "45%" }}
            name="password"
            label="Mot de passe"
            validateStatus={inputErrors.password ? "error" : ""}
            help={inputErrors.password}
          >
            <Input.Password
              placeholder="Mot de passe.."
              value={newUser?.password}
              onChange={(e) => {
                setnewUser({ ...newUser, password: e.target.value });
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  password: null,
                }));
              }}
            />
          </Form.Item>
          {/* <span>Mot de passe</span>
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
            )} */}
          {/* </div> */}

          {/* <div className="create_reservation_details"> */}
          <Form.Item
            wrapperCol={{ sm: 24 }}
            style={{ width: "45%" }}
            name="password"
            label="Confirmer le mot de passe"
            validateStatus={inputErrors.confirmPassword ? "error" : ""}
            help={inputErrors.confirmPassword}
          >
            <Input.Password
              placeholder="Confirmer le mot de passe"
              value={newUser?.password}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setInputErrors((prevErrors) => ({
                  ...prevErrors,
                  confirmPassword: null,
                }));
              }}
            />
          </Form.Item>
          {/* <span>Confirmer le mot de passe</span>
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
            )} */}
          {/* </div> */}
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
    </Modal>
  );
}

CreateTicketModal.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateTicketModal;
