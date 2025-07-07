import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  message,
  Upload,
  Spin,
  Modal,
  Steps,
} from "antd";
import { Link } from "react-router-dom";
import propTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { RecordFormWrapper } from "../../container/crud/axios/Style";
import { PageHeader } from "../../components/page-headers/page-headers";
import { Cards } from "../../components/cards/frame/cards-frame";
import { Button } from "../../components/buttons/buttons";
import { Main, BasicFormWrapper, ImportStyleWrap } from "../styled";
import {
  axiosDataSubmit,
  axiosFileUploder,
  axiosFileClear,
} from "../../redux/crud/axios/actionCreator";
import Heading from "../../components/heading/heading";
import images from "../../static/img/Media.png";
import Dragger from "antd/lib/upload/Dragger";
import { AddProductForm } from "../livreur/style";
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

const UpdateAdmin = ({ visible, onCancel, match, modalId }) => {
  const dispatch = useDispatch();

  const adminUpdate = useSelector((state) => state.user.getted);
   const currentId = useSelector((state) => state?.user?.currentUser?.id);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const [updateadmin, setupdateAdmin] = useState({
    phoneNumber: "",
    user_role: "admin",
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

  useEffect(() => {
    setupdateAdmin({
      phoneNumber: modalId?.phoneNumber,
      password: modalId?.password,
      user_role: "admin",
      ...modalId,
      accountOverview: [
        {
          __component: "section.client",
          firstName: modalId?.firstName,
          lastName: modalId ? modalId?.lastName : "null",
          adress: modalId ? modalId?.adress : "null",
        },
      ],
    });
  }, [modalId]);

  // validation
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Inputerrors, setInputErrors] = useState({});
  const isInputValid = () => {
    const errors = {};

    if (!updateadmin?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    }

    if (!updateadmin?.firstName) {
      errors.firstName = "Veuillez saisir votre nom.";
    }
    if (!updateadmin?.lastName) {
      errors.lastName = "Veuillez saisir votre prénom.";
    }
    if (!updateadmin?.adress) {
      errors.adress = "Veuillez saisir votre adresse.";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };
  // const { token } = theme.useToken();

  const next = () => {
    const errors = isInputValid();
    if (errors === true) {
      Modal.confirm({
        title: "Confirmation des modifications",
        content:
          "Etes vous sure de vouloir Modifier les coordonnées de cet Agent?",
        okText: "Oui",
        okType: "danger",
        cancelText: "Annuler",
        onOk() {
          dispatch(updateUser({ id: modalId?.id, user: updateadmin })).then(
            () => dispatch(getusers())
          );
          handleCancel();
        },
        onCancel() {},
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
        title={`Modifier l'admin N°${modalId?.id}`}
        visible={state.visible}
        className="ModalagentAdd "
        footer={null}
        onCancel={handleCancel}
      >
        <>
          {/*<Steps current={current} items={items} /> */}

          <BasicFormWrapper className="mb-25 ">
            <p className="ModalagentAdd">Information d'admin</p>
            <Form name="multi-form" layout="horizontal">
              <Row gutter={30}>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item
                    name="sDash_f-name"
                    label="Nom d'admin"
                    validateStatus={Inputerrors.firstName ? "error" : ""}
                    help={Inputerrors.firstName}
                  >
                    <Input
                      value={
                        updateadmin &&
                        updateadmin?.firstName
                      }
                      placeholder={
                        updateadmin &&
                        updateadmin?.firstName
                      }
                      onChange={(e) => {
                        setupdateAdmin({
                          ...updateadmin,
                          accountOverview: [
                            {
                              ...updateadmin?.accountOverview[0],
                              firstName: e.target.value,
                            },
                          ],
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item
                    name="sDash_l-name"
                    label="Prénom d'admin"
                    validateStatus={Inputerrors.lastName ? "error" : ""}
                    help={Inputerrors.lastName}
                  >
                    <Input
                      value={
                        updateadmin && updateadmin.accountOverview[0]
                          ? updateadmin.lastName
                          : ""
                      }
                      placeholder={
                        updateadmin && updateadmin.accountOverview[0]
                          ? updateadmin.lastName
                          : ""
                      }
                      onChange={(e) => {
                        setupdateAdmin({
                          ...updateadmin,
                          accountOverview: [
                            {
                              ...updateadmin?.accountOverview[0],
                              lastName: e.target.value,
                            },
                          ],
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item
                    name="sDash_city"
                    label="Numéro de téléphone"
                    validateStatus={Inputerrors.phoneNumber ? "error" : ""}
                    help={Inputerrors.phoneNumber}
                  >
                    <Input
                      placeholder={updateadmin?.phoneNumber}
                      value={updateadmin?.phoneNumber}
                      onChange={(e) => {
                        setupdateAdmin({
                          ...updateadmin,
                          phoneNumber: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item
                    name="sDash_email"
                    label="Adresse d'admin"
                    validateStatus={Inputerrors.adress ? "error" : ""}
                    help={Inputerrors.adress}
                  >
                    <Input
                      placeholder={
                        updateadmin
                          ? updateadmin?.adress
                          : null
                      }
                      value={
                        updateadmin
                          ? updateadmin?.adress
                          : null
                      }
                      onChange={(e) => {
                        setupdateAdmin({
                          ...updateadmin,
                          accountOverview: [
                            {
                              ...updateadmin?.accountOverview[0],
                              adress: e.target.value,
                            },
                          ],
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item name="sDash_country" label="Adresse e-mail">
                    <Input
                      placeholder={modalId?.email}
                      disabled
                      value={modalId?.email}
                      // onChange={(e) => {
                      //   setupdateAdmin({
                      //     ...updateadmin,
                      //     email: e.target.value,
                      //     username: e.target.value,
                      //   });
                      // }}
                    />
                  </Form.Item>
                </Col>

                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item name="password" label="Mot de passe">
                    <Input.Password
                      style={{ color: "red" }}
                      placeholder={updateadmin?.password || "***************"}
                      disabled
                      value={updateadmin?.password || "***************"}
                      // onChange={(e) => {
                      //   setupdateAdmin({
                      //     ...updateadmin,
                      //     password: e.target.value,
                      //   });
                      // }}
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
        </>
      </Modal>
    </>
  );
};
UpdateAdmin.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};
export default UpdateAdmin;
