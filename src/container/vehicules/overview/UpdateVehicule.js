import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Select,
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
import { fetchVehicleTypes } from "../../../utility/vehicleTypeUtils";
// Remove hardcoded types object
// const types = { 1: "Éco", 2: "Berline", 3: "Van" };

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
  const dispatch = useDispatch();
  const [image, setimage] = useState();
  const [vehicleTypes, setVehicleTypes] = useState({});

  // Fetch vehicle types from settings API
  useEffect(() => {
    const loadVehicleTypes = async () => {
      try {
        const types = await fetchVehicleTypes();
        setVehicleTypes(types);
      } catch (error) {
        console.error("Error loading vehicle types:", error);
      }
    };

    loadVehicleTypes();
  }, []);

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
      dispatch(getVehiculeById(recorddata?.documentId));
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
      assurancePictures: null,
      grayCardPictures: null,
      grayCardPictureBack: null,
      vehiculePictureface1: null,
      vehiculePictureface2: null,
      vehiculePictureface3: null,
      vehiculePictureface4: null,
       type: recorddata?.type?.id,
     
    },
  });
  const handleUpload = () => {
    let payload = { ...updatevehicule };
    if (payload.data) {
      payload.data.vehiculePictureface1 = updatevehicule?.data?.vehiculePictureface1?.id;
      payload.data.vehiculePictureface2 = updatevehicule?.data?.vehiculePictureface2?.id;
      payload.data.vehiculePictureface3 = updatevehicule?.data?.vehiculePictureface3?.id;
      payload.data.vehiculePictureface4 = updatevehicule?.data?.vehiculePictureface4?.id;
      payload.data.assurancePictures = updatevehicule?.data?.assurancePictures?.id;
      payload.data.grayCardPictures = updatevehicule?.data?.grayCardPictures?.id;
      payload.data.grayCardPictureBack = updatevehicule?.data?.grayCardPictureBack?.id;
    }

    dispatch(
      updateVehicule({
        id: recorddata?.documentId,
        vehicule: payload
      })
    ).then(() => {
      setPing(!ping);
      message.success("modifier avec sucsesss!");
    });
    handleCancel();
  };
  useEffect(() => {
    if (visible) {
    if (recorddata) {
     
       setupdatevehicule({
        loaded:true,
        data: {
          mark: recorddata?.mark,
          model: recorddata?.model,
          year: recorddata?.year,
          color: recorddata?.color,
          matriculation: recorddata?.matriculation,
          assuranceDate: recorddata?.assuranceDate,
          type: recorddata?.type?.id,
          vehiculePictureface1: recorddata?.vehiculePictureface1,
          vehiculePictureface2: recorddata?.vehiculePictureface2,
          vehiculePictureface3:recorddata?.vehiculePictureface3,
          vehiculePictureface4:recorddata?.vehiculePictureface4,
          assurancePictures:recorddata?.assurancePictures,
          grayCardPictures: recorddata?.grayCardPictures,
          grayCardPictureBack: recorddata?.grayCardPictureBack,
     
        },
      });
  
    }}
    else {
      setupdatevehicule({})
    }

    setimage({
      file: recorddata ? recorddata?.vehiculePictureface1 : null,
      list: [recorddata ? recorddata?.vehiculePictureface1 : null],
    });
  }, [recorddata,visible]);
 
 

  // Constants for file upload configuration
  const UPLOAD_CONFIG = {
    maxSize: 2, // MB
    allowedTypes: ['image/jpeg', 'image/png'],
    uploadUrl: `${process.env.REACT_APP_BACKUP_URL}upload`,
  };

  // Memoized file validation
  const validateFile = useCallback((file) => {
    const isAllowedType = UPLOAD_CONFIG.allowedTypes.includes(file.type);
    const isLt2MB = file.size / 1024 / 1024 < UPLOAD_CONFIG.maxSize;

    if (!isAllowedType) {
      message.error('Vous ne pouvez télécharger que des fichiers JPG ou PNG!');
      return false;
    }
    if (!isLt2MB) {
      message.error(`L'image doit être inférieure à ${UPLOAD_CONFIG.maxSize}MB!`);
      return false;
    }
    return true;
  }, []);

  // Memoized file upload handler
  const handleFileSelect = useCallback(async (file, attributeName) => {
    if (!validateFile(file)) return;

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post(
        UPLOAD_CONFIG.uploadUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        const imageUrl = response.data[0];
        setupdatevehicule((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            [attributeName]: imageUrl,
          },
        }));
        setPicturesErrors((prev) => ({ ...prev, [attributeName]: null }));
        message.success("Fichier téléchargé avec succès.");
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error("Le téléchargement du fichier a échoué.");
      setPicturesErrors((prev) => ({ 
        ...prev, 
        [attributeName]: "Erreur lors du téléchargement" 
      }));
    }
  }, [validateFile]);

  // Memoized onChange handler
  const handleUploadChange = useCallback((info) => {
    const { status } = info.file;
    if (status !== "uploading") {
      setimage((prev) => ({ 
        ...prev, 
        file: info.file, 
        list: info.fileList 
      }));
    }
    if (status === "done") {
      message.success(`${info.file.name} téléchargé avec succès.`);
    } else if (status === "error") {
      message.error(`${info.file.name} a échoué.`);
    }
  }, []);

  // Memoized file upload props creator
  const createFileUploadProps = useCallback((attributeName) => ({
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileSelect(file, attributeName);
      return false;
    },
    onChange: handleUploadChange,
    listType: "picture",
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  }), [handleFileSelect, handleUploadChange]);

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
      grayCardPictureBack,
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
    if (!grayCardPictureBack) {
      errors.grayCardPictureBack = "Veuillez choisir l'image du verso de la carte grise.";
      message.error(`Carte Grise (verso) vide Veuillez remplire.`);
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
                    {Object.entries(vehicleTypes).map(([key, value]) => (
                      <Select.Option key={key} value={key}>
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
                      updatevehicule?.data?.assuranceDate
                    }
                    value={
                      updatevehicule?.data?.assuranceDate
                    }
                    defaultValue={updatevehicule?.data?.assuranceDate}
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
                      <Cards title="Photos du véhicule">
                        <Row gutter={[16, 16]}>
                          {/* Front View */}
                          <Col xs={24} md={12}>
                            <Dragger {...createFileUploadProps('vehiculePictureface1')}>
                              <p className="ant-upload-drag-icon" style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "20px",
                              }}>
                                <h3 className="company_details_main_title">Vue Avant</h3>
                                <img
                                  alt="Vue Avant"
                                  width={"100%"}
                                  src={recorddata?.vehiculePictureface1?.url || face1}
                                />
                                <FeatherIcon icon="upload" size={50} />
                              </p>
                            </Dragger>
                            {PicturesErrors.vehiculePictureface1 && (
                              <p className="error__message" style={{ color: "red" }}>
                                {PicturesErrors.vehiculePictureface1}
                              </p>
                            )}
                          </Col>

                          {/* Back View */}
                          <Col xs={24} md={12}>
                            <Dragger {...createFileUploadProps('vehiculePictureface2')}>
                              <p className="ant-upload-drag-icon" style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "20px",
                              }}>
                                <h3 className="company_details_main_title">Vue Arrière</h3>
                                <img
                                  alt="Vue Arrière"
                                  width={"100%"}
                                  src={recorddata?.vehiculePictureface2?.url || face2}
                                />
                                <FeatherIcon icon="upload" size={50} />
                              </p>
                            </Dragger>
                            {PicturesErrors.vehiculePictureface2 && (
                              <p className="error__message" style={{ color: "red" }}>
                                {PicturesErrors.vehiculePictureface2}
                              </p>
                            )}
                          </Col>

                          {/* Left Side */}
                          <Col xs={24} md={12}>
                            <Dragger {...createFileUploadProps('vehiculePictureface3')}>
                              <p className="ant-upload-drag-icon" style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "20px",
                              }}>
                                <h3 className="company_details_main_title">Vue Gauche</h3>
                                <img
                                  alt="Vue Gauche"
                                  width={"100%"}
                                  src={recorddata?.vehiculePictureface3?.url || face3}
                                />
                                <FeatherIcon icon="upload" size={50} />
                              </p>
                            </Dragger>
                            {PicturesErrors.vehiculePictureface3 && (
                              <p className="error__message" style={{ color: "red" }}>
                                {PicturesErrors.vehiculePictureface3}
                              </p>
                            )}
                          </Col>

                          {/* Right Side */}
                          <Col xs={24} md={12}>
                            <Dragger {...createFileUploadProps('vehiculePictureface4')}>
                              <p className="ant-upload-drag-icon" style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "20px",
                              }}>
                                <h3 className="company_details_main_title">Vue Droite</h3>
                                <img
                                  alt="Vue Droite"
                                  width={"100%"}
                                  src={recorddata?.vehiculePictureface4?.url || face4}
                                />
                                <FeatherIcon icon="upload" size={50} />
                              </p>
                            </Dragger>
                            {PicturesErrors.vehiculePictureface4 && (
                              <p className="error__message" style={{ color: "red" }}>
                                {PicturesErrors.vehiculePictureface4}
                              </p>
                            )}
                          </Col>
                        </Row>
                      </Cards>

                      <Cards title="Documents" style={{ marginTop: "20px" }}>
                        <Row gutter={[16, 16]}>
                          {/* Carte Grise Recto */}
                          <Col xs={24} md={12}>
                            <Dragger {...createFileUploadProps('grayCardPictures')}>
                              <p className="ant-upload-drag-icon" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                                <h3 className="company_details_main_title">Carte Grise (Recto)</h3>
                               {!recorddata?.grayCardPictures?.url? <FeatherIcon icon="file-text" size={50} />
                             :  <img
                                  alt="grayCardPictures"
                                  width={"100%"}
                                  src={recorddata?.grayCardPictures?.url}
                                />}
                                <FeatherIcon icon="upload" size={50} />
                              </p>
                            </Dragger>
                            {PicturesErrors.grayCardPictures && (
                              <p className="error__message" style={{ color: "red" }}>
                                {PicturesErrors.grayCardPictures}
                              </p>
                            )}
                          </Col>
                          {/* Carte Grise Verso */}
                          <Col xs={24} md={12}>
                            <Dragger {...createFileUploadProps('grayCardPictureBack')}>
                              <p className="ant-upload-drag-icon" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                                <h3 className="company_details_main_title">Carte Grise (Verso)</h3>
                               {!recorddata?.grayCardPictureBack?.url? <FeatherIcon icon="file-text" size={50} />
                             :  <img
                                  alt="grayCardPictureBack"
                                  width={"100%"}
                                  src={recorddata?.grayCardPictureBack?.url}
                                />}
                                <FeatherIcon icon="upload" size={50} />
                              </p>
                            </Dragger>
                            {PicturesErrors.grayCardPictureBack && (
                              <p className="error__message" style={{ color: "red" }}>
                                {PicturesErrors.grayCardPictureBack}
                              </p>
                            )}
                          </Col>
                        </Row>
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
    {updatevehicule.loaded&&(  <>
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
      </>)}
    </Modal>
  );
}

UpdateVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  match: propTypes.object,
};

export default UpdateVehicule;
