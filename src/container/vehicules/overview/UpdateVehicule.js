import React, { useEffect, useState } from "react";
// import { Form,  } from "antd";
import {
  Button,
  Col,
  Modal,
  message,
  Row,
  Form,
  Steps,
  Input,
  Upload,
  Select
} from "antd";
import propTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Cards } from "../../../components/cards/frame/cards-frame";
import {
  axiosDataSubmit,
  axiosFileClear,
} from "../../../redux/crud/axios/actionCreator";
import { AddProductForm } from "../../livreur/style";
import FeatherIcon from "feather-icons-react";
import { BasicFormWrapper, ImportStyleWrap } from "../../styled";
import Heading from "../../../components/heading/heading";
import Dragger from "antd/lib/upload/Dragger";
import {
 
  getVehiculeById,
  updateVehicule,
} from "../../../redux/vehicule/vehiculeSlice";
import axios from "axios";
import UploadNew from "../../../uploadMini/UploadNew";
import face1 from "../../../static/img/face1.png";
import face2 from "../../../static/img/face2.png";
import face3 from "../../../static/img/face3.png";
import face4 from "../../../static/img/face4.png";

import { useSelector } from "react-redux";
import { icons } from "antd/lib/image/PreviewGroup";
const types = {"1":"Éco", "2":"Berline", "3":"Van"}

function UpdateVehicule({
  visible,
  onCancel,
  match,
  record,
  recorddata,
  ping,
  setPing,
}) {
  const [form] = Form.useForm();
  // const toUpdate = useSelector((state) => state?.vehicule?.getv);
  // console.log("toUpdate", toUpdate);
  const dispatch = useDispatch();
  const [image, setimage] = useState();
  function beforeUpload(file) {
    const isJPG = file.type === "image/jpeg";
    if (!isJPG) {
      message.error("You can only upload JPG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJPG && isLt2M;
  }

  useEffect(() => {
    if (visible) {
      dispatch(getVehiculeById(recorddata.documentId));
    }
  }, [visible]);
  const uploadButton = (
    <div>
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const [updatevehicule, setupdatevehicule] = useState({
    data: {
      mark: "",
      model: "",
      year: "",
      color: "",
      matriculation: "",
      assuranceDate: "",
      validation: { validation_state: "waiting" },
      assurancePictures:
        recorddata?.assurancePictures?.data?.attributes,
      grayCardPictures:
        recorddata?.grayCardPictures?.data?.attributes,
      vehiculePictureface1:
        recorddata?.vehiculePictureface1?.data?.attributes,
      vehiculePictureface2:
        recorddata?.vehiculePictureface2?.data?.attributes,
      vehiculePictureface3:
        recorddata?.vehiculePictureface3?.data?.attributes,
      vehiculePictureface4:
        recorddata?.vehiculePictureface4?.data?.attributes,
        type: recorddata?.type.id,
    },
  });

  useEffect(() => {
    if (recorddata) {
      setupdatevehicule({
        data: {
          mark: recorddata?.mark,
          model: recorddata?.model,
          year: recorddata?.year,
          color: recorddata?.color,
          matriculation: recorddata?.matriculation,
          assuranceDate: recorddata?.assuranceDate,
          type: recorddata?.type.id,
          validation: { validation_state: "waiting" },
          assurancePictures: {
            ...recorddata?.assurancePictures?.data?.attributes,
            id: recorddata?.assurancePictures?.data?.id,
          },
          grayCardPictures: {
            ...recorddata?.grayCardPictures?.data?.attributes,
            id: recorddata?.grayCardPictures?.data?.id,
          },
          vehiculePictureface1: {
            ...recorddata?.vehiculePictureface1?.data?.attributes,
            id: recorddata?.vehiculePictureface1?.data?.id,
          },
          vehiculePictureface2: {
            ...recorddata?.vehiculePictureface2?.data?.attributes,
            id: recorddata?.vehiculePictureface2?.data?.id,
          },
          vehiculePictureface3: {
            ...recorddata?.vehiculePictureface3?.data?.attributes,
            id: recorddata?.vehiculePictureface3?.data?.id,
          },
          vehiculePictureface4: {
            ...recorddata?.vehiculePictureface4?.data?.attributes,
            id: recorddata?.vehiculePictureface4?.data?.id,
          },
        },
      });
    }
    setimage({
      file: recorddata
        ? recorddata?.vehiculePictureface1?.data?.attributes
        : null,
      list: [
        recorddata
          ? recorddata?.vehiculePictureface1?.data?.attributes
          : null,
      ],
    });
  }, [recorddata]);
  // upload images
  const fileList = [];
  const fileListvehiculePictureface1 = [
    {
      uid: "-1",
      name: recorddata?.vehiculePictureface1?.data?.attributes
        ? recorddata?.vehiculePictureface1?.data?.name
        : "",
      status: "done",
      url: recorddata?.vehiculePictureface1?.data?.attributes
        ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface1?.data?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListvehiculePictureface2 = [
    {
      uid: "-1",
      name: recorddata?.vehiculePictureface2?.data?.attributes
        ? recorddata?.vehiculePictureface2?.data?.name
        : "",
      status: "done",
      url: recorddata?.vehiculePictureface2?.data?.attributes
        ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface2?.data?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListvehiculePictureface3 = [
    {
      uid: "-1",
      name: recorddata?.vehiculePictureface3?.data?.attributes
        ? recorddata?.vehiculePictureface3?.data?.name
        : "",
      status: "done",
      url: recorddata?.vehiculePictureface3?.data?.attributes
        ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface3?.data?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListvehiculePictureface4 = [
    {
      uid: "-1",
      name: recorddata?.vehiculePictureface4?.data?.attributes
        ? recorddata?.vehiculePictureface4?.data?.name
        : "",
      status: "done",
      url: recorddata?.vehiculePictureface4?.data?.attributes
        ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface4?.data?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];

  const fileListassurancePictures = [
    {
      uid: "-1",
      name: recorddata?.assurancePictures?.data?.attributes
        ? recorddata?.assurancePictures?.data?.name
        : "",
      status: "done",
      url: recorddata?.assurancePictures?.data?.attributes
        ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.assurancePictures?.data?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];
  const fileListgrayCardPictures = [
    {
      uid: "-1",
      name: recorddata?.grayCardPictures?.data?.attributes
        ? recorddata?.grayCardPictures?.data?.name
        : "",
      status: "done",
      url: recorddata?.grayCardPictures?.data?.attributes
        ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.grayCardPictures?.data?.url}`
        : "",

      // thumbUrl: record?.logo?.name,
    },
  ];

  // upload file vehiculePictureface1
  const handleFileSelect = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData
      );

      if (response.status === 200) {
        const imageUrl = response.data[0];
        setupdatevehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            vehiculePictureface1: imageUrl,
          },
        }));
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }

      message.success("Fichier téléchargé avec succès.");
    } catch (error) {
      message.error("Le téléchargement du fichier a échoué.");
    }
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
    // defaultFileList: fileListvehiculePictureface1,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  // upload file vehiculePictureface2
  const handleFileSelect01 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data[0];
        setupdatevehicule((updatevehicule) => ({
          ...updatevehicule,
          data: {
            ...updatevehicule.data,
            vehiculePictureface2: imageUrl,
          },
        }));
        setPicturesErrors({});
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      message.error("Le téléchargement du fichier a échoué.");
    }
  };

  const fileUploadProps01 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect01(file);
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
    // defaultFileList: fileListvehiculePictureface2,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  // upload file vehiculePictureface3
  const handleFileSelect02 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data[0];
        setupdatevehicule((updatevehicule) => ({
          ...updatevehicule,
          data: {
            ...updatevehicule.data,
            vehiculePictureface3: imageUrl,
          },
        }));
        setPicturesErrors({});
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      message.error("Le téléchargement du fichier a échoué.");
    }
  };

  const fileUploadProps02 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect02(file);
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
    // defaultFileList: fileListvehiculePictureface3,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  // upload file vehiculePictureface4
  const handleFileSelect03 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data[0];
        setupdatevehicule((updatevehicule) => ({
          ...updatevehicule,
          data: {
            ...updatevehicule.data,
            vehiculePictureface4: imageUrl,
          },
        }));
        setPicturesErrors({});
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      message.error("Le téléchargement du fichier a échoué.");
    }
  };

  const fileUploadProps03 = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect03(file);
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
    // defaultFileList: fileListvehiculePictureface4,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };
  // upload file 2
  const handleFileSelect2 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data[0];
        setupdatevehicule((updatevehicule) => ({
          ...updatevehicule,
          data: {
            ...updatevehicule.data,
            assurancePictures: imageUrl,
          },
        }));
        setPicturesErrors({});
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      message.error("Le téléchargement du fichier a échoué.");
    }
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
    // defaultFileList: fileListassurancePictures,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  // upload file 3

  const handleFileSelect3 = async (e) => {
    const file = e;
    // .target.files[0];

    const isLt2MB = file.size / 1024 / 1024 < 1; // Limiting size to 2MB

    // console.log("file", file);
    const formData = new FormData();

    formData.append("files", file);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData
      );
      if (response.status === 200) {
        const imageUrl = response.data[0];
        setupdatevehicule((updatevehicule) => ({
          ...updatevehicule,
          data: {
            ...updatevehicule.data,
            grayCardPictures: imageUrl,
          },
        }));
        setPicturesErrors({});
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      message.error("Le téléchargement du fichier a échoué.");
    }
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
    // defaultFileList: fileListgrayCardPictures,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  const [addVehiculeErrors, setAddVehiculeErrors] = useState({});
  const isInputValid = () => {
    const { mark, model, year, color, matriculation, assuranceDate } =
      updatevehicule.data;

    const errors = {};

    if (!mark) {
      errors.mark = "Veuillez saisir marque de votre véhicule.";
    }

    if (!model) {
      errors.model = "Veuillez saisir modèle de votre véhicule.";
    }

    if (!year) {
      errors.year = "Veuillez saisir année de votre véhicule.";
    } else if (year < 1900 || year > new Date().getFullYear()) {
      errors.year =
        "L'année doit être comprise entre 1900 et l'année en cours.";
    }

    if (!color) {
      errors.color = "Veuillez saisir couleur de votre véhicule.";
    }

    if (!matriculation) {
      errors.matriculation =
        "Veuillez saisir immatriculation de votre véhicule.";
    }

    if (!assuranceDate) {
      errors.assuranceDate =
        "Veuillez saisir date d'assurance de votre véhicule. ";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    const errors = isInputValid();
    if (errors === true) {
      setCurrent(current + 1);
      setAddVehiculeErrors({});
    } else {
      setAddVehiculeErrors(errors);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  // validation pictures
  const [PicturesErrors, setPicturesErrors] = useState({});

  const PicturesValidation = () => {
    const {
      assurancePictures,
      grayCardPictures,
      vehiculePictureface1,
      vehiculePictureface2,
      vehiculePictureface3,
      vehiculePictureface4,
    } = updatevehicule.data;

    const errors = {};

    if (!assurancePictures) {
      errors.assurancePictures = "Veuillez choisier une Image.";
      message.error(`Assurance image vide Veuillez remplire.`);
    }
    if (!grayCardPictures) {
      errors.grayCardPictures = "Veuillez choisier une Image.";
      message.error(`Carte Grise vide Veuillez remplire.`);
    }
    if (!vehiculePictureface1) {
      errors.vehiculePictureface1 = "Veuillez choisier une Image.";
      message.error(`Face Gauche vide Veuillez remplire.`);
    }
    if (!vehiculePictureface2) {
      errors.vehiculePictureface2 = "Veuillez choisier une Image.";
      message.error(`Face Avant vide Veuillez remplire.`);
    }
    if (!vehiculePictureface3) {
      errors.vehiculePictureface3 = "Veuillez choisier une Image.";
      message.error(`Face Droit vide Veuillez remplire.`);
    }

    if (!vehiculePictureface4) {
      errors.vehiculePictureface4 = "Veuillez choisier une Image.";
      message.error(`Face Arrière vide Veuillez remplire .`);
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };
  const [assurancePictures, setAssurancePictures] = useState("");
  const handleUpload = () => {
    const validationResult = PicturesValidation();

     
    dispatch(
      updateVehicule({
        id: recorddata.documentId,
        vehicule: updatevehicule,
      })
    ).then(() => {
      setPing(!ping);
      message.success("modifier avec sucsesss!");
    });
    handleCancel();

    
  };

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

  
  const steps = [
    {
      title: "Information de Vehicule ",
      content: (
        <>
          <BasicFormWrapper className="mb-25">
            <p className="ModalagentAdd">Information de vehicule</p>
            <Form name="multi-form" layout="horizontal" className="formUpdate">
              <div className="mb-25">
                <Form.Item
                  name="mark vehicule"
                  label="Marque vehicule"
                  validateStatus={addVehiculeErrors.mark ? "error" : ""}
                  help={addVehiculeErrors.mark}
                >
                  <Input
                    placeholder={
                      updatevehicule ? updatevehicule?.data?.mark : "null"
                    }
                    value={updatevehicule ? updatevehicule?.data?.mark : "null"}
                    onChange={(e) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          mark: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="model vehicule"
                  label="Modèle véhicule"
                  validateStatus={addVehiculeErrors.model ? "error" : ""}
                  help={addVehiculeErrors.model}
                >
                  <Input
                    placeholder={
                      updatevehicule ? updatevehicule?.data?.model : "null"
                    }
                    value={
                      updatevehicule ? updatevehicule?.data?.model : "null"
                    }
                    //   value={
                    //     addvehicule ? addvehicule?...addvehicule?.?.model : null
                    //   }
                    onChange={(e) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          model: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="year"
                  label="year"
                  value={updatevehicule?.data?.year}
                  validateStatus={addVehiculeErrors.year ? "error" : ""}
                  help={addVehiculeErrors.year}
                >
                  <Input
                    placeholder={
                      updatevehicule ? updatevehicule?.data?.year : "null"
                    }
                    value={updatevehicule ? updatevehicule?.data?.year : "null"}
                    onChange={(e) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          year: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="color"
                  label="color"
                  validateStatus={addVehiculeErrors.color ? "error" : ""}
                  help={addVehiculeErrors.color}
                >
                  <Input
                    placeholder={
                      updatevehicule ? updatevehicule?.data?.color : "null"
                    }
                    value={
                      updatevehicule ? updatevehicule?.data?.color : "null"
                    }
                    onChange={(e) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          color: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="matriculation"
                  label="matriculation"
                  validateStatus={
                    addVehiculeErrors.matriculation ? "error" : ""
                  }
                  help={addVehiculeErrors.matriculation}
                >
                  <Input
                    placeholder={
                      updatevehicule
                        ? updatevehicule?.data?.matriculation
                        : "null"
                    }
                    value={
                      updatevehicule
                        ? updatevehicule?.data?.matriculation
                        : "null"
                    }
                    onChange={(e) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          matriculation: e.target.value,
                        },
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="type"
                  label="Type"
                  validateStatus={addVehiculeErrors.type ? "error" : ""}
                  help={addVehiculeErrors.type}
                >
                  <Select
                    placeholder="Sélectionnez le type de véhicule"
                    value={updatevehicule?.data?.type}
                    defaultValue={types[updatevehicule?.data?.type]} 
                    onChange={(value) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          type: value,
                        },
                      });
                    }}
                  >
                    {Object.entries(types).map(([key, value]) => (
                      <Select.Option   key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="mb-25">
                <Form.Item
                  name="Date d'assurance"
                  label="Date d'assurance"
                  validateStatus={
                    addVehiculeErrors.assuranceDate ? "error" : ""
                  }
                  help={addVehiculeErrors.assuranceDate}
                >
                  <Input
                    placeholder={
                      updatevehicule
                        ? updatevehicule?.data?.assuranceDate
                        : "null"
                    }
                    value={
                      updatevehicule
                        ? updatevehicule?.data?.assuranceDate
                        : "null"
                    }
                    type="date"
                    onChange={(e) => {
                      setupdatevehicule({
                        ...updatevehicule,
                        data: {
                          ...updatevehicule.data,
                          assuranceDate: e.target.value,
                        },
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
        <form className="create_vehicules_form">
          <ImportStyleWrap style={{ width: "100%" }}>
            <AddProductForm>
              <div className="add-product-block">
                <Row gutter={15}>
                  <Col xs={24}>
                    <div className="add-product-content">
                      <Cards title="Photo du véhicule">
                        <Dragger {...fileUploadProps}>
                          <p
                            className="ant-upload-drag-icon"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "20px",
                            }}
                          >
                            <h3 className="company_details_main_title">
                              Face Gauche
                            </h3>
                            <img
                              width={"20%"}
                              src={
                                recorddata?.vehiculePictureface1
                                  ?.data?.attributes
                                  ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface1?.data?.url}`
                                  : face1
                              }
                            />
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface1 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface1}
                          </p>
                        )}

                        <Dragger {...fileUploadProps01}>
                          <p
                            className="ant-upload-drag-icon"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "20px",
                            }}
                          >
                            <h3 className="company_details_main_title">
                              Face Avant
                            </h3>
                            <img
                              width={"20%"}
                              src={
                                recorddata?.vehiculePictureface2
                                  ?.data?.attributes
                                  ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface2?.data?.url}`
                                  : face2
                              }
                            />
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface2 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface1}{" "}
                          </p>
                        )}

                        <Dragger {...fileUploadProps02}>
                          <p
                            className="ant-upload-drag-icon"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "20px",
                            }}
                          >
                            <h3 className="company_details_main_title">
                              Face Droite
                            </h3>
                            <img
                              width={"50%"}
                              src={
                                recorddata?.vehiculePictureface3
                                  ?.data?.attributes
                                  ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface3?.data?.url}`
                                  : face3
                              }
                            />
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface3 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface1}
                          </p>
                        )}

                        <Dragger {...fileUploadProps03}>
                          <p
                            className="ant-upload-drag-icon"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "20px",
                            }}
                          >
                            <h3 className="company_details_main_title">
                              Face Arrière
                            </h3>
                            <img
                              width={"19%"}
                              src={
                                recorddata?.vehiculePictureface4
                                  ?.data?.attributes
                                  ? `${process.env.REACT_APP_BACKUP_URL}${recorddata?.vehiculePictureface4?.data?.url}`
                                  : face4
                              }
                            />
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface4 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface1}
                          </p>
                        )}

                        {/* code sources 4 pictures */}
                        {/* <div
                          className="personal_info_driver_action"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                            gap: "65px",
                          }}
                        >
                          <div>
                            <h3>Face Gauche</h3>
                            <UploadNew
                              dataToShow={
                                updateVehicule?.vehiculePictureface1
                                  ?.data?.attributes
                                  ? [
                                      {
                                        uid: "-1",
                                        name: updateVehicule?.attributes
                                          ?.vehiculePictureface1?.data
                                          ?.attributes
                                          ? updateVehicule?.attributes
                                              ?.vehiculePictureface1?.data
                                              ?.name
                                          : "",
                                        status: "done",
                                        url: updateVehicule?.attributes
                                          ?.vehiculePictureface1?.data
                                          ?.attributes
                                          ? `${process.env.REACT_APP_BACKUP_URL}${updateVehicule?.vehiculePictureface1?.data?.url}`
                                          : face1,
                                      },
                                    ]
                                  : fileListvehiculePictureface1
                              }
                              setFunction={Editface1}
                            />
                          </div>

                          <div>
                            <h3>Face Avant</h3>
                            <UploadNew
                              dataToShow={
                                updateVehicule?.vehiculePictureface2
                                  ?.data?.attributes
                                  ? [
                                      {
                                        uid: "-1",
                                        name: updateVehicule?.attributes
                                          ?.vehiculePictureface2?.data
                                          ?.attributes
                                          ? updateVehicule?.attributes
                                              ?.vehiculePictureface2?.data
                                              ?.name
                                          : "",
                                        status: "done",
                                        url: updateVehicule?.attributes
                                          ?.vehiculePictureface2?.data
                                          ?.attributes
                                          ? `${process.env.REACT_APP_BACKUP_URL}${updateVehicule?.vehiculePictureface2?.data?.url}`
                                          : face2,
                                      },
                                    ]
                                  : fileListvehiculePictureface2
                              }
                              setFunction={Editface2}
                            />
                          </div>

                          <div>
                            <h3>Face Droite</h3>
                            <UploadNew
                              dataToShow={
                                updateVehicule?.vehiculePictureface3
                                  ?.data?.attributes
                                  ? [
                                      {
                                        uid: "-1",
                                        name: updateVehicule?.attributes
                                          ?.vehiculePictureface3?.data
                                          ?.attributes
                                          ? updateVehicule?.attributes
                                              ?.vehiculePictureface3?.data
                                              ?.name
                                          : "",
                                        status: "done",
                                        url: updateVehicule?.attributes
                                          ?.vehiculePictureface3?.data
                                          ?.attributes
                                          ? `${process.env.REACT_APP_BACKUP_URL}${updateVehicule?.vehiculePictureface3?.data?.url}`
                                          : face3,
                                      },
                                    ]
                                  : fileListvehiculePictureface3
                              }
                              setFunction={Editface3}
                            />
                          </div>

                          <div>
                            <h3>Face Arrière</h3>
                            <UploadNew
                              dataToShow={
                                updateVehicule?.vehiculePictureface4
                                  ?.data?.attributes
                                  ? [
                                      {
                                        uid: "-1",
                                        name: updateVehicule?.attributes
                                          ?.vehiculePictureface4?.data
                                          ?.attributes
                                          ? updateVehicule?.attributes
                                              ?.vehiculePictureface4?.data
                                              ?.name
                                          : "",
                                        status: "done",
                                        url: updateVehicule?.attributes
                                          ?.vehiculePictureface4?.data
                                          ?.attributes
                                          ? `${process.env.REACT_APP_BACKUP_URL}${updateVehicule?.vehiculePictureface4?.data?.url}`
                                          : face4,
                                      },
                                    ]
                                  : fileListvehiculePictureface4
                              }
                              setFunction={Editface4}
                            />
                          </div>
                          <div>
                            <h3>Assurance</h3>
                            <UploadNew
                              dataToShow={
                                updateVehicule?.assurancePictures
                                  ?.data?.attributes
                                  ? [
                                      {
                                        uid: "-1",
                                        name: updateVehicule?.attributes
                                          ?.assurancePictures?.data?.attributes
                                          ? updateVehicule?.attributes
                                              ?.assurancePictures?.data
                                              ?.name
                                          : "",
                                        status: "done",
                                        url: updateVehicule?.attributes
                                          ?.assurancePictures?.data?.attributes
                                          ? `${process.env.REACT_APP_BACKUP_URL}${updateVehicule?.assurancePictures?.data?.url}`
                                          : face4,
                                      },
                                    ]
                                  : fileListassurancePictures
                              }
                              setFunction={assuranceP}
                            />
                          </div>
                          <div>
                            <h3>Carte Grise</h3>
                            <UploadNew
                              dataToShow={
                                updateVehicule?.grayCardPictures
                                  ?.data?.attributes
                                  ? [
                                      {
                                        uid: "-1",
                                        name: updateVehicule?.attributes
                                          ?.grayCardPictures?.data?.attributes
                                          ? updateVehicule?.attributes
                                              ?.grayCardPictures?.data
                                              ?.name
                                          : "",
                                        status: "done",
                                        url: updateVehicule?.attributes
                                          ?.grayCardPictures?.data?.attributes
                                          ? `${process.env.REACT_APP_BACKUP_URL}${updateVehicule?.grayCardPictures?.data?.url}`
                                          : face4,
                                      },
                                    ]
                                  : fileListgrayCardPictures
                              }
                              setFunction={grayCardP}
                            />
                          </div>
                        </div> */}
                      </Cards>
                    </div>
                  </Col>
                </Row>
              </div>
            </AddProductForm>
          </ImportStyleWrap>
        </form>
      ),
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    lineHeight: "50px",
    textAlign: "center",
    marginTop: 16,
  };
  return (
    <Modal
      type={state.modalType}
      title={`Modifier vehicule N°${record}`}
      visible={state.visible}
      width={700}
      footer={null}
      onCancel={handleCancel}
    >
      {/* <StepsUpdateVehicule
        visible={visible}
        onCancel={onCancel}
        setSelectedId={record}
        recorddata={recorddata}
      /> */}

      <>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          <div className="Horizontal_btn">
            {current < steps.length - 1 && (
              <Button
                size="default"
                type="primary"
                key="submit"
                className="btn_Suivant"
                onClick={() => next()}
              >
                Suivant
              </Button>
            )}
          </div>
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
                type="primary"
                className="btn_Suivant"
                onClick={handleUpload}
              >
                Sauvgarder
              </Button>
            )}
          </div>
        </div>
      </>
    </Modal>
  );
}

UpdateVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};

export default UpdateVehicule;
