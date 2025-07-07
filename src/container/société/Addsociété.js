import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Steps,
  DatePicker,
  message,
  Radio,
  Upload,
  Spin,
  Modal,
  DatePickerProps,
} from "antd";
import moment from "moment";

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
  getCompanies,
} from "../../redux/User/userSlice";
import { AddProductForm } from "../livreur/style";
import axios from "axios";
const { Option } = Select;
const dateFormat = "YYYY/MM/DD";
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

const Addsociété = ({ visible, onCancel, record }) => {
  const meta = useSelector((state) => state?.user?.companies?.pagination);

  const dispatch = useDispatch();

  const currentDate = moment();
  const minDate = moment(currentDate).add(1, "months");

  const currentId = useSelector((state) => state?.user?.currentUser?.id);
 
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  ///////////////////////////////upload /////////////////////////////////////

  const fileList = [];
  const fileListkabis = [];

  const fileListrc = [];

  const fileListcinRecto = [];
  const fileListcinVerso = [];
  const fileListLicenceTransport = [];
  const fileListurssaf = [];
  const fileListfiscale = [];
  // profile_picture

  const fileListRib = [];

  const [image, setimage] = useState();

  const handleFileSelect = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB
 
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.logo = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });
  };

  const fileUploadProps = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileList,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  const handleFileSelecturrsaf = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

 
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)

      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.urssaf = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });
    // Do something with the selected file
  };

  const fileUploadPropsurssaf = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelecturrsaf(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListurssaf,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  const handleFileSelectfiscale = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

     const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)

      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.attestation_fiscale = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });
    // Do something with the selected file
  };

  const fileUploadPropsfiscale = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelectfiscale(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListfiscale,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  ///////////////////////////////upload 2 /////////////////////////////////////

  const handleFileSelect2 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

   
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)

      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.kabis_picture = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });
    // Do something with the selected file
  };

  const fileUploadProps2 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect2(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListkabis,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  ///////////////////////////////upload 3 /////////////////////////////////////

  const handleFileSelect3 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

     const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.assurance_rc_pro_picture = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });

    // Do something with the selected file
  };

  const fileUploadProps3 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect3(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListrc,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  ///////////////////////////////upload 4 /////////////////////////////////////

  const handleFileSelect4 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

     const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)

      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.cin_recto_picture = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });
    // Do something with the selected file
  };

  const fileUploadProps4 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect4(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListcinRecto,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  ///////////////////////////////upload 5 /////////////////////////////////////

  const handleFileSelect5 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

  
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.cin_verso_picture = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });

    // Do something with the selected file
  };

  const fileUploadProps5 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect5(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListcinVerso,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  ///////////////////////////////upload 6 /////////////////////////////////////

  const handleFileSelect6 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

     
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.rib_picture = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });

    // Do something with the selected file
  };

  const fileUploadProps6 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect6(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListRib,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  ///////////////////////////////upload 7 /////////////////////////////////////
  const handleFileSelect7 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

 
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        const updatedcompany = {
          ...AddSociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.licence_de_transport_picture = res?.data[0];
        // Update the newUser state with the modified 
        setAddSociete({
          ...AddSociete,
          updatedcompany,
        });
      });

    // Do something with the selected file
  };

  const fileUploadProps7 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect7(file);
      return false;
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        setimage({ ...image, file: info.file, list: info.fileList });
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileListLicenceTransport,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  const [AddSociete, setAddSociete] = useState({
    username: "",
    user_role: "company",
    phoneNumber: "",
    email: "",
    password: "",
    validation: {
      validation_state: "waiting",
    },
    
      
        __component: "section.company",
        name: "",
        // activity: "",
        // category: "",
        // cinOwner: "",
        nameOwner: "",
        address: "",
        region: "",
        city: "",
        postalCode: "",
        // kabis: "",
        // assurance_rc_pro: "",
        // numSiret: "",
        kabis_picture: null,
        assurance_rc_pro_picture: null,
        cin_recto_picture: null,
        cin_verso_picture: null,
        licence_de_transport_picture: null,
        urssaf: null,
        rib_picture: null,
        assurance_rc_pro_date: null,
        licence_de_transport_date: null,
        attestation_fiscale: null,
      
  });

  // validation
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Inputerrors, setInputErrors] = useState({});
  const isInputValid = () => {
    const errors = {};
    const phoneNumberRegex = /^[\d\s\-()+]+$/;

    if (!AddSociete?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    } else if (!phoneNumberRegex.test(AddSociete.phoneNumber)) {
      errors.phoneNumber = "Veuillez saisir un numéro de téléphone valide.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!AddSociete?.email) {
      errors.email = "Veuillez saisir votre e-mail.";
    } else if (!emailRegex.test(AddSociete.email)) {
      errors.email = "Veuillez saisir une adresse e-mail valide.";
    }

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\-|]{8,}$/;

    if (!AddSociete?.password) {
      errors.password = "Veuillez saisir votre mot de passe.";
    } else if (!passwordRegex.test(AddSociete.password)) {
      errors.password =
        "Le mot de passe doit contenir au moins un chiffre, une lettre et être d'au moins 8 caractères de long.";
    }

    if (!AddSociete?.name) {
      errors.name = "Veuillez saisir nom de votre societe.";
    }
    // if (!AddSociete?.activity) {
    //     errors.activity = "Veuillez saisir votre activité.";
    // }
    // if (!AddSociete?.category) {
    //     errors.category = "Veuillez saisir votre categorie.";
    // }
    // if (!AddSociete?.cinOwner) {
    //     errors.cinOwner = "Veuillez saisir votre CIN.";
    // }
    if (!AddSociete?.nameOwner) {
      errors.nameOwner = "Veuillez saisir votre nom.";
    }
    if (!AddSociete?.address) {
      errors.address = "Veuillez saisir votre adresse.";
    }
    if (!AddSociete?.region) {
      errors.region = "Veuillez saisir votre région.";
    }
    // if (!AddSociete?.activity) {
    //     errors.activity = "Veuillez saisir votre région.";
    // }
    if (!AddSociete?.city) {
      errors.city = "Veuillez saisir votre ville.";
    }
    if (!AddSociete?.postalCode) {
      errors.postalCode = "Veuillez saisir votre code postal.";
    }
    // if (!AddSociete?.kabis) {
    //     errors.kabis = "Veuillez saisir votre kabis.";
    // }
    if (!AddSociete?.assurance_rc_pro_date) {
      errors.assurance_rc_pro_date =
        "S'il vous plaît entrez votre date d'expiration de l'assurance rc pro.";
    }
    if (!AddSociete?.licence_de_transport_date) {
      errors.licence_de_transport_date =
        "S'il vous plaît entrez votre date d'expiration de licenece de transport.";
    }
    // if (!AddSociete?.numSiret) {
    //     errors.numSiret = "Veuillez saisir votre numéro de siret.";
    // }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const [PicturesErrors, setPicturesErrors] = useState({});

  const PicturesValidation = () => {
    const {
      kabis_picture,
      attestation_fiscale,
      assurance_rc_pro_picture,
      cin_recto_picture,
      cin_verso_picture,
      licence_de_transport_picture,
      urssaf,
      rib_picture,
    } = AddSociete;

    const errors = {};

    if (!attestation_fiscale) {
      errors.attestation_fiscale = "Veuillez choisier une Image.";
    }
    if (!kabis_picture) {
      errors.kabis_picture = "Veuillez choisier une Image.";
    }
    if (!assurance_rc_pro_picture) {
      errors.assurance_rc_pro_picture = "Veuillez choisier une Image.";
    }
    if (!cin_verso_picture) {
      errors.cin_verso_picture = "Veuillez choisier une Image.";
    }
    if (!cin_recto_picture) {
      errors.cin_recto_picture = "Veuillez choisier une Image.";
    }
    if (!licence_de_transport_picture) {
      errors.licence_de_transport_picture = "Veuillez choisier une Image.";
    }

    if (!urssaf) {
      errors.urssaf = "Veuillez choisier une Image.";
    }
    if (!rib_picture) {
      errors.rib_picture = "Veuillez choisier une Image.";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    const errors = isInputValid();
    if (errors === true) {
      setCurrent(current + 1);
      setInputErrors({});
    } else {
      setInputErrors(errors);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
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
  const steps = [
    {
      title: "Détails de l'itinéraire ",
      content: (
        <>
          <BasicFormWrapper className="">
            <p className="ModalagentAdd">Information de société</p>
            <Form name="multi-form" layout="horizontal" className="formUpdate">
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_name"
                  label="Nom de l'entreprise"
                  validateStatus={Inputerrors.name ? "error" : ""}
                  help={Inputerrors.name}
                >
                  <Input
                    placeholder="Nom de l'entreprise"
                    value={AddSociete.name}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                       
                            name: e.target.value,
                        
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  // rules={[{ required: true }, { type: 'text', warningOnly: true }, { type: 'string'  }]}
                  name="Nom de Gérant"
                  label="Nom complet de Gérant"
                  validateStatus={Inputerrors.nameOwner ? "error" : ""}
                  help={Inputerrors.nameOwner}
                >
                  <Input
                    placeholder="Nom de Gérant"
                    value={AddSociete?.nameOwner}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                        
                            nameOwner: e.target.value,
                         
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_city"
                  label="Numéro de téléphone"
                  validateStatus={Inputerrors.phoneNumber ? "error" : ""}
                  help={Inputerrors.phoneNumber}
                >
                  <Input
                    type="number"
                    placeholder="Numéro de téléphone"
                    value={AddSociete?.phoneNumber}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                        phoneNumber: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>

              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-email"
                  label="Adresse e-mail"
                  validateStatus={Inputerrors.email ? "error" : ""}
                  help={Inputerrors.email}
                >
                  <Input
                    placeholder="Adresse e-mail"
                    value={AddSociete?.email}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                        email: e.target.value,
                        username: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              {/* <div className="mb-25">
                                {" "}
                                <Form.Item
                                    name="sDash_cin"
                                    label="CIN de gérant "
                                    validateStatus={Inputerrors.cinOwner ? "error" : ""}
                                    help={Inputerrors.cinOwner}
                                >
                                    <Input
                                        placeholder="CIN de gérant"
                                        value={
                                            AddSociete?..cinOwner

                                        }
                                        onChange={(e) => {
                                            setAddSociete({
                                                ...AddSociete,
                                                : [
                                                    {
                                                        ...AddSociete,
                                                        cinOwner: e.target.value,
                                                    },
                                                ],
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </div> */}
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="password"
                  label="Mot de passe"
                  validateStatus={Inputerrors.password ? "error" : ""}
                  help={Inputerrors.password}
                >
                  <Input.Password
                    placeholder="Mot de passe.."
                    value={AddSociete?.password}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                        password: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              {/* <div className="mb-25">
                                {" "}
                                <Form.Item
                                    name="sDash_f-n_siret"
                                    label="Numéro de SIRET"
                                    validateStatus={Inputerrors.numSiret ? "error" : ""}
                                    help={Inputerrors.numSiret}
                                >
                                    <Input
                                        placeholder="Numéro de SIRET"
                                        value={
                                            AddSociete?.numSiret

                                        }
                                        onChange={(e) => {
                                            setAddSociete({
                                                ...AddSociete,
                                                : [
                                                    {
                                                        ...AddSociete,
                                                        numSiret: e.target.value,
                                                    },
                                                ],
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            <div className="mb-25">
                                {" "}
                                <Form.Item
                                    name="sDash_f-kabis"
                                    label="Kabis"
                                    validateStatus={Inputerrors.kabis ? "error" : ""}
                                    help={Inputerrors.kabis}
                                >
                                    <Input
                                        placeholder="Kbis"
                                        value={
                                            AddSociete?.kabis

                                        }
                                        onChange={(e) => {
                                            setAddSociete({
                                                ...AddSociete,
                                                : [
                                                    {
                                                        ...AddSociete,
                                                        kabis: e.target.value,
                                                    },
                                                ],
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            <div className="mb-25">
                                {" "}
                                <Form.Item
                                    name="sDash_f-activity"
                                    label="Activité"
                                    validateStatus={Inputerrors.activity ? "error" : ""}
                                    help={Inputerrors.activity}
                                >
                                    <Input
                                        placeholder="Activité"
                                        value={
                                            AddSociete?.activity

                                        }
                                        onChange={(e) => {
                                            setAddSociete({
                                                ...AddSociete,
                                                : [
                                                    {
                                                        ...AddSociete,
                                                        activity: e.target.value,
                                                    },
                                                ],
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </div>
                            <div className="mb-25">
                                {" "}
                                <Form.Item
                                    name="sDash_f-categorie"
                                    label="Categorie"
                                    validateStatus={Inputerrors.category ? "error" : ""}
                                    help={Inputerrors.category}
                                >
                                    <Input
                                        placeholder="Categorie"
                                        value={
                                            AddSociete?.category

                                        }
                                        onChange={(e) => {
                                            setAddSociete({
                                                ...AddSociete,
                                                : [
                                                    {
                                                        ...AddSociete,
                                                        category: e.target.value,
                                                    },
                                                ],
                                            });
                                        }}
                                    />
                                </Form.Item>
                            </div> */}
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-adresse"
                  label="Adresse"
                  validateStatus={Inputerrors.address ? "error" : ""}
                  help={Inputerrors.address}
                >
                  <Input
                    placeholder="Adresse"
                    value={AddSociete?.address}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                       
                            address: e.target.value,
                        
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-codepostal"
                  label="Code Postal"
                  validateStatus={Inputerrors.postalCode ? "error" : ""}
                  help={Inputerrors.postalCode}
                >
                  <Input
                    placeholder="Code Postal"
                    value={AddSociete?.postalCode}
                    onChange={(e) => {
                      setAddSociete({
                   
                            postalCode: e.target.value,
                       
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-ville"
                  label="ville"
                  validateStatus={Inputerrors.city ? "error" : ""}
                  help={Inputerrors.city}
                >
                  <Input
                    placeholder="ville"
                    value={AddSociete?.city}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                       
                            city: e.target.value,
                         
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="sDash_f-region"
                  label="Région"
                  validateStatus={Inputerrors.region ? "error" : ""}
                  help={Inputerrors.region}
                >
                  <Input
                    placeholder="Région"
                    value={AddSociete?.region}
                    onChange={(e) => {
                      setAddSociete({
                        ...AddSociete,
                            region: e.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-n_assurance"
                  label="Date d'xpiration assurance Rc Pro"
                  validateStatus={
                    Inputerrors.assurance_rc_pro_date ? "error" : ""
                  }
                  help={Inputerrors.assurance_rc_pro_date}
                >
                  <DatePicker
                    disabledDate={(current) => current && current < minDate}
                    defaultValue={minDate}
                    placeholderText={"deùmai"}
                    value={
                      AddSociete?.assurance_rc_pro_date ||
                      null
                    }
                    onChange={(newDate) => {
                      setAddSociete({
                        ...AddSociete,
                
                          
                            assurance_rc_pro_date: newDate,
                          
                      });
                    }}
                  />
                </Form.Item>
              </div>

              <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-licenec"
                  label="Date d'xpiration licence de transport"
                  validateStatus={
                    Inputerrors.licence_de_transport_date ? "error" : ""
                  }
                  help={Inputerrors.licence_de_transport_date}
                >
                  <DatePicker
                    disabledDate={(current) => current && current < minDate}
                    defaultValue={minDate}
                    value={
                      AddSociete
                        ?.licence_de_transport_date ||
                      "Date d'xpiration licence de transport"
                    }
                    onChange={(newDate) => {
                      setAddSociete({
                        ...AddSociete,
                        
                            licence_de_transport_date: newDate,
                          
                      });
                    }}
                  />
                </Form.Item>
              </div>
            </Form>
          </BasicFormWrapper>
        </>
      ),
    },

    {
      title: "Ajouter une pièce jointe",
      content: (
        <form className="create_reservation_form">
          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="URSSAF de la société">
                      <Dragger {...fileUploadPropsurssaf}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.urssaf && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.urssaf}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>
          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="attestation fiscale de la société">
                      <Dragger {...fileUploadPropsfiscale}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.attestation_fiscale && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.attestation_fiscale}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>
          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="Photo de Kbis">
                      <Dragger {...fileUploadProps2}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="plus-circle" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.kabis_picture && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.kabis_picture}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>

          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="Photo de l'assurance">
                      <Dragger {...fileUploadProps3}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="plus-circle" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.assurance_rc_pro_picture && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.assurance_rc_pro_picture}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>

          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="Photo Cin recto">
                      <Dragger {...fileUploadProps4}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.cin_recto_picture && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.cin_recto_picture}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>
          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="Photo Cin verso">
                      <Dragger {...fileUploadProps5}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.cin_verso_picture && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.cin_verso_picture}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>
          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="Photo RIB">
                      <Dragger {...fileUploadProps6}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.rib_picture && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.rib_picture}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>

          <AddProductForm>
            <div className="add-product-block">
              <Row gutter={15}>
                <Col xs={24}>
                  <div className="add-product-content">
                    <Cards title="Photo Licence de Transport">
                      <Dragger {...fileUploadProps7}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
                      {PicturesErrors.licence_de_transport_picture && (
                        <p className="error__message" style={{ color: "red" }}>
                          {PicturesErrors.licence_de_transport_picture}
                        </p>
                      )}
                    </Cards>
                  </div>
                </Col>
              </Row>
            </div>
          </AddProductForm>
        </form>
      ),
    },

    // {
    //     title: "Détails de l'itinéraire ",
    //     content: <></>
    // }
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    lineHeight: "50px",
    textAlign: "center",
    marginTop: 16,
  };

  return (
    <>
      <Modal
        type={state.modalType}
        title={"Ajouter une Société"}
        visible={state.visible}
        className="ModalagentAdd "
        footer={null}
        onCancel={handleCancel}
      >
        {/* <StepsUpdate visible={visible} onCancel={onCancel} record={record}/> */}
        <>
          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24, display: "flex", gap: "20px" }}>
            {current < steps.length - 1 && (
              <div className="Horizontal_btn">
                <Button
                  className="btn_Suivant"
                  size="default"
                  type="primary"
                  key="submit"
                  onClick={() => next()}
                >
                  Suivant
                </Button>
              </div>
            )}
            <div className="Horizontal_btn">
              {current > 0 && (
                <Button
                  style={{ margin: "0 8px" }}
                  onClick={() => prev()}
                  className="btn_Suivant"
                >
                  Retour
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button
                  className="btn_Suivant"
                  type="primary"
                  onClick={() => {
                    const validationResult = PicturesValidation();
                    if (validationResult === true) {
                      dispatch(registerUser(AddSociete)).then(() => {
                        dispatch(
                          getCompanies({
                            pagination: {
                              current: meta.page,
                              pageSize: meta.pageSize,
                            },
                          })
                        );
                        message.success("Ajouter avec sucsesss!");
                      });
                      handleCancel();
                    } else {
                      setPicturesErrors(validationResult);
                    }
                  }}
                >
                  Sauvgarder
                </Button>
              )}
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};
Addsociété.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};
export default Addsociété;
