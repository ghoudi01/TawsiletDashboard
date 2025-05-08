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
  Switch,
  Modal,
} from "antd";
import UploadNew from "../../../uploadMini/UploadNew";

import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";

import { CheckboxGroup } from "../../../components/checkbox/checkbox";
import { BasicFormWrapper } from "../../styled";
import { useDispatch } from "react-redux";
import {
  getUserById,
  getusers,
  updateUser,
} from "../../../redux/User/userSlice";
import { useSelector } from "react-redux";
import {
  createNewReservation,
  getReservations,
  updateReservation,
} from "../../../redux/reservations/reservationSlice.js";
import { useForm } from "react-hook-form";

const phoneNumberPattern = /^\+\d{1,}-?\d{1,}$/;

function ChangeDriverInfo({ visible, onCancel, record }) {
  const dispatch = useDispatch();

  const toUpdate = useSelector((state) => state?.user?.getted);
  const [InputErrors, setInputErrors] = useState({});
  const { handleSubmit } = useForm();
  const [updatedUser, setUpdatedUser] = useState({
    email: "",
    phoneNumber: null,
    blocked: null,
    confirmed: null,

    user_role: "driver",
    validation: { validation_state: "waiting" },
    accountOverview: [
      {
        __component: "section.driver",
        licenceNumber: "",
        cin: "",
        firstName: "",
        lastName: "",
        company_id: toUpdate
          ? toUpdate?.company_id?.id
          : null,
        cinPictureFront: toUpdate
          ? toUpdate?.cinPictureFront
          : null,
        cinPictureBack: toUpdate
          ? toUpdate?.cinPictureBack
          : null,
        licencePicture: toUpdate
          ? toUpdate?.licencePicture
          : null,
      },
    ],
  });

  const isStep1Valid = () => {
    const { email, phoneNumber } = updatedUser;
    const { licenceNumber, cin, firstName, lastName } =
      updatedUser?.accountOverview[0];
    const errors = {};
    if (!email) {
      errors.email = "email is required";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "phoneNumber is required";
    }
    if (!cin) {
      errors.cin = "cin is required";
    }
    if (!licenceNumber) {
      errors.licenceNumber = "licenceNumber is required";
    }
    if (!firstName) {
      errors.firstName = "firstName is required";
    }
    if (!lastName) {
      errors.lastName = "lastName is required";
    }
    return errors;
  };
  useEffect(() => {
    if (record) {
      dispatch(getUserById(record));
    }
  }, [record]);
  useEffect(() => {
    if (toUpdate) {
      setUpdatedUser({
        email: toUpdate?.email,
        phoneNumber: toUpdate?.phoneNumber,
        blocked: toUpdate?.blocked,
        confirmed: toUpdate?.confirmed,
        validation: { validation_state: "waiting" },
        user_role: "driver",
        accountOverview: [
          {
            __component: "section.driver",
            licenceNumber: toUpdate
              ? toUpdate?.licenceNumber
              : null,
            cin: toUpdate ? toUpdate?.cin : null,
            firstName: toUpdate
              ? toUpdate?.firstName
              : null,
            lastName: toUpdate ? toUpdate?.lastName : null,
            company_id: toUpdate
              ? toUpdate?.company_id?.id
              : null,
            cinPictureFront: toUpdate
              ? toUpdate?.cinPictureFront
              : null,
            cinPictureBack: toUpdate
              ? toUpdate?.cinPictureBack
              : null,
            licencePicture: toUpdate
              ? toUpdate?.licencePicture
              : null,
          },
        ],
      });
    }
  }, [toUpdate]);

  const handleEdit = (res) => {
    const updatedAccountOverview = {
      ...updatedUser?.accountOverview[0],
    };
    // Update the firstName property with the new input value
    updatedAccountOverview.cinPictureFront = res?.data[0];
    // Update the newUser state with the modified accountOverview
    setUpdatedUser({
      ...updatedUser,
      accountOverview: [updatedAccountOverview],
    });
  };
  const handleEditBack = (res) => {
    const updatedAccountOverview = {
      ...updatedUser?.accountOverview[0],
    };
    // Update the firstName property with the new input value
    updatedAccountOverview.cinPictureBack = res?.data[0];
    // Update the newUser state with the modified accountOverview
    setUpdatedUser({
      ...updatedUser,
      accountOverview: [updatedAccountOverview],
    });
  };
  const handleEditLicence = (res) => {
    const updatedAccountOverview = {
      ...updatedUser?.accountOverview[0],
    };
    // Update the firstName property with the new input value
    updatedAccountOverview.licencePicture = res?.data[0];
    // Update the newUser state with the modified accountOverview
    setUpdatedUser({
      ...updatedUser,
      accountOverview: [updatedAccountOverview],
    });
  };

  const handleBlocked = (value) => {
    Modal.confirm({
      title: "Confirm Change",
      content: "Are you sure you want to change this item?",
      okText: "Changer",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setUpdatedUser({ ...updatedUser, blocked: value });
      },
      onCancel() {
      },
    });
  };

  const handleConfirme = (value) => {
    Modal.confirm({
      title: "Confirm Change",
      content: "Are you sure you want to change this item?",
      okText: "Changer",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setUpdatedUser({ ...updatedUser, confirmed: value });
      },
      onCancel() {},
    });
  };
  const [form] = Form.useForm();

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

  return (
    <Modal
      type={state.modalType}
      title="Changer informations de Chauffeur"
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="reservation-modal">
        {" "}
        <span>Données personel</span>
        <form className="update_driver_form">
          <div className="personal_info_driver">
            <Input
              tabIndex={1}
              value={
                updatedUser ? updatedUser?.firstName : null
              }
              type="text"
              placeholder="Nom"
              onChange={(e) => {
                setUpdatedUser((prevState) => ({
                  ...prevState,
                  accountOverview: [
                    {
                      ...prevState?.accountOverview[0],
                      firstName: e.target.value,
                    },
                  ],
                }));
              }}
            />
            {InputErrors.firstName && (
              <span style={{ color: "red" }}>{InputErrors.firstName}</span>
            )}
            <Input
              tabIndex={3}
              type="text"
              pattern={phoneNumberPattern}
              placeholder="numéro telephone"
              value={updatedUser ? updatedUser.phoneNumber : null}
              onChange={(e) => {
                setUpdatedUser({
                  ...updatedUser,

                  phoneNumber: e.target.value,
                });
              }}
            />
            {InputErrors.phoneNumber && (
              <span style={{ color: "red" }}>{InputErrors.phoneNumber}</span>
            )}
          </div>
          <div className="personal_info_driver">
            <Input
              tabIndex={2}
              type="text"
              value={
                updatedUser ? updatedUser?.lastName : null
              }
              placeholder="prénom"
              onChange={(e) => {
                setUpdatedUser({
                  ...updatedUser,
                  accountOverview: [
                    {
                      ...updatedUser?.accountOverview[0],
                      lastName: e.target.value,
                    },
                  ],
                });
              }}
            />
            {InputErrors.lastName && (
              <span style={{ color: "red" }}>{InputErrors.lastName}</span>
            )}
            <Input
              tabIndex={4}
              type="text"
              placeholder="email"
              value={updatedUser ? updatedUser.email : null}
              onChange={(e) => {
                setUpdatedUser({
                  ...updatedUser,

                  email: e.target.value,
                });
              }}
            />
            {InputErrors.email && (
              <span style={{ color: "red" }}>{InputErrors.email}</span>
            )}
          </div>
          <div className="personal_info_driver">
            <Input
              tabIndex={5}
              type="text"
              placeholder="Numero carte identité"
              value={updatedUser ? updatedUser?.cin : null}
              onChange={(e) => {
                setUpdatedUser({
                  ...updatedUser,
                  accountOverview: [
                    {
                      ...updatedUser?.accountOverview[0],
                      cin: e.target.value,
                    },
                  ],
                });
              }}
            />
            {InputErrors.cin && (
              <span style={{ color: "red" }}>{InputErrors.cin}</span>
            )}
          </div>
          <div className="personal_info_driver">
            <Input
              tabIndex={6}
              type="text"
              placeholder="Numero permis"
              value={
                updatedUser
                  ? updatedUser?.licenceNumber
                  : null
              }
              onChange={(e) => {
                setUpdatedUser({
                  ...updatedUser,
                  accountOverview: [
                    {
                      ...updatedUser?.accountOverview[0],
                      licenceNumber: e.target.value,
                    },
                  ],
                });
              }}
            />
            {InputErrors.licenceNumber && (
              <span style={{ color: "red" }}>{InputErrors.licenceNumber}</span>
            )}
          </div>

          <div className="personal_info_driver_action">
            <div>
              <h3>CIN Recto</h3>
              <UploadNew
                dataToShow={
                  updatedUser?.cinPictureFront
                    ? [
                        {
                          uid: "-1",
                          name: updatedUser?.cinPictureFront
                            ? updatedUser?.cinPictureFront
                                ?.name
                            : "",
                          status: "done",
                          url: updatedUser?.cinPictureFront
                            ? `${process.env.REACT_APP_BACKUP_URL}${updatedUser?.cinPictureFront?.url}`
                            : "",

                          // thumbUrl: updateUser?.logo?.name,
                        },
                      ]
                    : []
                }
                setFunction={handleEdit}
              />
            </div>
            <div>
              <h3>CIN verso</h3>
              <UploadNew
                dataToShow={
                  updatedUser?.cinPictureBack
                    ? [
                        {
                          uid: "-1",
                          name: updatedUser?.cinPictureBack
                            ? updatedUser?.cinPictureBack
                                ?.name
                            : "",
                          status: "done",
                          url: updatedUser?.cinPictureBack
                            ? `${process.env.REACT_APP_BACKUP_URL}${updatedUser?.cinPictureBack?.url}`
                            : "",

                          // thumbUrl: updateUser?.logo?.name,
                        },
                      ]
                    : []
                }
                setFunction={handleEditBack}
              />
            </div>
            <div>
              <h3>Permis</h3>
              <UploadNew
                dataToShow={
                  updatedUser?.licencePicture
                    ? [
                        {
                          uid: "-1",
                          name: updatedUser?.licencePicture
                            ? updatedUser?.licencePicture
                                ?.name
                            : "",
                          status: "done",
                          url: updatedUser?.licencePicture
                            ? `${process.env.REACT_APP_BACKUP_URL}${updatedUser?.licencePicture?.url}`
                            : "",

                          // thumbUrl: updateUser?.logo?.name,
                        },
                      ]
                    : []
                }
                setFunction={handleEditLicence}
              />
            </div>
          </div>
        </form>
      </div>
      <div key="1" className="project-modal-footer">
        <Button
          size="default"
          key="back"
          outlined
          className="btn_ADD"
          onClick={handleCancel}
        >
          Annuler
        </Button>
        <Button
          size="default"
          type="primary"
          className="btn_ADD"
          key="submit"
          onClick={() => {
            const inputErrors = isStep1Valid();
            if (Object.keys(inputErrors).length === 0) {
              dispatch(updateUser({ id: record, user: updatedUser })).then(() =>
                dispatch(getusers())
              );
              handleCancel();
            } else {
              setInputErrors(inputErrors);
            }
          }}
        >
          Enregistré
        </Button>
      </div>
    </Modal>
  );
}

ChangeDriverInfo.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ChangeDriverInfo;
