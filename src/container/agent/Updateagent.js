import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Spin,
  Modal,
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
    user_role: "agent",
    password: "",
    accountOverview: [
      {
        __component: "section.client",
        company_id: currentId,
        firstName: "",
        lastName: "",
        adress: "",

      },
    ],

  });
  useEffect(() => {
    setupdateAgent({
      phoneNumber: modalId?.phoneNumber,
      password: modalId?.password,
      user_role: "agent",
...modalId,
      accountOverview: [
        {
          __component: "section.client",

          firstName: modalId ? modalId?.firstName : null,
          lastName: modalId ? modalId?.lastName : null,
          adress: modalId ? modalId?.adress : null,
        },
      ],
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
  if (!updateagent?.adress) {
    errors.adress = "Veuillez saisir votre adresse.";
  }

  return Object.keys(errors).length === 0 ? true : errors;
};


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
        dispatch(
          updateUser({ id: modalId?.id, user: updateagent })
        ).then(() => dispatch(getusers()));
        handleCancel();
      },
      onCancel() {
        dispatch(getusers());
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
        className="ModalagentAdd "
     
        footer={null}
        onCancel={handleCancel}
      >
       
       <>
          <BasicFormWrapper className="mb-25 ">
            <p className="ModalagentAdd">Information de l'agent</p>
            <Form name="multi-form" layout="horizontal">
              <Row gutter={30}>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item
                    name="sDash_f-name"
                    label="Nom d'agent"
                    validateStatus={Inputerrors.firstName ? "error" : ""}
                    help={Inputerrors.firstName}
                  >
                    <Input
                      placeholder={
                        updateagent
                          ? updateagent?.firstName
                          : null
                      }
                      value={
                        updateagent
                          ? updateagent?.firstName
                          : null
                      }
                      onChange={(e) => {
                        setupdateAgent({
                          ...updateagent,
                          accountOverview: [
                            {
                              ...updateagent?.accountOverview[0],
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
                    label="Prénom d'agent"
                    validateStatus={Inputerrors.lastName ? "error" : ""}
                    help={Inputerrors.lastName}
                  >
                    <Input
                      placeholder={
                        updateagent
                          ? updateagent?.lastName
                          : null
                      }
                      value={
                        updateagent
                          ? updateagent?.lastName
                          : null
                      }
                      onChange={(e) => {
                        setupdateAgent({
                          ...updateagent,
                          accountOverview: [
                            {
                              ...updateagent?.accountOverview[0],
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
                      placeholder={updateagent?.phoneNumber}
                      value={updateagent?.phoneNumber}
                      onChange={(e) => {
                        setupdateAgent({
                          ...updateagent,
                          phoneNumber: e.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={12} xs={24} className="mb-25">
                  <Form.Item
                    name="sDash_email"
                    label="Adresse d'agent"
                    validateStatus={Inputerrors.adress ? "error" : ""}
                    help={Inputerrors.adress}
                  >
                    <Input
                      placeholder={
                        updateagent
                          ? updateagent?.adress
                          : null
                      }
                      value={
                        updateagent
                          ? updateagent?.adress
                          : null
                      }
                      onChange={(e) => {
                        setupdateAgent({
                          ...updateagent,
                          accountOverview: [
                            {
                              ...updateagent?.accountOverview[0],
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
                      //   setupdateAgent({
                      //     ...updateagent,
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
                      placeholder={updateagent?.password || "***************"}
                      disabled
                      value={updateagent?.password || "***************"}
                      // onChange={(e) => {
                      //   setupdateAgent({
                      //     ...updateagent,
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
                next()
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
Updateagent.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};
export default Updateagent;
