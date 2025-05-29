import React, { useEffect, useState } from "react";
import { Row, Col, Form, Input, Select, Modal, message } from "antd";
import propTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../components/buttons/buttons";
import { Main, BasicFormWrapper, ImportStyleWrap } from "../styled";
import {
  getUserById,
  loginUserTodash,
  useradd,
  registerUser,
  updateUser,
  getusers,
} from "../../redux/User/userSlice";
const { Option } = Select;
const dateFormat = "YYYY/MM/DD";

const Updateagent = ({ visible, onCancel, match, modalId }) => {
  const dispatch = useDispatch();

  const agentUpdate = useSelector((state) => state.user.getted);
  // console.log("Loading", agentUpdate);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [updateagent, setupdateAgent] = useState({
    phoneNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    blocked: false,
  });
  useEffect(() => {
    setupdateAgent({
      phoneNumber: modalId?.phoneNumber,
      password: modalId?.password,
      ...modalId,
    });
  }, [modalId]);

  // validation
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Inputerrors, setInputErrors] = useState({});
  const isInputValid = () => {
    const errors = {};

    if (!updateagent?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    }

    if (!updateagent?.firstName) {
      errors.firstName = "Veuillez saisir votre nom.";
    }
    if (!updateagent?.lastName) {
      errors.lastName = "Veuillez saisir votre prénom.";
    }
    return Object.keys(errors).length === 0 ? true : errors;
  };

  const next = () => {
    const errors = isInputValid();
    console.log(errors);
    if (errors === true) {
      Modal.confirm({
        title: "Confirmation des modifications",
        content:
          "Êtes-vous sûr de vouloir modifier les coordonnées de cet agent ?",
        okText: "Oui",
        okType: "danger",
        cancelText: "Annuler",
        onOk() {
          dispatch(updateUser({ id: modalId?.id, user: updateagent }))
            .then(() => {
              dispatch(getusers());
              message.success("Modifications enregistrées !");
              handleCancel();
            })
            .catch(() => {
              message.error("Erreur lors de la mise à jour.");
            });
        },
      });

      setInputErrors({});
    } else {
      setInputErrors(errors);
    }
  };
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [state, setState] = useState({
    join: "",
    visible,
    modalType: "primary",
    checked: [],
    values: "",
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

  const handleOk = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  const onChange = (date, dateString) => {
    setState({ join: dateString });
  };

  return (
    <>
      <Modal
        type={state.modalType}
        title={`Modifier l'agent N°${modalId?.id}`}
        visible={state.visible}
        className="ModalagentAdd"
        footer={null}
        onCancel={handleCancel}
      >
        <BasicFormWrapper className="mb-25">
          <p className="ModalagentAdd">Information de l'agent</p>
          <Form name="multi-form" layout="horizontal">
            <Row gutter={30}>
              <Col sm={12} xs={24} className="mb-25">
                <Form.Item
                  label="Nom d'agent"
                  validateStatus={Inputerrors.firstName ? "error" : ""}
                  help={Inputerrors.firstName}
                >
                  <Input
                    placeholder="Nom d'agent"
                    value={updateagent.firstName}
                    onChange={(e) =>
                      setupdateAgent((prev) => ({
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
                    value={updateagent.lastName}
                    onChange={(e) =>
                      setupdateAgent((prev) => ({
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
                    placeholder="Numéro de téléphone"
                    value={updateagent.phoneNumber}
                    onChange={(e) =>
                      setupdateAgent((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>

              <Col sm={12} xs={24} className="mb-25">
                <Form.Item
                  label="Bloqué"
                  validateStatus={Inputerrors.blocked ? "error" : ""}
                  help={Inputerrors.blocked}
                >
                  <Select
                    placeholder="Choisir si bloqué"
                    value={updateagent.blocked}
                    onChange={(value) =>
                      setupdateAgent((prev) => ({
                        ...prev,
                        blocked: value,
                      }))
                    }
                    options={[
                      { label: "Oui", value: true },
                      { label: "Non", value: false },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col sm={12} xs={24} className="mb-25">
                <Form.Item label="Adresse e-mail">
                  <Input
                    placeholder="Adresse e-mail"
                    value={modalId?.email}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col sm={12} xs={24} className="mb-25">
                <Form.Item label="Mot de passe">
                  <Input.Password
                    placeholder={modalId?.password}
                    value={modalId?.password}
                    onChange={(e) =>
                      setupdateAgent((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </BasicFormWrapper>

        <div style={{ marginTop: 24, display: "flex", gap: "20px" }}>
          <div className="Horizontal_btn">
            <Button
              className="btn_Suivant"
              type="primary"
              onClick={() => {
                next();
              }}
            >
              Modifier
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
Updateagent.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};
export default Updateagent;
