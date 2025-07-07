import React, { useState, useEffect } from "react";
import {   Image, message, Modal, Tag, Divider, Typography, Spin, Select } from "antd";
import propTypes from "prop-types";
import styled from "styled-components";
import { useDispatch } from "react-redux";
 import {  updateUser, } from "../../../redux/User/userSlice";

import { useSelector } from "react-redux";
import SelectGmVehicule from "../../../selectGm/SelectGmVehicule";
import PdfViewer from "../../PdfViewer";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import axios from "axios";

const { Title, Text } = Typography;
const type = { "1": "Éco", "2": "Berline", "3": "Van" };
const typeOptions = Object.entries(type).map(([id, name]) => ({
  value: id,
  label: name,
}));


function ViewVehicule({ visible, onCancel, record, userRole, recorddata }) {
  const [pdfViewer, setPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [vehiculeData, setVehiculeData] = useState(null);
  const [loading, setLoading] = useState(false);
   const [selectOptions] = useState([
    { value: "valid", label: "Valider" },
    { value: "invalid", label: "Réfuser" },
  ]);
  const thumbnailPluginInstance = thumbnailPlugin();
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();
  const [addedByUsers, setAddedByUsers] = useState([]);

  useEffect(() => {
    if (visible && recorddata?.documentId) {
      setLoading(true);
      axios
        .get(
          `${process.env.REACT_APP_BACKUP_URL}vehicules/${recorddata.documentId}?populate[0]=validation&populate[1]=vehiculePictureface1&populate[2]=vehiculePictureface2&populate[3]=vehiculePictureface3&populate[4]=vehiculePictureface4&populate[5]=assurancePictures&populate[6]=grayCardPictures&populate[7]=driver&populate[8]=type&populate[9]=grayCardPictureBack`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          setVehiculeData(res.data);
          // Fetch users who added this vehicule
          axios
            .get(
              `${process.env.REACT_APP_BACKUP_URL}users?filters[vehicules][id][$in]=${recorddata.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((userRes) => {
              console.log("userRes.data?.data",userRes.data)
              setAddedByUsers(userRes.data || []);
            })
            .catch(() => setAddedByUsers([]));
        })
        .catch(() => {
          message.error("Erreur lors du chargement des détails du véhicule");
        })
        .finally(() => setLoading(false));
    }
    if (!visible) {
      setVehiculeData(null);
      setAddedByUsers([]);
    }
  }, [visible, recorddata]);

  const handleCancel = () => {
    onCancel(false);
  };

  const handleTypeChange = async (newTypeId) => {
    setLoading(true);
    try {
      const jwt = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}vehicules/${recorddata.documentId}`,
        {
          data: {
            type: newTypeId,
          },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      message.success("Type de véhicule mis à jour avec succès!");
      // Refresh data
      const res = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}vehicules/${recorddata.documentId}?populate[0]=validation&populate[1]=vehiculePictureface1&populate[2]=vehiculePictureface2&populate[3]=vehiculePictureface3&populate[4]=vehiculePictureface4&populate[5]=assurancePictures&populate[6]=grayCardPictures&populate[7]=driver&populate[8]=type&populate[9]=grayCardPictureBack`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setVehiculeData(res.data);
    } catch (error) {
      message.error("Erreur lors de la mise à jour du type de véhicule.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPdf = () => {
    setPdfViewer(false);
  };

  if (!visible) return null;
 

  // Helper to get the best image url
  function getImageUrl(imageObj, size = "medium") {
    if (!imageObj) return "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg";
    if (imageObj.formats && imageObj.formats[size] && imageObj.formats[size].url) {
      return imageObj.formats[size].url;
    }
    return imageObj.url || "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg";
  }

  const data = vehiculeData?.data;
  

  return (
    <>
      <Modal
        title={<Title level={3} style={{ margin: 0 }}>{`Véhicule N°${record}`}</Title>}
        open={visible}
        width={900}
        footer={null}
        onCancel={handleCancel}
        bodyStyle={{ padding: "24px" }}
        destroyOnClose
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <StyledVehicleView>
            <div className="header-section">
              <div className="title-section">
                <Title level={4} className="company-name">
                  {["owner", "admin", "agent", "company"].includes(currentUser?.user_role)
                    ? data?.company_id?.name
                    : ""}
                  {data?.validation?.validation_state === "valid" && (
                    <Tag color="green" style={{ marginLeft: 8 }}>
                      Validé
                    </Tag>
                  )}
                </Title>
                <Text type="secondary">Informations du véhicule</Text>
              </div>
              {(userRole === "owner" || userRole === "admin") && (
                <SelectGmVehicule
                  options={selectOptions}
                  placeholder={data?.validation?.validation_state === "valid" ? "valider" : "Refuser"}
                  onSelect={(e) => {
                    if (e?.value === "valid" && !data?.type) {
                      Modal.warning({
                        title: "Type de véhicule manquant",
                        content: "Veuillez d'abord ajouter un type de véhicule avant de le valider.",
                        okText: "OK",
                      });
                      return;
                    }
                    if (e?.value === "valid") {
                      Modal.confirm({
                        title: "Confirmer la validation",
                        content: "Êtes-vous sûr de vouloir valider ce véhicule?",
                        okText: "Confirmer",
                        okType: "primary",
                        cancelText: "Annuler",
                        async onOk() {
                          try {
                            
                            setLoading(true);
                            const jwt = localStorage.getItem("token");
                            await axios.put(
                              `${process.env.REACT_APP_BACKUP_URL}vehicule/validation/${record}`,
                              {
                                validation: {
                                  validation_state: "valid",
                                },
                              },
                              {
                                headers: { Authorization: `Bearer ${jwt}` },
                              }
                            );

                             dispatch(
                              updateUser({
                                id: data.driver.id,
                                user: { pro: true },
                              })
                              
                            )

                            message.success("Statut mis à jour avec succès!");
                            // Refresh vehicle data
                            const res = await axios.get(
                              `${process.env.REACT_APP_BACKUP_URL}vehicules/${recorddata.documentId}?populate[0]=validation&populate[1]=vehiculePictureface1&populate[2]=vehiculePictureface2&populate[3]=vehiculePictureface3&populate[4]=vehiculePictureface4&populate[5]=assurancePictures&populate[6]=grayCardPictures&populate[7]=driver&populate[8]=type`,
                              {
                                headers: { Authorization: `Bearer ${jwt}` },
                              }
                            );
                            setVehiculeData(res.data);
                            handleCancel();
                          } catch (error) {
                            message.error("Erreur lors de la mise à jour du statut du véhicule.");
                          } finally {
                            setLoading(false);
                          }
                        },
                        onCancel() {},
                      });
                    } else {
                      let refusReason = "";
                      Modal.confirm({
                        title: "Raison du refus",
                        content: (
                          <div style={{ marginTop: 16 }}>
                            <textarea
                              placeholder="Veuillez indiquer les raisons du refus..."
                              className="data_search_input textRefus"
                              style={{ width: "100%", minHeight: 100, padding: 8 }}
                              onChange={(e) => {
                                refusReason = e.target.value;
                              }}
                            />
                          </div>
                        ),
                        okText: "Confirmer",
                        okType: "danger",
                        cancelText: "Annuler",
                        async onOk() {
                          try {
                            setLoading(true);
                            const jwt = localStorage.getItem("token");
                            await axios.put(
                              `${process.env.REACT_APP_BACKUP_URL}vehicule/validation/${record}`,
                              {
                                validation: {
                                  validation_state: "invalid",
                                  description: refusReason,
                                },
                              },
                              {
                                headers: { Authorization: `Bearer ${jwt}` },
                              }
                            );
                            message.success("Statut mis à jour avec succès!");
                            // Refresh vehicle data
                            const res = await axios.get(
                              `${process.env.REACT_APP_BACKUP_URL}vehicules/${recorddata.documentId}?populate[0]=validation&populate[1]=vehiculePictureface1&populate[2]=vehiculePictureface2&populate[3]=vehiculePictureface3&populate[4]=vehiculePictureface4&populate[5]=assurancePictures&populate[6]=grayCardPictures&populate[7]=driver`,
                              {
                                headers: { Authorization: `Bearer ${jwt}` },
                              }
                            );
                            setVehiculeData(res.data);
                            handleCancel();
                          } catch (error) {
                            message.error("Erreur lors de la mise à jour du statut du véhicule.");
                          } finally {
                            setLoading(false);
                          }
                        },
                        onCancel() {},
                      });
                    }
                  }}
                  active={data?.validation?.validation_state}
                />
              )}
            </div>
            <Divider orientation="left" plain>
              Ajouté par
            </Divider>
            <div style={{ marginBottom: 16 }}>
              {addedByUsers?.length === 0 ? (
                <Text type="secondary">Aucun utilisateur trouvé</Text>
              ) : (
                addedByUsers.map((user) => (
                  <div key={user.id}>
                    <Text strong>
                      {user.firstName || ""} {user.lastName || ""}
                    </Text>
                  </div>
                ))
              )}
            </div>
            <Divider orientation="left" plain>
              Détails du véhicule
            </Divider>
            <div className="details-grid">
              <div className="detail-item">
                <Text type="secondary">Marque</Text>
                <Text strong>{data?.mark || "-"}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Modèle</Text>
                <Text strong>{data?.model || "-"}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Année</Text>
                <Text strong>{data?.year || "-"}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Couleur</Text>
                <Text strong>{data?.color || "-"}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Immatriculation</Text>
                <Text strong>{data?.matriculation || "-"}</Text>
              </div>
              <div className="detail-item">
                <Text type="secondary">Type</Text>
                {userRole === "owner" || userRole === "admin" ? (
                  <Select
                    value={data?.type?.id?.toString()}
                    options={typeOptions}
                    onSelect={handleTypeChange}
                    style={{ width: "100%" }}
                    placeholder="Sélectionner un type"
                    loading={loading}
                  />
                ) : (
                  <Text strong>{type[data?.type?.id] || "-"}</Text>
                )}
              </div>
              <div className="detail-item">
                <Text type="secondary">Date d'assurance</Text>
                <Text strong>{data?.assuranceDate || "-"}</Text>
              </div>
            </div>
            <Divider orientation="left" plain>
              Photos du véhicule
            </Divider>
            <div className="image-gallery">
              <div className="image-container">
                <Text type="secondary">Face Gauche</Text>
                <Image
                  width={180}
                  height={120}
                  src={getImageUrl(data?.vehiculePictureface1)}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                />
              </div>
              <div className="image-container">
                <Text type="secondary">Face Avant</Text>
                <Image
                  width={180}
                  height={120}
                  src={getImageUrl(data?.vehiculePictureface2)}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                />
              </div>
              <div className="image-container">
                <Text type="secondary">Face Droite</Text>
                <Image
                  width={180}
                  height={120}
                  src={getImageUrl(data?.vehiculePictureface3)}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                />
              </div>
              <div className="image-container">
                <Text type="secondary">Face Arrière</Text>
                <Image
                  width={180}
                  height={120}
                  src={getImageUrl(data?.vehiculePictureface4)}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                  fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                />
              </div>
            </div>
            <Divider orientation="left" plain>
              Documents
            </Divider>
            <div className="documents-section">
              <div className="document-card">
                <Title level={5} style={{ marginBottom: 12 }}>
                  Assurance
                </Title>
                {data?.assurancePictures?.ext !== ".pdf" ? (
                  <Image
                    width={180}
                    height={120}
                    src={getImageUrl(data?.assurancePictures)}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                    fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                  />
                ) : (
                  <div
                    className="pdf-thumbnail"
                    onClick={() => {
                      setPdfUrl(getImageUrl(data?.assurancePictures));
                      setPdfViewer(true);
                    }}
                  >
                    <Image
                      width={180}
                      height={120}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrWtD-HyTFTWhGR2sbJmF5JBKXwzhQHfjpCeAmEJ1cDSQYmXSbz_YsXnE7g&s"
                      style={{ objectFit: "cover", borderRadius: 4, cursor: "pointer" }}
                    />
                    <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
                      Cliquez pour voir le PDF
                    </Text>
                  </div>
                )}
              </div>
              <div className="document-card">
                <Title level={5} style={{ marginBottom: 12 }}>
                  Carte Grise (Recto)
                </Title>
                {data?.grayCardPictures?.ext !== ".pdf" ? (
                  <Image
                    width={180}
                    height={120}
                    src={getImageUrl(data?.grayCardPictures)}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                    fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                  />
                ) : (
                  <div
                    className="pdf-thumbnail"
                    onClick={() => {
                      setPdfUrl(getImageUrl(data?.grayCardPictures));
                      setPdfViewer(true);
                    }}
                  >
                    <Image
                      width={180}
                      height={120}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrWtD-HyTFTWhGR2sbJmF5JBKXwzhQHfjpCeAmEJ1cDSQYmXSbz_YsXnE7g&s"
                      style={{ objectFit: "cover", borderRadius: 4, cursor: "pointer" }}
                    />
                    <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
                      Cliquez pour voir le PDF
                    </Text>
                  </div>
                )}
              </div>
              <div className="document-card">
                <Title level={5} style={{ marginBottom: 12 }}>
                  Carte Grise (Verso)
                </Title>
                {data?.grayCardPictureBack?.ext !== ".pdf" ? (
                  <Image
                    width={180}
                    height={120}
                    src={getImageUrl(data?.grayCardPictureBack)}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                    fallback="https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
                  />
                ) : (
                  <div
                    className="pdf-thumbnail"
                    onClick={() => {
                      setPdfUrl(getImageUrl(data?.grayCardPictureBack));
                      setPdfViewer(true);
                    }}
                  >
                    <Image
                      width={180}
                      height={120}
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrWtD-HyTFTWhGR2sbJmF5JBKXwzhQHfjpCeAmEJ1cDSQYmXSbz_YsXnE7g&s"
                      style={{ objectFit: "cover", borderRadius: 4, cursor: "pointer" }}
                    />
                    <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
                      Cliquez pour voir le PDF
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </StyledVehicleView>
        )}
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
  record: propTypes.oneOfType([propTypes.string, propTypes.number]),
  userRole: propTypes.string,
  recorddata: propTypes.object,
};

export default ViewVehicule;