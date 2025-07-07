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
  getCompanies,
} from "../../redux/User/userSlice";
import { AddProductForm } from "../livreur/style";
import axios from "axios";
const { Option } = Select;
const dateFormat = "YYYY/MM/DD";

const UpdateSociete = ({ visible, onCancel, record, text, status }) => {
  // {
  //   pagination: {
  //     current: meta.page,
  //     pageSize: meta.pageSize,
  //   },
  //   text: textFilter,
  //   status: filterStatus,
  // }

  const dispatch = useDispatch();
  const meta = useSelector((state) => state?.user?.companies?.pagination);
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [image, setimage] = useState();
  ///////////////////////////////upload /////////////////////////////////////

  const fileList = [
    {
      uid: "-1",
      name: record?.urssaf
        ? record?.urssaf?.name
        : "",
      status: "done",
      url: record?.urssaf
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.urssaf?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListkabis = [
    {
      uid: "-1",
      name: record?.kabis_picture
        ? record?.kabis_picture[0]?.name
        : "",
      status: "done",
      url: record?.kabis_picture
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.kabis_picture[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];

  const fileListrc = [
    {
      uid: "-1",
      name: record?.assurance_rc_pro_picture
        ? record?.assurance_rc_pro_picture[0]?.name
        : "",
      status: "done",
      url: record?.assurance_rc_pro_picture
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.assurance_rc_pro_picture[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];

  const fileListcinRecto = [
    {
      uid: "-1",
      name: record?.cin_recto_picture
        ? record?.cin_recto_picture[0]?.name
        : "",
      status: "done",
      url: record?.cin_recto_picture
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.cin_recto_picture[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];

  const fileListcinVerso = [
    {
      uid: "-1",
      name: record?.cin_verso_picture
        ? record?.cin_verso_picture[0]?.name
        : "",
      status: "done",
      url: record?.cin_verso_picture
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.cin_verso_picture[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListLicenceTransport = [
    {
      uid: "-1",
      name: record?.licence_de_transport_picture
        ? record?.licence_de_transport_picture[0]?.name
        : "",
      status: "done",
      url: record?.licence_de_transport_picture
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.licence_de_transport_picture[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListRib = [
    {
      uid: "-1",
      name: record?.rib_picture
        ? record?.rib_picture[0]?.name
        : "",
      status: "done",
      url: record?.rib_picture
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.rib_picture[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListFiscale = [
    {
      uid: "-1",
      name: record?.attestation_fiscale
        ? record?.attestation_fiscale[0]?.name
        : "",
      status: "done",
      url: record?.attestation_fiscale
        ? `${process.env.REACT_APP_BACKUP_URL}${record?.attestation_fiscale[0]?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.urssaf = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
        });
      });

    // Do something with the selected file
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
    defaultFileList: record?.urssaf ? fileList : [],
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  const handleFileSelectFiscale = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

  
    const formData = new FormData();

    formData.append("files", file);

    const response = await axios
      .post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData)
      .then((res) => {
        const updatedcompany = {
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.attestation_fiscale = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
        });
      });

    // Do something with the selected file
  };

  const fileUploadFiscale = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelectFiscale(file);
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
    defaultFileList: record?.attestation_fiscale
      ? fileList
      : [],
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.kabis_picture = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
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
    defaultFileList: record?.kabis_picture ? fileList : [],
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.assurance_rc_pro_picture = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
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
    defaultFileList: record?.assurance_rc_pro_picture
      ? fileList
      : [],
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.cin_recto_picture = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
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
    defaultFileList: record?.cin_recto_picture
      ? fileList
      : [],
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.cin_verso_picture = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
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
    defaultFileList: record?.cin_verso_picture
      ? fileList
      : [],
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.rib_picture = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
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
    defaultFileList: record?.rib_picture ? fileList : [],
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
          ...updatesociete,
        };
        // Update the firstName property with the new input value
        updatedcompany.licence_de_transport_picture = res?.data[0];
        // Update the newUser state with the modified accountOverview
        setupdateSociete({
          ...updatesociete,
          accountOverview: [updatedcompany],
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
    defaultFileList: record?.licence_de_transport_picture
      ? fileList
      : [],
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  const [updatesociete, setupdateSociete] = useState();

  useEffect(() => {
    setupdateSociete({
      // username:record?.username,
      // email: record?.email,
      user_role: "company",
      phoneNumber: record?.phoneNumber,
      accountOverview: [
        {
          __component: "section.company",
          name: record ? record?.name : null,
          // activity: record ? record?.activity : null,
          // category: record ? record?.category : null,
          // cinOwner: record ? record?.cinOwner : null,
          nameOwner: record ? record?.nameOwner : null,
          address: record ? record?.address : null,
          region: record ? record?.region : null,
          city: record ? record?.city : null,
          postalCode: record ? record?.postalCode : null,
          //    verified:record?.verified,
          //    logo :record?.logo,
          // kabis: record ? record?.kabis : null,
          // assurance_rc_pro: record
          //   ? record?.assurance_rc_pro
          //   : null,
          // numSiret: record ? record?.numSiret : null,
          kabis_picture: record
            ? record?.kabis_picture
            : null,
          assurance_rc_pro_picture: record
            ? record?.assurance_rc_pro_picture
            : null,
          cin_recto_picture: record
            ? record?.cin_recto_picture
            : null,
          cin_verso_picture: record
            ? record?.cin_verso_picture
            : null,
          licence_de_transport_picture: record
            ? record?.licence_de_transport_picture
            : null,
          urssaf: record ? record?.urssaf : null,
          attestation_fiscale: record
            ? record?.attestation_fiscale
            : null,
          rib_picture: record ? record?.rib_picture : null,
          assurance_rc_pro_date: record
            ? record?.assurance_rc_pro_date
            : null,
          licence_de_transport_date: record
            ? record?.licence_de_transport_date
            : null,
        },
      ],
    });
    setimage({
      file: record ? record?.urssaf : null,
      list: [record ? record?.urssaf : null],
    });
  }, [record]);
  // validation
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Inputerrors, setInputErrors] = useState({});
  const isInputValid = () => {
    const errors = {};

    if (!updatesociete?.phoneNumber) {
      errors.phoneNumber = "Veuillez saisir votre N° téléphone.";
    }

    if (!updatesociete?.name) {
      errors.name = "Veuillez saisir nom de votre societe.";
    }
    // if (!updatesociete?.activity) {
    //   errors.activity = "Veuillez saisir votre activité.";
    // }
    // if (!updatesociete?.category) {
    //   errors.category = "Veuillez saisir votre categorie.";
    // }
    // if (!updatesociete?.cinOwner) {
    //   errors.cinOwner = "Veuillez saisir votre CIN.";
    // }
    if (!updatesociete?.nameOwner) {
      errors.nameOwner = "Veuillez saisir votre nom.";
    }
    if (!updatesociete?.address) {
      errors.address = "Veuillez saisir votre adresse.";
    }
    if (!updatesociete?.region) {
      errors.region = "Veuillez saisir votre région.";
    }
    // if (!updatesociete?.activity) {
    //   errors.activity = "Veuillez saisir votre région.";
    // }
    if (!updatesociete?.city) {
      errors.city = "Veuillez saisir votre ville.";
    }
    if (!updatesociete?.postalCode) {
      errors.postalCode = "Veuillez saisir votre code postal.";
    }
    // if (!updatesociete?.kabis) {
    //   errors.kabis = "Veuillez saisir votre kabis.";
    // }

    if (!updatesociete?.assurance_rc_pro_date) {
      errors.assurance_rc_pro_date =
        "S'il vous plaît entrez votre date d'expiration de l'assurance rc pro.";
    }
    if (!updatesociete?.licence_de_transport_date) {
      errors.licence_de_transport_date =
        "S'il vous plaît entrez votre date d'expiration de licenece de transport.";
    }
    // if (!updatesociete?.assurance_rc_pro) {
    //   errors.assurance_rc_pro = "Veuillez saisir votre assurance rc pro.";
    // }
    // if (!updatesociete?.numSiret) {
    //   errors.numSiret = "Veuillez saisir votre numéro de siret.";
    // }

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
          <BasicFormWrapper className="mb-25 ">
            <p className="ModalagentAdd">Information de société</p>
            <form className="formUpdate">
              {" "}
              <Form.Item
                className="form_item_update_company"
                name="sDash_name"
                label="Nom de l'entreprise"
                validateStatus={Inputerrors.name ? "error" : ""}
                help={Inputerrors.name}
              >
                <Input
                  placeholder={
                    updatesociete
                      ? updatesociete?.name
                      : "null"
                  }
                  value={updatesociete?.name}
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
                />
              </Form.Item>
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-name"
                label="Nom complet"
                validateStatus={Inputerrors.nameOwner ? "error" : ""}
                help={Inputerrors.nameOwner}
              >
                <Input
                  placeholder={
                    updatesociete
                      ? updatesociete?.nameOwner
                      : "null"
                  }
                  value={
                    updatesociete
                      ? updatesociete?.nameOwner
                      : null
                  }
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
                />
              </Form.Item>{" "}
              <Form.Item
                className="form_item_update_company"
                name="sDash_city"
                label="Numéro de téléphone"
                validateStatus={Inputerrors.phoneNumber ? "error" : ""}
                help={Inputerrors.phoneNumber}
              >
                <Input
                  placeholder={updatesociete?.phoneNumber}
                  value={updatesociete?.phoneNumber}
                  onChange={(e) => {
                    setupdateSociete({
                      ...updatesociete,
                      phoneNumber: e.target.value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-email"
                label="Adresse e-mail"
                validateStatus={Inputerrors.email ? "error" : ""}
                help={Inputerrors.email}
              >
                <Input
                  disabled
                  placeholder={record?.email}

                  //  value={record?.email}
                  // onChange={(e) => {
                  //     setupdateSociete({
                  //         ...updatesociete,
                  //         email: e.target.value,
                  //         // username: e.target.value,
                  //     });
                  // }}
                />
              </Form.Item>
              {/* <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_email"
                  label="CIN de propriétaire "
                  validateStatus={Inputerrors.cinOwner ? "error" : ""}
                  help={Inputerrors.cinOwner}
                >
                  <Input
                    placeholder={
                      updatesociete
                        ? updatesociete?.cinOwner
                        : null
                    }
                    value={
                      updatesociete
                        ? updatesociete?.cinOwner
                        : null
                    }
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
                  />
                </Form.Item>
              </div> */}
              {/* <div className="mb-25">
                {" "}
                <Form.Item
                  name="sDash_f-n_siret"
                  label="Numéro de SIRET"
                  validateStatus={Inputerrors.numSiret ? "error" : ""}
                  help={Inputerrors.numSiret}
                >
                  <Input
                    placeholder={
                      updatesociete
                        ? updatesociete?.numSiret
                        : null
                    }
                    value={
                      updatesociete
                        ? updatesociete?.numSiret
                        : null
                    }
                    onChange={(e) => {
                      setupdateSociete({
                        ...updatesociete,
                        accountOverview: [
                          {
                            ...updatesociete,
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
                    placeholder={
                      updatesociete
                        ? updatesociete?.kabis
                        : null
                    }
                    value={
                      updatesociete
                        ? updatesociete?.kabis
                        : null
                    }
                    onChange={(e) => {
                      setupdateSociete({
                        ...updatesociete,
                        accountOverview: [
                          {
                            ...updatesociete,
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
                    placeholder={
                      updatesociete
                        ? updatesociete?.activity
                        : null
                    }
                    value={
                      updatesociete
                        ? updatesociete?.activity
                        : null
                    }
                    onChange={(e) => {
                      setupdateSociete({
                        ...updatesociete,
                        accountOverview: [
                          {
                            ...updatesociete,
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
                    placeholder={
                      updatesociete
                        ? updatesociete?.category
                        : null
                    }
                    value={
                      updatesociete
                        ? updatesociete?.category
                        : null
                    }
                    onChange={(e) => {
                      setupdateSociete({
                        ...updatesociete,
                        accountOverview: [
                          {
                            ...updatesociete,
                            category: e.target.value,
                          },
                        ],
                      });
                    }}
                  />
                </Form.Item>
              </div> */}
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-adresse"
                label="Adresse"
                validateStatus={Inputerrors.address ? "error" : ""}
                help={Inputerrors.address}
              >
                <Input
                  placeholder={
                    updatesociete
                      ? updatesociete?.address
                      : null
                  }
                  value={
                    updatesociete
                      ? updatesociete?.address
                      : null
                  }
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
                />
              </Form.Item>{" "}
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-codepostal"
                label="Code Postal"
                validateStatus={Inputerrors.postalCode ? "error" : ""}
                help={Inputerrors.postalCode}
              >
                <Input
                  placeholder={
                    updatesociete
                      ? updatesociete?.postalCode
                      : null
                  }
                  value={
                    updatesociete
                      ? updatesociete?.postalCode
                      : null
                  }
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
                />
              </Form.Item>{" "}
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-ville"
                label="ville"
                validateStatus={Inputerrors.city ? "error" : ""}
                help={Inputerrors.city}
              >
                <Input
                  placeholder={
                    updatesociete
                      ? updatesociete?.city
                      : null
                  }
                  value={
                    updatesociete
                      ? updatesociete?.city
                      : null
                  }
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
                />
              </Form.Item>
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-region"
                label="Région"
                validateStatus={Inputerrors.region ? "error" : ""}
                help={Inputerrors.region}
              >
                <Input
                  placeholder={
                    updatesociete
                      ? updatesociete?.region
                      : null
                  }
                  value={
                    updatesociete
                      ? updatesociete?.region
                      : null
                  }
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
                />
              </Form.Item>
              {/* <div className="mb-25">
                {" "} 
                <Form.Item
                  name="sDash_f-n_assurance"
                  label="Assurance Rc Pro"
                  validateStatus={Inputerrors.assurance_rc_pro ? "error" : ""}
                  help={Inputerrors.assurance_rc_pro}
                >
                  <Input
                    placeholder={
                      updatesociete
                        ? updatesociete?.assurance_rc_pro
                        : null
                    }
                    value={
                      updatesociete
                        ? updatesociete?.assurance_rc_pro
                        : null
                    }
                    onChange={(e) => {
                      setupdateSociete({
                        ...updatesociete,
                        accountOverview: [
                          {
                            ...updatesociete,
                            assurance_rc_pro: e.target.value,
                          },
                        ],
                      });
                    }}
                  />
                </Form.Item>
              </div> */}
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-licenec"
                label="Date d'expiration licence de transport"
                validateStatus={
                  Inputerrors.licence_de_transport_date ? "error" : ""
                }
                help={Inputerrors.licence_de_transport_date}
              >
                <DatePicker
                  placeholderText={"deùmai"}
                  // placeholderText={record?.licence_de_transport_date || null}
                  selected={
                    record?.licence_de_transport_date ||
                    null
                  }
                  onChange={(selectedDate) => {
                    setupdateSociete({
                      ...updatesociete,
                      accountOverview: [
                        {
                          ...updatesociete,
                          licence_de_transport_date: selectedDate,
                        },
                      ],
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                className="form_item_update_company"
                name="sDash_f-n_assurance"
                label="Date d'xpiration assurance Rc Pro"
                validateStatus={
                  Inputerrors.assurance_rc_pro_date ? "error" : ""
                }
                help={Inputerrors.assurance_rc_pro_date}
              >
                <DatePicker
                  value={updatesociete?.assurance_rc_pro_date || null}
                  onChange={(newDate) => {
                    setupdateSociete({
                      ...updatesociete,
                      accountOverview: [
                        {
                          ...updatesociete,
                          assurance_rc_pro_date: newDate,
                        },
                      ],
                    });
                  }}
                />
              </Form.Item>{" "}
            </form>
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
                      <Dragger {...fileUploadProps}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Drag and drop an image
                        </Heading>
                        <p className="ant-upload-hint">
                          or Browse to choose a file
                        </p>
                      </Dragger>
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
                    <Cards title="Attestation fiscale de la société">
                      <Dragger {...fileUploadFiscale}>
                        <p className="ant-upload-drag-icon">
                          <FeatherIcon icon="upload" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Drag and drop an image
                        </Heading>
                        <p className="ant-upload-hint">
                          or Browse to choose a file
                        </p>
                      </Dragger>
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
                    <Cards title="Photo de Kabis">
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
                          <FeatherIcon icon="plus-circle" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
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
                          <FeatherIcon icon="plus-circle" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
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
                          <FeatherIcon icon="plus-circle" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
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
                          <FeatherIcon icon="plus-circle" size={50} />
                        </p>
                        <Heading as="h4" className="ant-upload-text">
                          Déposez vos fichiers ici
                        </Heading>
                        <p className="ant-upload-hint">
                          Parcourir les fichiers de votre ordinateur
                        </p>
                      </Dragger>
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
        title={`Modifier Société N°${record?.id}`}
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
              <Button
                className="btn_Suivant"
                size="default"
                type="primary"
                key="submit"
                onClick={() => next()}
              >
                Suivant
              </Button>
            )}

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
                  Modal.confirm({
                    title: "Confirmation des modifications",
                    content:
                      "Etes vous sure de vouloir Modifier les coordonnées de cette Société?",
                    okText: "Oui",
                    okType: "danger",
                    cancelText: "Annuler",
                    onOk() {
                      dispatch(
                        updateUser({ id: record?.id, user: updatesociete })
                      ).then(() =>
                        dispatch(
                          getCompanies({
                            pagination: {
                              current: meta.page,
                              pageSize: meta.pageSize,
                            },
                            text: text,
                            status: status,
                          })
                        )
                      );
                      handleCancel();
                    },
                    onCancel() {
                      dispatch(
                        getCompanies({
                          pagination: {
                            current: meta.page,
                            pageSize: meta.pageSize,
                          },
                          text: text,
                          status: status,
                        })
                      );
                    },
                  });
                }}
              >
                Modifier
              </Button>
            )}
          </div>
        </>
      </Modal>
    </>
  );
};
UpdateSociete.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};
export default UpdateSociete;
