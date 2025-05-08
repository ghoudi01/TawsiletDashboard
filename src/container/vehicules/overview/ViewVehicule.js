import React, { useState, useEffect } from "react";
import { Form, Image, message, Modal, Tag, Divider, Typography } from "antd";
import propTypes from "prop-types";
import styled from "styled-components";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch } from "react-redux";
import { getVehicule, updateVehicule } from "../../../redux/vehicule/vehiculeSlice";
import { AddProductForm } from "../../livreur/style";
import Img from "../../../imageZoom/Img";
import "../overview/viewCompany.css";
import { useSelector } from "react-redux";
import SelectGmVehicule from "../../../selectGm/SelectGmVehicule";
import PdfViewer from "../../PdfViewer";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";

const { Title, Text } = Typography;
const type = {"1":"Éco", "2":"Berline", "3":"Van"}
function ViewVehicule({ visible, onCancel, record, recorddata, meta, userRole, name }) {
  const [pdfViewer, setPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const thumbnailPluginInstance = thumbnailPlugin();
  const currentUser = useSelector((state) => state?.user?.currentUser);
   const details = {
    grayCard: recorddata?.grayCard,
    matriculation: recorddata?.matriculation,
    year: recorddata?.year,
    model: recorddata?.model,
    mark: recorddata?.mark,
    color: recorddata?.color,
    assuranceDate: recorddata?.assuranceDate,
    name: ["owner", "admin", "agent", "company"]?.includes(currentUser?.user_role)
      ? recorddata?.company_id?.name
      : "",
      type: recorddata?.type,
    grayCardPictures: recorddata?.grayCardPictures?.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg",
    assurancePictures: recorddata?.assurancePictures?.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg",
    vehiculePictureface1: recorddata?.vehiculePictureface1?.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg",
    vehiculePictureface2: recorddata?.vehiculePictureface2?.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg",
    vehiculePictureface3: recorddata?.vehiculePictureface3?.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg",
    vehiculePictureface4: recorddata?.vehiculePictureface4?.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg",
    validation: recorddata?.validation?.validation_state,
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
      setState({ visible });
    }
    return () => {
      unmounted = true;
    };
  }, [visible]);

  const handleCancel = () => {
    onCancel(false);
  };

  const dispatch = useDispatch();
  const [selectOptions] = useState([
    { value: "valid", label: "Valider" },
    { value: "invalid", label: "Réfuser" },
  ]);
  const [refusText, setRefusText] = useState("");

  const handleCancelPdf = () => {
    setPdfViewer(false);
  };

  return (
    <>
      <Modal
        title={<Title level={3} style={{ margin: 0 }}>{`Véhicule N°${record}`}</Title>}
        visible={state.visible}
        width={900}
        footer={null}
        onCancel={handleCancel}
        bodyStyle={{ padding: '24px' }}
      >
        <StyledVehicleView>
          <div className="header-section">
            <div className="title-section">
              <Title level={4} className="company-name">
                {details.name} 
                {details.validation === "valid" && (
                  <Tag color="green" style={{ marginLeft: 8 }}>Validé</Tag>
                )}
              </Title>
              <Text type="secondary">Informations du véhicule</Text>
            </div>
            
            {(userRole === "owner" || userRole === "admin") && (
              <SelectGmVehicule
                options={selectOptions}
                placeholder={details?.validation === "valid" ? "valider" : "Refuser"}
                onSelect={(e) => {
                  e?.value === "valid"
                    ? Modal.confirm({
                        title: "Confirmation D'action",
                        content: "Êtes-vous sûr de vouloir changer le statut de ce véhicule?",
                        okText: "Oui",
                        okType: "danger",
                        cancelText: "Annuler",
                        onOk() {
                          dispatch(
                            updateVehicule({
                              id: recorddata.documentId,
                              vehicule: {
                                data: {
                                  validation: { validation_state: e.value },
                                },
                              },
                            })
                          ).then(() => {
                            dispatch(getVehicule({ deepNumber: 3 }));
                            message.success("Modifié avec succès!");
                          });
                          handleCancel();
                        },
                        onCancel() {},
                      })
                    : Modal.confirm({
                        title: "Raison du refus",
                        content: (
                          <>
                            <textarea
                              placeholder="Quelles sont les raisons du refus"
                              className="data_search_input textRefus"
                              onChange={(e) => setRefusText(e.target.value)}
                            />
                          </>
                        ),
                        okText: "Oui",
                        okType: "danger",
                        cancelText: "Annuler",
                        onOk() {
                          dispatch(
                            updateVehicule({
                              id: recorddata.documentId,
                              vehicule: {
                                data: {
                                  validation: {
                                    validation_state: e.value,
                                    description: refusText,
                                  },
                                },
                              },
                            })
                          ).then(() => {
                            dispatch(getVehicule({ deepNumber: 3 }));
                            message.success("Modifié avec succès!");
                          });
                          handleCancel();
                        },
                        onCancel() {},
                      });
                }}
                active={details?.validation}
              />
            )}
          </div>

          <Divider orientation="left" plain>Détails du véhicule</Divider>
          
          <div className="details-grid">
            <div className="detail-item">
              <Text type="secondary">Marque</Text>
              <Text strong>{details.mark || '-'}</Text>
            </div>
            <div className="detail-item">
              <Text type="secondary">Modèle</Text>
              <Text strong>{details.model || '-'}</Text>
            </div>
            <div className="detail-item">
              <Text type="secondary">Année</Text>
              <Text strong>{details.year || '-'}</Text>
            </div>
            <div className="detail-item">
              <Text type="secondary">Couleur</Text>
              <Text strong>{details.color || '-'}</Text>
            </div>
            <div className="detail-item">
              <Text type="secondary">Immatriculation</Text>
              <Text strong>{details.matriculation || '-'}</Text>
            </div>
            <div className="detail-item">
              <Text type="secondary">Type</Text>
              <Text strong>{type[details?.type?.id] || '-'}</Text>
            </div>
            <div className="detail-item">
              <Text type="secondary">Date d'assurance</Text>
              <Text strong>{details.assuranceDate || '-'}</Text>
            </div>
          </div>

          <Divider orientation="left" plain>Photos du véhicule</Divider>
          
          <div className="image-gallery">
            <div className="image-container">
              <Text type="secondary">Face Gauche</Text>
              <Image 
                width={180} 
                height={120}
                src={details.vehiculePictureface1} 
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
              />
            </div>
            <div className="image-container">
              <Text type="secondary">Face Avant</Text>
              <Image 
                width={180} 
                height={120}
                src={details.vehiculePictureface2} 
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
              />
            </div>
            <div className="image-container">
              <Text type="secondary">Face Droite</Text>
              <Image 
                width={180} 
                height={120}
                src={details.vehiculePictureface3} 
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
              />
            </div>
            <div className="image-container">
              <Text type="secondary">Face Arrière</Text>
              <Image 
                width={180} 
                height={120}
                src={details.vehiculePictureface4} 
                style={{ objectFit: 'cover', borderRadius: 4 }}
                fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
              />
            </div>
          </div>

          <Divider orientation="left" plain>Documents</Divider>
          
          <div className="documents-section">
            <div className="document-card">
              <Title level={5} style={{ marginBottom: 12 }}>Assurance</Title>
              {recorddata?.assurancePictures?.ext !== ".pdf" ? (
                <Image 
                  width={180} 
                  height={120}
                  src={details.assurancePictures} 
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                />
              ) : (
                <div 
                  className="pdf-thumbnail"
                  onClick={() => {
                    setPdfUrl(details.assurancePictures);
                    setPdfViewer(true);
                  }}
                >
                  <Image 
                    width={180} 
                    height={120}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrWtD-HyTFTWhGR2sbJmF5JBKXwzhQHfjpCeAmEJ1cDSQYmXSbz_YsXnE7g&s"
                    style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                  />
                  <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>Cliquez pour voir le PDF</Text>
                </div>
              )}
            </div>
            
            <div className="document-card">
              <Title level={5} style={{ marginBottom: 12 }}>Carte Grise</Title>
              {recorddata?.grayCardPictures?.ext !== ".pdf" ? (
                <Image 
                  width={180} 
                  height={120}
                  src={details.grayCardPictures} 
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                  fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                />
              ) : (
                <div 
                  className="pdf-thumbnail"
                  onClick={() => {
                    setPdfUrl(details.grayCardPictures);
                    setPdfViewer(true);
                  }}
                >
                  <Image 
                    width={180} 
                    height={120}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrWtD-HyTFTWhGR2sbJmF5JBKXwzhQHfjpCeAmEJ1cDSQYmXSbz_YsXnE7g&s"
                    style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                  />
                  <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>Cliquez pour voir le PDF</Text>
                </div>
              )}
            </div>
          </div>
        </StyledVehicleView>
      </Modal>
      
      <PdfViewer
        pdfUrl={pdfUrl}
        visible={pdfViewer}
        handleCancelPdf={handleCancelPdf}
        thumbnailPluginInstance={thumbnailPluginInstance}
      />
    </>
  );
}

const StyledVehicleView = styled.div`
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    
    .company-name {
      display: flex;
      align-items: center;
    }
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
  }
  
  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 24px;
    margin-bottom: 24px;
    
    .image-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
  
  .documents-section {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    
    .document-card {
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #f0f0f0;
    }
    
    .pdf-thumbnail {
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .ant-divider {
    margin: 16px 0;
  }
`;

ViewVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ViewVehicule;