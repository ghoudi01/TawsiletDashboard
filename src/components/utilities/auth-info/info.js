import React, { useEffect } from "react";
import {
  Avatar,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { Button } from "../../buttons/buttons";
import "./profile.css";
import { InfoWraper, UserDropDwon } from "./auth-info-style";
import { Popover } from "../../popup/popup";
import Notification from "./notification";
import { logOut } from "../../../redux/authentication/actionCreator";
import Heading from "../../heading/heading";
import { useSelector } from "react-redux";
import {
  changePassword,
  getCurrentUser,
  logout,
  updateUser,
} from "../../../redux/User/userSlice";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextArea from "antd/lib/input/TextArea";
import { BasicFormWrapper } from "../../../container/styled";
import Updateagent from "../../../container/agent/Updateagent";
import styled from "styled-components";
import { ButtonYellow } from "../../../utility/style";
import moment from "moment";
import { Dropdown } from "../../dropdown/dropdown";

function AuthInfo() {
  const currentUser = useSelector((state) => state?.user?.currentUser);
  // console.log("currentUser",currentUser)
  const [showDétailes, setShowDétailes] = useState(true);
  const [showSetting, setShowSetting] = useState(false);
  const [showSettingPassword, setShowSettingPassword] = useState(false);

  const dispatch = useDispatch();
  const [updatesociete, setupdateSociete] = useState();
  useEffect(() => {
    setupdateSociete({
      email: currentUser?.email,
      phoneNumber: currentUser?.phoneNumber,
      accountOverview: [
        {
          __component: "section.company",
          name: currentUser ? currentUser?.name : null,
          cinOwner: currentUser ? currentUser?.cinOwner : null,
          nameOwner: currentUser ? currentUser?.nameOwner : null,
          address: currentUser ? currentUser?.address : null,
          region: currentUser ? currentUser?.region : null,
          city: currentUser ? currentUser?.city : null,
          postalCode: currentUser ? currentUser?.postalCode : null,
          assurance_rc_pro_date: currentUser
            ? currentUser?.assurance_rc_pro_date
            : null,
          licence_de_transport_date: currentUser
            ? currentUser?.licence_de_transport_date
            : null,
        },
      ],
    });
  }, [currentUser]);
  // to update phone
  const [updatePhone, setupdatePhone] = useState();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const myPromise = (data) => Promise.resolve(dispatch(changePassword(data)));

  useEffect(() => {
    setupdatePhone({
      email: currentUser?.email,
      phoneNumber: currentUser?.phoneNumber,
      user_role: "company",
      accountOverview: [
        {
          __component: "section.company",
          name: currentUser ? currentUser?.name : null,
          cinOwner: currentUser ? currentUser?.cinOwner : null,
          nameOwner: currentUser ? currentUser?.nameOwner : null,
          address: currentUser ? currentUser?.address : null,
          region: currentUser ? currentUser?.region : null,
          city: currentUser ? currentUser?.city : null,
          postalCode: currentUser ? currentUser?.postalCode : null,
          assurance_rc_pro_date: currentUser
            ? currentUser?.assurance_rc_pro_date
            : null,
          licence_de_transport_date: currentUser
            ? currentUser?.licence_de_transport_date
            : null,
        },
      ],
    });
  }, [currentUser]);
  const [updateagent, setupdateAgent] = useState({
    phoneNumber: "",
    user_role: "agent",
    // password: "",
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
    setupdateAgent({
      phoneNumber: currentUser?.phoneNumber,
      password: currentUser?.password,
      user_role: "agent",

      accountOverview: [
        {
          __component: "section.client",

          firstName: currentUser ? currentUser?.firstName : null,
          lastName: currentUser ? currentUser?.lastName : null,
          adress: currentUser ? currentUser?.adress : null,
        },
      ],
    });
  }, [currentUser]);
  const handlePhoneChange = (e) => {
    const newPhoneNumber = e.target.value;
    setupdatePhone({
      ...updatePhone,
      phoneNumber: newPhoneNumber,
    });
    // Regex for validating phone number (10 digits)
    const phoneRegextn = /^\+\d{11}$/; // + followed by 12 digits;
    // const phoneRegexfr = /^(?:(?:\+|00)33\s?|0)([1-9])(?:[\s.-]?(\d{2})){4}$/gm; // + followed by 12 digits;

    if (!phoneRegextn.test(newPhoneNumber)) {
      setInputErrors({
        ...InputErrors,
        phoneNumber:
          "Numéro de téléphone invalide. Veuillez saisir un format valide (+21624242424).",
      });
    } else {
      setInputErrors({
        ...InputErrors,
        phoneNumber: "", // Clear the error message if the input is valid
      });
    }
  };

  const handleDateChange = (newDate) => {
    setupdatePhone({
      ...updatePhone,
      accountOverview: [
        {
          ...updatePhone,
          licence_de_transport_date: newDate,
        },
      ],
    });
  };

  const handleDateAssuranceChange = (newDate) => {
    setupdatePhone({
      ...updatePhone,
      accountOverview: [
        {
          ...updatePhone,
          assurance_rc_pro_date: newDate,
        },
      ],
    });
  };
  const updatePhoneNumber = () => {
    const errors = isInputValid();
    if (errors === true) {
      dispatch(updateUser({ id: currentUser?.id, user: updatePhone }));
      message.success("Votre donnée a été modifiée avec succès.");
      setShowSetting(false);
      setInputErrors({});
    } else {
      setInputErrors(errors);
    }
  };

  // const [InputErrors, setInputErrors] = useState({});
  const [InputErrors, setInputErrors] = useState({});
  const isInputValid = () => {
    const errors = {};

    if (!updatesociete?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    }
    if (!updatePhone?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    }
    if (!updatesociete?.email) {
      errors.email = "Veuillez saisir votre email.";
    }
    if (!updatesociete.name) {
      errors.name = "Veuillez saisir nom de votre societe.";
    }
    // if (!updatesociete.cinOwner) {
    //   errors.cinOwner = "Veuillez saisir votre CIN.";
    // }
    if (!updatesociete.nameOwner) {
      errors.nameOwner = "Veuillez saisir votre nom.";
    }
    if (!updatesociete.address) {
      errors.address = "Veuillez saisir votre adresse.";
    }
    if (!updatesociete.region) {
      errors.region = "Veuillez saisir votre région.";
    }

    if (!updatesociete.city) {
      errors.city = "Veuillez saisir votre ville.";
    }
    if (!updatesociete.postalCode) {
      errors.postalCode = "Veuillez saisir votre code postal.";
    }

    if (currentUser.role === "company") {
      if (!updatePhone?.assurance_rc_pro_date) {
        errors.assurance_rc_pro_date =
          "S'il vous plaît entrez votre date d'expiration de l'assurance rc pro.";
      }
      if (!updatePhone?.licence_de_transport_date) {
        errors.licence_de_transport_date =
          "S'il vous plaît entrez votre date d'expiration de licenece de transport.";
      }
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const next = () => {
    console.log("update");
    const errors = isInputValid();
    console.log(errors);
    if (errors === true) {
      dispatch(updateUser({ id: currentUser?.id, user: updatesociete }));
      message.success("Votre donnée a été modifiée avec succès.");
      setShowSetting(false);
      setInputErrors({});
    } else {
      setInputErrors(errors);
    }
  };

  // const Updatephone = () => {
  //   const errors = isInputValid();
  //   if (errors === true) {
  //     dispatch(updateUser({ id: currentUser?.id, user: updatePhone }))

  //     setInputErrors({});
  //   } else {
  //     setInputErrors(errors);
  //   }
  // };
  const [InputerrorsAgent, setInputErrorsAgent] = useState({});
  const isInputValidAgent = () => {
    const errors = {};

    if (!updateagent?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    }

    if (!updateagent.firstName) {
      errors.firstName = "Veuillez saisir votre nom.";
    }
    if (!updateagent.lastName) {
      errors.lastName = "Veuillez saisir votre prénom.";
    }
    if (!updateagent.adress) {
      errors.adress = "Veuillez saisir votre adresse.";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const userContent = (
    <UserDropDwon>
      <div className="user-dropdwon">
        <div className="profile_user_image">
          {currentUser?.profile_picture ? (
            <img
              src={
                currentUser?.profile_picture
                  ? `${process.env.REACT_APP_BACKUP_URL}${currentUser?.profile_picture?.url}`
                  : "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png"
              }
            />
          ) : (
            <img
              src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png"
              alt=""
            />
          )}
        </div>
        <h2>{currentUser?.firstName ? currentUser?.firstName : currentUser?.user_role} {currentUser?.lastName ? currentUser?.lastName : ""}</h2>
        <div className="profile_actions">
          <Button
            size="small"
            className="btn_ADD"
            onClick={() => {
              setShowSettingPassword(!showSettingPassword);
              setShowSetting(false);
              // setInputErrors({});
            }}
          >
            <FeatherIcon icon="lock" size={14} />
          </Button>
          <Button
            size="small"
            className="btn_ADD"
            onClick={() => {
              setShowSetting(!showSetting);
              setShowSettingPassword(false);
              setInputErrors({});
            }}
          >
            <FeatherIcon icon="edit" size={14} />
            Modifier
          </Button>
          <Button
            className="btn_ADD"
            outlined
            size="small"
            onClick={() => {
              dispatch(logout());
            }}
          >
            <FeatherIcon icon="log-out" size={14} /> Déconnecté
          </Button>
        </div>{" "}
        {showSetting && (
          <>
            {currentUser?.user_role === "admin" ||
            currentUser?.user_role === "owner" ? (
              <div className="profile_settings">
                <div className="profile_setting_form">
                  <div className="profile_setting_form_elements">
                    <span>Nom de la Société</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              name: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.name
                          ? currentUser?.name
                          : "Pas de Nom de Société"
                      }
                      value={updatesociete?.name}
                    />
                    {InputErrors.name && (
                      <span style={{ color: "red" }}>{InputErrors.name}</span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>Adresse e-mail</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          email: e.target.value,
                        });
                      }}
                      placeholder={
                        currentUser?.email
                          ? currentUser?.email
                          : "Pas d'Adresse e-mail"
                      }
                      value={updatesociete?.email}
                    />
                    {InputErrors.email && (
                      <span style={{ color: "red" }}>{InputErrors.email}</span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>Nom de Gérant</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              nameOwner: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.nameOwner
                          ? currentUser?.nameOwner
                          : "Pas de nom de gérant"
                      }
                      value={updatesociete?.nameOwner}
                      // value={
                      //   currentUser?.nameOwner
                      // }
                    />{" "}
                    {InputErrors.nameOwner && (
                      <span style={{ color: "red" }}>
                        {InputErrors.nameOwner}
                      </span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>Numéro de téléphone</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          phoneNumber: e.target.value,
                        });
                      }}
                      placeholder={
                        currentUser?.phoneNumber
                          ? currentUser?.phoneNumber
                          : "Pas de Numéro de téléphone"
                      }
                      value={updatesociete?.phoneNumber}
                    />
                    {InputErrors.phoneNumber && (
                      <span style={{ color: "red" }}>
                        {InputErrors.phoneNumber}
                      </span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>CIN de Gérant</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              cinOwner: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.cinOwner
                          ? currentUser?.cinOwner
                          : "Pas de numéro d'idéntité"
                      }
                      value={updatesociete?.cinOwner}

                      // value={
                      //   currentUser?.cinOwner
                      // }
                    />{" "}
                    {InputErrors.cinOwner && (
                      <span style={{ color: "red" }}>
                        {InputErrors.cinOwner}
                      </span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>Adresse</span>
                    <Input
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              address: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.address
                          ? currentUser?.address
                          : "Pas de Address"
                      }
                      value={updatesociete?.address}

                      // value={
                      //   currentUser?.address
                      // }
                    />{" "}
                    {InputErrors.address && (
                      <span style={{ color: "red" }}>
                        {InputErrors.address}
                      </span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>Code Postal</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              postalCode: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.postalCode
                          ? currentUser?.postalCode
                          : "Pas de  Code Postal"
                      }
                      value={updatesociete?.postalCode}
                      // value={
                      //   currentUser?.postalCode
                      // }
                    />{" "}
                    {InputErrors.postalCode && (
                      <span style={{ color: "red" }}>
                        {InputErrors.postalCode}
                      </span>
                    )}
                  </div>
                  <div className="profile_setting_form_elements">
                    <span>Ville</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              city: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.city ? currentUser?.city : "Pas de ville"
                      }
                      value={updatesociete?.city}

                      // value={
                      //   currentUser?.city
                      // }
                    />{" "}
                    {InputErrors.city && (
                      <span style={{ color: "red" }}>{InputErrors.city}</span>
                    )}
                  </div>

                  <div className="profile_setting_form_elements">
                    <span>Région</span>

                    <Input
                      className="form_input_setting"
                      type="text"
                      value={updatesociete?.region}
                      onChange={(e) => {
                        setupdateSociete({
                          ...updatesociete,
                          accountOverview: [
                            {
                              ...updatesociete,
                              region: e.target.value,
                            },
                          ],
                        });
                      }}
                      placeholder={
                        currentUser?.region
                          ? currentUser?.region
                          : "Pas de Region"
                      }

                      // value={

                      //   currentUser?.region

                      // }
                    />

                    {InputErrors.region && (
                      <span style={{ color: "red" }}>{InputErrors.region}</span>
                    )}
                  </div>

                  <div className="profile_setting_form_elements">
                    <span>Site Web</span>
                    <Input
                      className="form_input_setting"
                      type="text"
                      placeholder="https://tawsilet.com/"
                    />
                  </div>
                  <div className="profile_setting_form_action">
                    <Button
                      type="submit"
                      onClick={() => next()}
                      className="profile_submit"
                    >
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              </div>
            ) : currentUser?.user_role === "agent" ? (
              <div className="profile_settings">
                <>
                  <BasicFormWrapper className="mb-25 ">
                    <p className="ModalagentAdd">Information de l'agent</p>
                    <Form name="multi-form" layout="horizontal">
                      <Row gutter={30}>
                        <Col sm={12} xs={24} className="mb-25">
                          <Form.Item
                            name="sDash_f-name"
                            label="Nom d'agent"
                            validateStatus={
                              InputerrorsAgent.firstName ? "error" : ""
                            }
                            help={InputerrorsAgent.firstName}
                          >
                            <Input
                              placeholder={
                                updateagent ? updateagent?.firstName : null
                              }
                              value={
                                updateagent ? updateagent?.firstName : null
                              }
                              onChange={(e) => {
                                setupdateAgent({
                                  ...updateagent,
                                  accountOverview: [
                                    {
                                      ...updateagent,
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
                            validateStatus={
                              InputerrorsAgent.lastName ? "error" : ""
                            }
                            help={InputerrorsAgent.lastName}
                          >
                            <Input
                              placeholder={
                                updateagent ? updateagent?.lastName : null
                              }
                              value={updateagent ? updateagent?.lastName : null}
                              onChange={(e) => {
                                setupdateAgent({
                                  ...updateagent,
                                  accountOverview: [
                                    {
                                      ...updateagent,
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
                            validateStatus={
                              InputerrorsAgent.phoneNumber ? "error" : ""
                            }
                            help={InputerrorsAgent.phoneNumber}
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
                            validateStatus={
                              InputerrorsAgent.adress ? "error" : ""
                            }
                            help={InputerrorsAgent.adress}
                          >
                            <Input
                              placeholder={
                                updateagent ? updateagent?.adress : null
                              }
                              value={updateagent ? updateagent?.adress : null}
                              onChange={(e) => {
                                setupdateAgent({
                                  ...updateagent,
                                  accountOverview: [
                                    {
                                      ...updateagent,
                                      adress: e.target.value,
                                    },
                                  ],
                                });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col sm={12} xs={24} className="mb-25">
                          <Form.Item
                            name="sDash_country"
                            label="Adresse e-mail"
                          >
                            <Input
                              placeholder={currentUser?.email}
                              disabled
                              value={currentUser?.email}
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
                        {/* <Col sm={12} xs={24} className="mb-25">
                          <Form.Item name="password" label="Mot de passe">
                            <Input.Password
                              style={{ color: "red" }}
                              placeholder={
                                updateagent?.password || "***************"
                              }
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
                        </Col> */}
                      </Row>
                    </Form>
                  </BasicFormWrapper>
                  <div style={{ marginTop: 24, display: "flex", gap: "20px" }}>
                    <div className="Horizontal_btn">
                      <Button
                        className="btn_Suivant"
                        type="primary"
                        onClick={() => {
                          dispatch(
                            updateUser({
                              id: currentUser?.id,
                              user: updateagent,
                            })
                          );
                        }}
                      >
                        Modifier
                      </Button>
                    </div>
                  </div>
                </>
              </div>
            ) : currentUser?.user_role === "company" ? (
              <div className="profile_settings">
                <form className="profile_setting_form">
                  <div className="profile_setting_form_elements_company">
                    <span>Numéro de téléphone</span>
                    {/* <Input
        className="form_input_setting"
        type="text"
        onChange={(e) => {
          setupdatePhone({
            ...updatePhone,
            phoneNumber: e.target.value,
          });
        }}
        placeholder={
          currentUser?.phoneNumber
            ? currentUser?.phoneNumber
            : "Pas de Numéro de téléphone"
        }
     
      /> */}

                    <Input
                      className="form_input_setting"
                      type="text"
                      value={updatePhone.phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder={
                        currentUser?.phoneNumber
                          ? currentUser?.phoneNumber
                          : "Pas de Numéro de téléphone"
                      }
                    />
                    {/* Display validation error if necessary */}
                    {InputErrors.phoneNumber && (
                      <span style={{ color: "red" }}>
                        {InputErrors.phoneNumber}
                      </span>
                    )}
                  </div>

                  <div
                    className="profile_setting_form_elements_company"
                    style={{ paddingTop: "1rem" }}
                  >
                    <span>Date d'éxpiration assurance Rc Pro</span>
                    <DatePicker
                      value={moment(
                        updatePhone?.assurance_rc_pro_date ||
                          currentUser?.assurance_rc_pro_date
                      )}
                      selected={
                        updatePhone?.assurance_rc_pro_date ||
                        currentUser?.assurance_rc_pro_date
                      }
                      onChange={handleDateAssuranceChange}
                    />
                    {/* Display validation error if necessary */}
                    {InputErrors.assurance_rc_pro_date && (
                      <span style={{ color: "red" }}>
                        {InputErrors.assurance_rc_pro_date}
                      </span>
                    )}
                  </div>

                  <div
                    className="profile_setting_form_elements_company"
                    style={{ paddingTop: "1rem" }}
                  >
                    <span>Date d'éxpiration licence de transport</span>
                    <DatePicker
                      value={moment(
                        updatePhone?.licence_de_transport_date ||
                          currentUser?.licence_de_transport_date
                      )}
                      selected={updatePhone?.licence_de_transport_date || null}
                      onChange={handleDateChange}
                    />
                    {/* Display validation error if necessary */}
                    {InputErrors.licence_de_transport_date && (
                      <span style={{ color: "red" }}>
                        {InputErrors.licence_de_transport_date}
                      </span>
                    )}
                  </div>
                </form>
                <div className="profile_setting_form_action">
                  <Button
                    onClick={updatePhoneNumber}
                    className="profile_submit"
                  >
                    Sauvegarder
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
        {showSettingPassword && (
          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit((data) => {
              // setLoading(true);
              console.log(data);
              myPromise({
                currentPassword: data.currentPassword,
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
              })
                .then((user) => {
                  reset();
                  // setLoading(false);
                  // window.location.replace("/clientProfile/details");
                })
                .catch((error) => {
                  // console.log(error);
                  // setLoading(false),
                  alert(error?.response?.data?.error?.message);
                });
            })}
          >
            <h2>Modifier le mot de passe</h2>
            <Col xs={24} className="mb-25">
              <ContentService>
                <InputPassword
                  name="currentPassword"
                  type="password"
                  className="oinput"
                  placeholder="Ancien mot de passe" //{t("ClientProfile.taperpswd")}
                  {...register("currentPassword", {
                    required:
                      "S'il vous plaît entrez votre Ancien mot de passe.",
                  })}
                />
                {errors?.currentPassword && (
                  <ErrorMessage>
                    {errors?.currentPassword?.message}
                  </ErrorMessage>
                )}
              </ContentService>
              <ContentService>
                <InputPassword
                  name="password"
                  type="password"
                  className="oinput"
                  placeholder="Nouveau mot de passe" //{t("ClientProfile.taperpswd")}
                  {...register("password", {
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\-|]{8,}$/,
                      message:
                        "Mot de passe invalide. Longueur : min. 8 caractères, lettre et chiffre requis.",
                    },
                    required: "S'il vous plait entrez votre mot de passe.",
                  })}
                />
                {errors?.password && (
                  <ErrorMessage>{errors?.password?.message}</ErrorMessage>
                )}
              </ContentService>
              <ContentService>
                <InputPassword
                  name="passwordConfirmation"
                  type="password"
                  className="oinput"
                  placeholder="Confirmer le mot de passe" //{t("ClientProfile.taperpswd")}
                  {...register("passwordConfirmation", {
                    validate: (value) => {
                      const { password } = getValues();
                      return (
                        password === value ||
                        "Les mots de passe doivent correspondre !"
                      );
                    },
                  })}
                />
              </ContentService>

              {errors?.passwordConfirmation && (
                <ErrorMessage>
                  {errors?.passwordConfirmation?.message}
                </ErrorMessage>
              )}
              <ButtonYellow type="submit" onSubmit={(e) => e.preventDefault()}>
                {" "}
                Mettre à jour
              </ButtonYellow>
            </Col>
          </form>
        )}
      </div>
    </UserDropDwon>
  );

  return (<>
    <InfoWraper>
      {/* {currentUser && <Dropdown
        placement="bottomCenter"
        action={["click"]}
        className="wide-dropdwon"
        style={{padding:"10px", height:"10px"}}
        content={
          <>
            <Link to="#">Company 1</Link>
            <Link to="#">Company 2</Link>
            <Link to="#">Company 3</Link>
          </>
        }
      >
        <Link style={{height:30}} to="#">CompanyName v</Link>
      </Dropdown>} */}
      <Notification />
      {currentUser ? (
        <div className="nav-author">
          
          <Popover placement="bottomRight" content={userContent} action="click">
            <Link to="#" className="head-example">
              <Avatar
                src={
                  currentUser?.profile_picture
                    ? `${process.env.REACT_APP_BACKUP_URL}${currentUser?.profile_picture?.url}`
                    : "https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png"
                }
              />
            </Link>
          </Popover>
        </div>
      ) : (
        <Avatar src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png" />
      )}

    </InfoWraper>
      {/* <h4>{currentUser.user_role.toUpperCase()}</h4> */}
  </>);
}

export default AuthInfo;

const ErrorMessage = styled.span`
  color: #ff6961;
  padding: 6px 10px;
  max-width: 100%;
  font-size: 10px;
  overflow: hidden;
  align-self: flex-start;
`;

const InputPassword = styled.input`
  width: 100%;
  height: 2rem;
  border-radius: 6px;
  border: transparent;
  padding-right: 2.5rem;
  padding: 1.5rem;
  /* color: var(--body-text-2, #666); */
  border: 1px solid gray;

  font-size: 0.875rem;

  font-weight: 400;
  line-height: 1.5rem;
  @media (max-width: 1151px) {
    width: 100%;
  }
`;

const ContentService = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
