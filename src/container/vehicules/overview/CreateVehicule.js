import React, { useEffect, useState } from "react";

import {
  Modal,
  Button,
  Col,
  message,
  Row,
  Form,
  Steps,
  Input,
  AutoComplete,
  Upload,
  DatePicker,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  getVehicule,
  addNewVehicule,
} from "../../../redux/vehicule/vehiculeSlice";
import Dragger from "antd/lib/upload/Dragger";
import FeatherIcon from "feather-icons-react";
import { BasicFormWrapper, ImportStyleWrap } from "../../styled";
import Heading from "../../../components/heading/heading";
import { AddProductForm } from "../../livreur/style";
import { Cards } from "../../../components/cards/frame/cards-frame";
import propTypes from "prop-types";
import axios from "axios";
import face1 from "../../../static/img/face1.png";
import face2 from "../../../static/img/face2.png";
import face3 from "../../../static/img/face3.png";
import face4 from "../../../static/img/face4.png";
import moment from "moment";

const CreateVehicule = ({ visible, onCancel }) => {
  const [assurancePictures, setAssurancePictures] = useState("");
  const dispatch = useDispatch();
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const currentRole = useSelector(
    (state) => state?.user?.currentUser?.user_role
  );

  const currentDate = moment();
  const minDate = moment(currentDate).add(1, "months");

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

  const handleCancel = () => {
    onCancel();
  };

  //-----------------------upload -------------------

  // upload images
  const fileList = [];
  const fileListvehiculePictureface1 = [];
  const fileListvehiculePictureface2 = [];
  const fileListvehiculePictureface3 = [];
  const fileListvehiculePictureface4 = [];
  const fileListassurancePictures = [];
  const fileListgrayCardPictures = [];
  const [image, setimage] = useState();

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
      if ([200, 201].includes(response.status)) {
        const imageUrl = response.data[0];
        delete imageUrl.documentId;
        setaddvehicule((prevState) => ({
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
    } catch (error) {
      console.log(error)
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
        message.success(`${info.file.name} Fichier téléchargé avec succès.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} Le téléchargement du fichier a échoué.`
        );
      }
    },
    listType: "picture",
    defaultFileList: fileListvehiculePictureface1,
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
      if ([200, 201].includes(response.status)) {
        const imageUrl = response.data[0];
        delete imageUrl.documentId;
        setaddvehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            vehiculePictureface2: imageUrl,
          },
        }));
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      console.log(error)
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
        message.success(`${info.file.name} Fichier téléchargé avec succès.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} Le téléchargement du fichier a échoué. `
        );
      }
    },
    listType: "picture",
    defaultFileList: fileListvehiculePictureface2,
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
      if ([200, 201].includes(response.status)) {
        const imageUrl = response.data[0];
        delete imageUrl.documentId;
        setaddvehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            vehiculePictureface3: imageUrl,
          },
        }));
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      console.log(error)
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
        message.success(`${info.file.name} Fichier téléchargé avec succès.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} Le téléchargement du fichier a échoué.`
        );
      }
    },
    listType: "picture",
    defaultFileList: fileListvehiculePictureface3,
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
      if ([200, 201].includes(response.status)) {
        const imageUrl = response.data[0];
        delete imageUrl.documentId;
        setaddvehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            vehiculePictureface4: imageUrl,
          },
        }));
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      console.log(error)
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
        message.success(`${info.file.name} Fichier téléchargé avec succès.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} Le téléchargement du fichier a échoué.`
        );
      }
    },
    listType: "picture",
    defaultFileList: fileListvehiculePictureface4,
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
      if ([200, 201].includes(response.status)) {
        const imageUrl = response.data[0];
        delete imageUrl.documentId;
        setaddvehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            assurancePictures: imageUrl,
          },
        }));
        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      console.log(error)
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
        message.success(`${info.file.name} Fichier téléchargé avec succès.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} "Le téléchargement du fichier a échoué.`
        );
      }
    },
    listType: "picture",
    defaultFileList: fileListassurancePictures,
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
      if ([200, 201].includes(response.status)) {
        const imageUrl = response.data[0];
        delete imageUrl.documentId;
        setaddvehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            grayCardPictures: imageUrl,
          },
        }));

        message.success("Fichier téléchargé avec succès.");
      } else {
        message.error("Le téléchargement du fichier a échoué.");
      }
    } catch (error) {
      console.log(error)
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
        message.success(`${info.file.name} Fichier téléchargé avec succès.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} "Le téléchargement du fichier a échoué.`
        );
      }
    },
    listType: "picture",
    defaultFileList: fileListgrayCardPictures,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  };

  /////////////////////////////////////////////////////////////
  const [addvehicule, setaddvehicule] = useState({
    data: {
      mark: "",
      model: "",
      year: "",
      color: "",
      matriculation: "",
      assuranceDate: minDate,
    
      assurancePictures: null,
      grayCardPictures: null,
      vehiculePictureface1: null,
      vehiculePictureface2: null,
      vehiculePictureface3: null,
      vehiculePictureface4: null,
      validation: { validation_state: "waiting", description: "" },
    },
  });
  
  const [addVehiculeErrors, setAddVehiculeErrors] = useState({});

  const isInputValid = () => {
    const {
      mark,
      model,
      year,
      color,
      matriculation,
 
      assuranceDate,
    } = addvehicule.data;

    const errors = {};

    if (!mark?.trim()) {
      errors.mark = "Veuillez saisir marque de votre véhicule.";
    }

    if (!model?.trim()) {
      errors.model = "Veuillez saisir modèle de votre véhicule.";
    }

    if (!year) {
      errors.year = "Veuillez saisir année de votre véhicule.";
    } else if (year < 2000 || year > new Date().getFullYear()) {
      errors.year =
        "L'année doit être comprise entre 2000 et l'année en cours.";
    }

    if (!color?.trim()) {
      errors.color = "Veuillez saisir couleur de votre véhicule.";
    }

    if (!matriculation?.trim()) {
      errors.matriculation =
        "Veuillez saisir immatriculation de votre véhicule.";
    }

    if (!assuranceDate) {
      errors.assuranceDate =
        "Veuillez saisir date d'assurance de votre véhicule. ";
    }
  

    return Object.keys(errors).length === 0 ? true : errors;
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
    } = addvehicule.data;

    const errors = {};

    if (!assurancePictures) {
      errors.assurancePictures = "Veuillez choisier une Image.";
    }
    if (!grayCardPictures) {
      errors.grayCardPictures = "Veuillez choisier une Image.";
    }
    if (!vehiculePictureface1) {
      errors.vehiculePictureface1 = "Veuillez choisier une Image.";
    }
    if (!vehiculePictureface2) {
      errors.vehiculePictureface2 = "Veuillez choisier une Image.";
    }
    if (!vehiculePictureface3) {
      errors.vehiculePictureface3 = "Veuillez choisier une Image.";
    }

    if (!vehiculePictureface4) {
      errors.vehiculePictureface4 = "Veuillez choisier une Image.";
    }

    return Object.keys(errors).length === 0 ? true : errors;
  };

  const handleUpload = () => {
    const validationResult = PicturesValidation();

    if (validationResult === true) {
      dispatch(addNewVehicule(addvehicule)).then(() => {
        dispatch(getVehicule({ deepNumber: 2 }));
        setPicturesErrors({});
        message.success("Ajouter avec succès !");
      });
      onCancel();
      setPicturesErrors({});
      setAssurancePictures("");
    } else {
      setPicturesErrors(validationResult);
    }
  };
  // validation pictures
  //
  // useEffect(() => {
  //   getCurrentUser();
  // });

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

  const saveAS = () => {
    const errors = PicturesValidation();
    if (errors === true) {
      dispatch(addNewVehicule(addvehicule)).then(() => {
        dispatch(getVehicule({ deepNumber: 2 }));
        message.success("Ajouter avec succès !");
      });
      setPicturesErrors({});
    } else {
      setPicturesErrors(errors);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: "Détails de véhicule ",
      content: (
        <>
          <BasicFormWrapper>
            <p className="ModalagentAdd">Information de Vehicule</p>
            <form className="formUpdate">
             
              

              <Form.Item
                className="form_item_update_company"
                name="model"
                label="Modèle véhicule"
                validateStatus={addVehiculeErrors.model ? "error" : ""}
                help={addVehiculeErrors.model}
              >
                <Input
                  placeholder="Modèle véhicule"
                  value={addvehicule.data.model}
                  onChange={(e) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        model: e.target.value,
                      },
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                className="form_item_update_company"
                name="marque"
                label="Marque véhicule"
                validateStatus={addVehiculeErrors.model ? "error" : ""}
                help={addVehiculeErrors.model}
              >
                <Input
                  placeholder="Marque véhicule"
                  value={addvehicule.data.mark}
                  onChange={(e) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        mark: e.target.value,
                      },
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                className="form_item_update_company"
                name="sDash_l-name"
                label="Année"
                type="number"
                validateStatus={addVehiculeErrors.year ? "error" : ""}
                help={addVehiculeErrors.year}
              >
                <Input
                  type="number"
                  placeholder="Année"
                  value={addvehicule.data.year}
                  onChange={(e) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        year: e.target.value,
                      },
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                className="form_item_update_company"
                name="sDash_country"
                label="Couleur"
                validateStatus={addVehiculeErrors.color ? "error" : ""}
                help={addVehiculeErrors.color}
              >
                <Input
                  placeholder="Couleur"
                  value={addvehicule.data.color}
                  onChange={(e) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        color: e.target.value,
                      },
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                className="form_item_update_company"
                name="matercule"
                label="Immatriculation"
                validateStatus={addVehiculeErrors.matriculation ? "error" : ""}
                help={addVehiculeErrors.matriculation}
              >
                <Input
                  placeholder="Immatriculation"
                  value={addvehicule.data.matriculation}
                  onChange={(e) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        matriculation: e.target.value,
                      },
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                className="form_item_update_company"
                name="vehicleType"
                label="Type de véhicule"
                validateStatus={addVehiculeErrors.vehicleType ? "error" : ""}
                help={addVehiculeErrors.vehicleType}
              >
                <Select
                  placeholder="Sélectionnez le type de véhicule"
                  value={addvehicule.data.type}
                  onChange={(value) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        type: value,
                      },
                    })
                  }
                >
                  <Select.Option value={1}>Éco</Select.Option>
                  <Select.Option value={2}>Berline</Select.Option>
                  <Select.Option value={3}>Van</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                className="form_item_update_company"
                name="Date d'assurance"
                label="Date d'assurance"
                validateStatus={addVehiculeErrors.assuranceDate ? "error" : ""}
                help={addVehiculeErrors.assuranceDate}
              >
                <DatePicker
                  // type="date"
                  disabledDate={(current) => current && current < minDate}
                  defaultValue={minDate}
                  placeholder="Date d'assurance .."
                  value={addvehicule.data.assuranceDate}
                  onChange={(e) =>
                    setaddvehicule({
                      ...addvehicule,
                      data: {
                        ...addvehicule.data,
                        assuranceDate: e,
                      },
                    })
                  }
                />
              </Form.Item>
            </form>
          </BasicFormWrapper>
        </>
      ),
    },
    {
      title: "Plus de détails",
      content: (
        <form className="create_reservation_form">
          <ImportStyleWrap style={{ width: "100%" }}>
            <AddProductForm>
              <div className="add-product-block" style={{ display: "flex" }}>
                <Row gutter={15}>
                  <Col xs={24}>
                    <div className="add-product-content">
                      <Cards
                        title="Photo du véhicule"
                        style={{ width: "100%", display: "flex", gap: "10px" }}
                      >
                        <Dragger
                          style={{ height: "10px" }}
                          {...fileUploadProps}
                        >
                          <p className="ant-upload-drag-icon">
                            <h3 className="company_details_main_title">
                              Face Gauche
                            </h3>
                            <img src={face1} width={"100%"} />
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
                        <div style={{ paddingBottom: "1rem" }}>
                          {addvehicule?.data?.vehiculePictureface1?.data?.map(
                            (imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Uploaded ${index}`}
                              />
                            )
                          )}
                        </div>
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
                            <img src={face2} width={"30%"} />
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface2 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface2}
                          </p>
                        )}
                        <div style={{ paddingBottom: "1rem" }}>
                          {addvehicule?.data?.vehiculePictureface2?.data?.map(
                            (imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Uploaded ${index}`}
                              />
                            )
                          )}
                        </div>

                        <Dragger {...fileUploadProps02}>
                          <p className="ant-upload-drag-icon">
                            <h3 className="company_details_main_title">
                              Face Droite
                            </h3>
                            <img src={face3} width={"100%"} />
                            <FeatherIcon icon="upload" size={50} />{" "}
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface3 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface3}
                          </p>
                        )}
                        <div style={{ paddingBottom: "1rem" }}>
                          {addvehicule?.data?.vehiculePictureface3?.data?.map(
                            (imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Uploaded ${index}`}
                              />
                            )
                          )}
                        </div>

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
                            <img src={face4} width={"30%"} />
                            <FeatherIcon icon="upload" size={50} />{" "}
                          </p>
                        </Dragger>
                        {PicturesErrors.vehiculePictureface4 && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.vehiculePictureface4}
                          </p>
                        )}
                        <div style={{ paddingBottom: "1rem" }}>
                          {addvehicule?.data?.vehiculePictureface4?.data?.map(
                            (imageUrl, index) => (
                              <img
                                key={index}
                                src={imageUrl}
                                alt={`Uploaded ${index}`}
                              />
                            )
                          )}
                        </div>
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
                      <Cards title="Assurance">
                        <Dragger {...fileUploadProps2}>
                          <p className="ant-upload-drag-icon">
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                          <Heading as="h4" className="ant-upload-text">
                            Déposer vos fichiers ici
                          </Heading>
                          <p className="ant-upload-hint">
                            Parcourir les fichiers de votre ordinateur
                          </p>
                        </Dragger>
                        {PicturesErrors.assurancePictures && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.assurancePictures}
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
                      <Cards title="Carte Grise">
                        <Dragger {...fileUploadProps3}>
                          <p className="ant-upload-drag-icon">
                            <FeatherIcon icon="upload" size={50} />
                          </p>
                          <Heading as="h4" className="ant-upload-text">
                            Déposer vos fichiers ici
                          </Heading>
                          <p className="ant-upload-hint">
                            Parcourir les fichiers de votre ordinateur
                          </p>
                        </Dragger>
                        {PicturesErrors.grayCardPictures && (
                          <p
                            className="error__message"
                            style={{ color: "red" }}
                          >
                            {PicturesErrors.grayCardPictures}
                          </p>
                        )}
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
    <>
      <Modal
        type={state.modalType}
        title="Ajouter Vehicule... "
        visible={state.visible}
        width={700}
        footer={null}
        onCancel={handleCancel}
      >
        <>
          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current].content}</div>
          <div style={{ marginTop: 24 }}>
            {current < steps.length - 1 && (
              <>
                <div className="Horizontal_btn">
                  <Button
                    size="default"
                    type="primary"
                    key="submit"
                    onClick={next}
                    className="btn_Suivant"
                  >
                    Suivant
                  </Button>
                </div>
              </>
            )}
            <div className="Horizontal_btn">
              {current > 0 && (
                <Button
                  style={{ margin: "0 8px" }}
                  onClick={prev}
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
                  Sauvegarder
                </Button>
              )}
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};
CreateVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};
export default CreateVehicule;
