import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Modal, Row, Col, Select } from "antd";
import propTypes from "prop-types";
import { message } from "antd";

import { Button } from "../../components/buttons/buttons";
import { getusers, registerAgent } from "../../redux/User/userSlice";

const Addagent = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const [Inputerrors, setInputErrors] = useState({});
  const [localVisible, setLocalVisible] = useState(visible);
  const [modalType] = useState("primary");

  const [addagent, setaddAgent] = useState({
    username: "",
    email: "",
    phoneNumber: null,
    confirmed: true,
    user_role: null,
    password: "",
    firstName: "",
    lastName: "",
    address: "",
  });

  useEffect(() => {
    setLocalVisible(visible);
  }, [visible]);

  const isInputValid = () => {
    const { email, phoneNumber, password } = addagent;
    const errors = {};

    if (!email) errors.email = "Veuillez saisir votre e-mail.";
    if (!phoneNumber)
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    if (!password) errors.password = "Veuillez saisir un mot de passe.";
    if (!addagent?.firstName) errors.firstName = "Veuillez saisir votre nom.";
    if (!addagent?.lastName) errors.lastName = "Veuillez saisir votre prénom.";
    if (!addagent?.address) errors.address = "Veuillez saisir votre adresse.";

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const handleSubmit = () => {
    const errors = isInputValid();
    if (errors === true) {
      dispatch(registerAgent(addagent)).then(() => {
        dispatch(getusers());
        message.success("Ajouter avec succès!");
        onCancel();
      });
      setInputErrors({});
    } else {
      setInputErrors(errors);
    }
  };

  return (
    <Modal
      type={modalType}
      title="Ajouter un Agent"
      visible={localVisible}
      className="clientViewModal"
      footer={null}
      onCancel={onCancel}
    >
      <div className="mb-25">
        <p className="ModalagentAdd">Information de l'agent</p>
        <Form name="multi-form" layout="vertical">
          <Row gutter={30}>
            <FormFields
              addagent={addagent}
              Inputerrors={Inputerrors}
              setaddAgent={setaddAgent}
              setInputErrors={setInputErrors}
            />
          </Row>
        </Form>
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: "20px" }}>
        <div className="Horizontal_btn">
          <Button className="btn_Suivant" type="primary" onClick={handleSubmit}>
            Sauvegarder
          </Button>
        </div>
      </div>
    </Modal>
  );
};
const FormFields = ({ addagent, Inputerrors, setaddAgent, setInputErrors }) => {
  const role = [
    { label: "agent dispatch", value: "agent_dispatch" },
    { label: "agent chef", value: "agent_chef" },
    { label: "agent finance", value: "agent_finance" },
    { label: "agent collect", value: "agent_collect" },
  ];

  return (
    <>
      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Nom d'agent"
          validateStatus={Inputerrors.firstName ? "error" : ""}
          help={Inputerrors.firstName}
        >
          <Input
            placeholder="Nom d'agent"
            value={addagent?.firstName}
            onChange={(e) =>
              setaddAgent((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
          />
        </Form.Item>
      </Col>

      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Prénom d'agent"
          validateStatus={Inputerrors.lastName ? "error" : ""}
          help={Inputerrors.lastName}
        >
          <Input
            placeholder="Prénom d'agent"
            value={addagent?.lastName}
            onChange={(e) =>
              setaddAgent((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
          />
        </Form.Item>
      </Col>

      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Numéro de téléphone"
          validateStatus={Inputerrors.phoneNumber ? "error" : ""}
          help={Inputerrors.phoneNumber}
        >
          <Input
            required
            placeholder="Numéro de téléphone"
            value={addagent?.phoneNumber}
            onChange={(e) => {
              setInputErrors((prev) => ({ ...prev, phoneNumber: null }));
              setaddAgent((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }));
            }}
          />
        </Form.Item>
      </Col>

      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Adresse d'agent"
          validateStatus={Inputerrors.address ? "error" : ""}
          help={Inputerrors.address}
        >
          <Input
            placeholder="Adresse d'agent"
            value={addagent?.address}
            onChange={(e) =>
              setaddAgent((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </Form.Item>
      </Col>

      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Adresse e-mail"
          validateStatus={Inputerrors.email ? "error" : ""}
          help={Inputerrors.email}
        >
          <Input
            placeholder="Adresse e-mail"
            value={addagent?.email}
            onChange={(e) =>
              setaddAgent((prev) => ({
                ...prev,
                email: e.target.value,
                username: e.target.value,
              }))
            }
          />
        </Form.Item>
      </Col>

      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Mot de passe"
          validateStatus={Inputerrors.password ? "error" : ""}
          help={Inputerrors.password}
        >
          <Input.Password
            placeholder="Mot de passe.."
            value={addagent?.password}
            onChange={(e) =>
              setaddAgent((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </Form.Item>
      </Col>

      <Col sm={12} xs={24} className="mb-25">
        <Form.Item
          label="Role"
          validateStatus={Inputerrors.user_role ? "error" : ""}
          help={Inputerrors.user_role}
        >
          <Select
            placeholder="Choisissez un indicatif"
            value={addagent?.user_role}
            onChange={(value) => {
              setInputErrors((prev) => ({ ...prev, user_role: null }));
              setaddAgent((prev) => ({
                ...prev,
                user_role: value,
              }));
            }}
            options={role}
          />
        </Form.Item>
      </Col>
    </>
  );
};

Addagent.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default Addagent;
