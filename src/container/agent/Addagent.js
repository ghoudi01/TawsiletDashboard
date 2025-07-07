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
    region: "",
  });

  useEffect(() => {
    setLocalVisible(visible);
  }, [visible]);

  const isInputValid = () => {
    const { email, phoneNumber, password, user_role, region } = addagent;
    const errors = {};

    if (!email) errors.email = "Veuillez saisir votre e-mail.";
    if (!phoneNumber)
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    if (!password) errors.password = "Veuillez saisir un mot de passe.";
    if (!addagent?.firstName) errors.firstName = "Veuillez saisir votre nom.";
    if (!addagent?.lastName) errors.lastName = "Veuillez saisir votre prénom.";
    if ((user_role === "agent_collect" || user_role === "agent_verification") && !region) {
      errors.region = "Veuillez sélectionner une région.";
    }
    
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
    { label: "agent collect $", value: "agent_collect" },
    { label: "agent verification", value: "agent_verification" },
  ];

  const tunisiaRegions = [
    { label: "Global", value: "global" },
    { label: "Ariana", value: "Ariana" },
    { label: "Beja", value: "Beja" },
    { label: "Ben Arous", value: "Ben Arous" },
    { label: "Bizerte", value: "Bizerte" },
    { label: "Gabes", value: "Gabes" },
    { label: "Gafsa", value: "Gafsa" },
    { label: "Jendouba", value: "Jendouba" },
    { label: "Kairouan", value: "Kairouan" },
    { label: "Kasserine", value: "Kasserine" },
    { label: "Kebili", value: "Kebili" },
    { label: "Kef", value: "Kef" },
    { label: "Mahdia", value: "Mahdia" },
    { label: "Manouba", value: "Manouba" },
    { label: "Medenine", value: "Medenine" },
    { label: "Monastir", value: "Monastir" },
    { label: "Nabeul", value: "Nabeul" },
    { label: "Sfax", value: "Sfax" },
    { label: "Sidi Bouzid", value: "Sidi Bouzid" },
    { label: "Siliana", value: "Siliana" },
    { label: "Sousse", value: "Sousse" },
    { label: "Tataouine", value: "Tataouine" },
    { label: "Tozeur", value: "Tozeur" },
    { label: "Tunis", value: "Tunis" },
    { label: "Zaghouan", value: "Zaghouan" }
  ];

  const showRegionField = addagent?.user_role === "agent_collect" || addagent?.user_role === "agent_verification";

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

      {showRegionField && (
        <Col sm={12} xs={24} className="mb-25">
          <Form.Item
            label="Région"
            validateStatus={Inputerrors.region ? "error" : ""}
            help={Inputerrors.region}
            required={showRegionField}
          >
            <Select
              placeholder="Sélectionnez une région"
              value={addagent?.region}
              onChange={(value) => {
                setInputErrors((prev) => ({ ...prev, region: null }));
                setaddAgent((prev) => ({
                  ...prev,
                  region: value,
                }));
              }}
              options={tunisiaRegions}
            />
          </Form.Item>
        </Col>
      )}

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
                // Clear region when role changes
                region: value === "agent_collect" || value === "agent_verification" ? prev.region : "",
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
