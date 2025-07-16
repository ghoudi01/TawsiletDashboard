import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  message,
  Divider,
  Tag,
  Avatar,
  Card,
} from "antd";
import axios from "axios";
import SelectGmVehicule from "../../selectGm/SelectGmVehicule";
import ReactStars from "react-rating-stars-component";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import PdfViewer from "../PdfViewer";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  CarOutlined,
  StarOutlined,
} from "@ant-design/icons";
import ViewVehicule from "../vehicules/overview/ViewVehicule";
import { useDispatch, useSelector } from "react-redux";
 
import "./../livreur/overview/viewCompany.css";
import { capitalize } from "../../utility/utility";

const OverwiewLivreur = ({ open, setOpen, driverDetais, setPing, ping }) => {
  const thumbnailPluginInstance = thumbnailPlugin();
  const [pdfViewer, setPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [refusText, setRefusText] = useState("");
  const [driver, setDriver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vehiculeModalOpen, setVehiculeModalOpen] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const userRole = useSelector((state) => state?.user?.currentUser?.user_role);

  const selectOptions = [
    { value: "valid", label: "Valider" },
    { value: "invalid", label: "Réfuser" },
  ];

  // Fetch driver details and reviews
  useEffect(() => {
    const fetchDriverAndReviews = async () => {
      if (!open || !driverDetais?.id) return;
      setLoading(true);
      try {
        const jwt = localStorage.getItem("token");
        // Fetch driver details with populate
        const driverRes = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}users/${driverDetais.id}?populate[0]=vehicules&populate[1]=vehicules.validation&populate[2]=cinFront&populate[3]=cinBack&populate[4]=licenceFront&populate[5]=profilePicture&populate[6]=validation&populate[7]=licenceBack&populate[8]=sub_drivers`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        setDriver(driverRes.data);
        // Fetch all reviews
        const reviewsRes = await axios.get(
          `${process.env.REACT_APP_BACKUP_URL}reviews?pLevel=3`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        // Filter reviews for this driver
        setReviews(
          (reviewsRes.data?.data || []).filter(
            (el) => el?.driver?.id === driverRes.data?.id
          )
        );
      } catch (error) {
        message.error("Erreur lors du chargement des données du chauffeur.");
      } finally {
        setLoading(false);
      }
    };
    fetchDriverAndReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, driverDetais?.id]);

  // Handlers
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCancelPdf = () => {
    setPdfViewer(false);
  };

  const handleValidationChange = (e) => {
    if (e?.value === "valid") {
      confirmValidation();
    } else {
      confirmRejection();
    }
  };

  const confirmValidation = () => {
    // Check for at least one valid  car
    
    Modal.confirm({
      title: "Confirmer la validation",
      content: "Êtes-vous sûr de vouloir valider ce chauffeur?",
      okText: "Confirmer",
      okType: "primary",
      cancelText: "Annuler",
      onOk() {
        updateDriverStatus("valid");
      },
      onCancel() {
        if (driver) fetchDriver();
      },
    });
  };

  const confirmRejection = () => {
    Modal.confirm({
      title: "Raison du refus",
      content: (
        <div style={{ marginTop: 16 }}>
          <textarea
            placeholder="Veuillez indiquer les raisons du refus..."
            className="data_search_input textRefus"
            style={{ width: "100%", minHeight: 100, padding: 8 }}
            onChange={(e) => setRefusText(e.target.value)}
          />
        </div>
      ),
      okText: "Confirmer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        updateDriverStatus("invalid");
      },
      onCancel() {
        if (driver) fetchDriver();
      },
    });
  };

  // Update driver validation status
  const updateDriverStatus = async (status) => {
    if (!driver) return;
    try {
      const jwt = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_BACKUP_URL}driver/${driver.id}/validation`,
        {
          validation: {
            validation_state: status,
            ...(status === "invalid" && { description: refusText }),
          },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setPing((prev) => !prev);
      message.success("Statut mis à jour avec succès!");
      handleCancel();
      // Refresh driver details
      fetchDriver();
    } catch (error) {
      message.error("Erreur lors de la mise à jour du statut du chauffeur.");
    }
  };

  // Refetch driver details only
  const fetchDriver = async () => {
    if (!driverDetais?.id) return;
    try {
      const jwt = localStorage.getItem("token");
      const driverRes = await axios.get(
        `${process.env.REACT_APP_BACKUP_URL}users/${driverDetais.id}?populate[0]=vehicules&populate[1]=vehicules.validation&populate[2]=cinFront&populate[3]=cinBack&populate[4]=licenceFront&populate[5]=profilePicture&populate[6]=validation&populate[7]=licenceBack`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setDriver(driverRes.data);
    } catch (error) {
      // silent
    }
  };

  const renderDocumentPreview = (document, title, isLicense = false) => {
    const isPDF = document?.ext === ".pdf";
    const backupImage =
      "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg";
    const pdfIcon = "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    const url = isLicense ? document?.url : document?.url;

    return (
      <Card
        hoverable
        style={{ width: 200, marginRight: 16, marginBottom: 16 }}
        cover={
          <div
            style={{ padding: 16, display: "flex", justifyContent: "center" }}
          >
            <Image
              width={150}
              src={isPDF ? pdfIcon : document ? url : backupImage}
              alt={title}
              preview={!isPDF}
              onClick={() => isPDF && (setPdfUrl(url), setPdfViewer(true))}
              style={{ cursor: isPDF ? "pointer" : "default" }}
            />
          </div>
        }
      >
        <Card.Meta title={title} />
      </Card>
    );
  };

  const renderReview = (review) => {
    return (
      <div className="review-card" key={review.id}>
        <div className="review-header">
          <div className="review-client">
            <Avatar icon={<UserOutlined />} />
            <span className="client-name">
              {capitalize(review?.client?.firstName)}
              <br />
              {capitalize(review?.client?.lastName)}
            </span>
          </div>
          <div className="review-rating">
            <ReactStars
              count={5}
              edit={false}
              isHalf={true}
              value={review?.score}
              size={24}
              activeColor="#ffd700"
            />
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="review-content">
          <p>{review?.note}</p>
        </div>
      </div>
    );
  };

 

  const getStatusTag = () => {
    const status = driver?.validation?.validation_state;
    const color =
      status === "valid" ? "green" : status === "invalid" ? "red" : "orange";
    const text =
      status === "valid"
        ? "Validé"
        : status === "invalid"
        ? "Refusé"
        : "En attente";
    return <Tag color={color}>{text}</Tag>;
  };
   return (
    <>
      <Modal
        title={
          <div className="modal-title">
            <span>Détails du Chauffeur</span>
            {getStatusTag()}
          </div>
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={900}
        footer={null}
        className="driver-modal"
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>Chargement...</div>
        ) : (
          driver && (
            <>
              <div className="driver-header">
                <Image
                  width={75}
                  height={75}
                  src={`${driver?.profilePicture?.url}`}
                  alt={"driver avatar"}
                  preview={true}
                  style={{
                    cursor: "default",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div className="driver-info">
                  <h2>
                    {capitalize(driver?.firstName)} {capitalize(driver?.lastName)}
                    {driver?.region && (
                      <span style={{ fontWeight: 400, fontSize: 18, color: '#888', marginLeft: 8 }}>
                        - {capitalize(driver.region)}
                      </span>
                    )}
                  </h2>
                  <div className="driver-rating">
                    <ReactStars
                      count={5}
                      edit={false}
                      isHalf={true}
                      value={driver?.rating}
                      size={20}
                      activeColor="#ffd700"
                    />
                    <span>({reviews?.length} avis)</span>
                  </div>
                </div>
                {[ "owner","agent_support"].includes(userRole)&&(<div className="driver-actions">
                  <SelectGmVehicule
                    options={selectOptions}
                    cssClass="vehiculeSelect"
                    placeholder={
                      driver?.validation?.validation_state === "valid"
                        ? "Valider"
                        : "Refuser"
                    }
                    onSelect={handleValidationChange}
                    active={driver?.validation?.validation_state}
                  />
                </div>)}
              </div>

              <Divider orientation="left" className="section-divider">
                <IdcardOutlined /> Informations personnelles
              </Divider>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <UserOutlined />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Nom complet</div>
                    <div className="info-value">
                      {capitalize(driver?.firstName)} {capitalize(driver?.lastName)}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <PhoneOutlined />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Téléphone</div>
                    <div className="info-value">
                      +{driver?.phoneNumber || "Non renseigné"}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <MailOutlined />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Email</div>
                    <div className="info-value">{driver?.email}</div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <EnvironmentOutlined />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Adresse</div>
                    <div className="info-value">12 Rue de la Liberté</div>
                  </div>
                </div>
              </div>

              <Divider orientation="left" className="section-divider">
                <IdcardOutlined /> Documents
              </Divider>

              <div className="documents-section">
                <div className="documents-row">
                  {renderDocumentPreview(driver?.cinFront, "CIN Recto")}
                  {renderDocumentPreview(driver?.cinBack, "CIN Verso")}
                  {renderDocumentPreview(
                    driver?.licenceFront,
                    "Permis de conduire",
                    true
                  )}
                    {renderDocumentPreview(
                    driver?.licenceBack,
                    "Permis de conduire Verso",
                    true
                  )}
                </div>
              </div>

              <Divider orientation="left" className="section-divider">
                <StarOutlined /> Avis ({reviews?.length})
              </Divider>

              <div className="reviews-section">
                {reviews?.length > 0 ? (
                  reviews?.map(renderReview)
                ) : (
                  <div className="no-reviews">
                    <p>Aucun avis disponible pour ce chauffeur</p>
                  </div>
                )}
              </div>
              <Divider orientation="left" className="section-divider">
                {driver?.sub_drivers?.length} Sub Drivers
              </Divider>
              <div className="sub-driver-grid">
                {driver?.sub_drivers?.length > 0 ? (
                  driver.sub_drivers.map((subDriver) => (
                    <div key={subDriver?.id} className="sub-driver-card">
                      <h4 className="sub-driver-name">
                        {subDriver?.firstName} {subDriver?.lastName}
                      </h4>
                      <p className="sub-driver-info">📞 {subDriver?.phoneNumber}</p>
                      <p className="sub-driver-info">✉️ {subDriver?.email}</p>
                    </div>
                  ))
                ) : (
                  <div className="no-sub-drivers">
                    Aucun sous-chauffeur disponible pour ce chauffeur
                  </div>
                )}
              </div>
              <Divider orientation="left" className="section-divider">
                {driver?.vehicules?.length} Cars
              </Divider>
              <div className="sub-driver-grid">
                {driver?.vehicules?.length > 0 ? (
                  driver.vehicules.map((car) => {
                    let status = car?.validation?.validation_state;
                    let color =
                      status === "valid"
                        ? "green"
                        : status === "invalid"
                        ? "red"
                        : "orange";
                    let text =
                      status === "valid"
                        ? "Validé"
                        : status === "invalid"
                        ? "Refusé"
                        : "En attente";
                    return (
                      <div
                        key={car?.id}
                        className="sub-driver-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedVehicule(car);
                          setVehiculeModalOpen(true);
                        }}
                      >
                        <h4 className="sub-driver-name">
                          {car?.mark} {car?.model} <Tag color={color}>{text}</Tag>
                        </h4>
                        <p className="sub-driver-info">
                          Matriculation: {car?.matriculation}
                        </p>
                        <p className="sub-driver-info">Color: {car?.color}</p>
                        <p className="sub-driver-info">
                          Assurance Date: {car?.assuranceDate}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-sub-drivers">
                    Aucun vehicules disponible pour ce chauffeur
                  </div>
                )}
              </div>
            </>
          )
        )}
      </Modal>

      <PdfViewer
        pdfUrl={pdfUrl}
        visible={pdfViewer}
        handleCancelPdf={handleCancelPdf}
        thumbnailPluginInstance={thumbnailPluginInstance}
      />

      {selectedVehicule && (
        <ViewVehicule
          visible={vehiculeModalOpen}
          onCancel={() => {
            setVehiculeModalOpen(false);
            setSelectedVehicule(null);
            fetchDriver();
          }}
          record={selectedVehicule?.id}
          recorddata={selectedVehicule}
          userRole={"admin"}
        />
      )}

      <style jsx>{`
        .modal-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .driver-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .driver-info {
          flex: 1;
        }

        .driver-info h2 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }

        .driver-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #666;
        }

        .driver-actions {
          margin-left: auto;
        }

        .section-divider {
          margin: 24px 0;
          color: #1890ff;
          font-weight: 500;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .info-icon {
          font-size: 20px;
          color: #1890ff;
        }

        .info-label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .documents-section {
          margin-bottom: 24px;
        }

        .documents-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .review-card {
          padding: 16px;
          margin-bottom: 16px;
          border-radius: 8px;
          background: #f9f9f9;
        }

        .review-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
        }

        .review-client {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .client-name {
          font-weight: 500;
          color: #333;
        }

        .review-rating {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .review-date {
          font-size: 12px;
          color: #888;
        }

        .review-content {
          padding-left: 64px;
        }

        .no-reviews {
          text-align: center;
          padding: 24px;
          color: #888;
          background: #f9f9f9;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

export default OverwiewLivreur;