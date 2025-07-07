import React, { useState, useEffect } from "react";
import { Modal, Row, Col, Image, Tag, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { PhoneOutlined, LinkOutlined } from "@ant-design/icons";
import styled from "styled-components";
import propTypes from "prop-types";

// Components
import PdfViewer from "../../PdfViewer";
import StatusSelector from "./StatusSelector";
import FilePreview from "./FilePreview";
import DriverCard from "./DriverCard";
import VehicleCard from "./VehicleCard";

// Redux
import { getCompanies, getCompanyById } from "../../../redux/User/userSlice";

// Styles
import { DividerLine, SectionTitle } from "./CompanyStyles";

const ViewCompanyModal = ({ visible, onCancel, companyId, filterStatus, textFilter }) => {
  const dispatch = useDispatch();
  const [previewFile, setPreviewFile] = useState(null);

  // Select data from Redux store
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const users = useSelector((state) => state.user.users);
  const company = useSelector((state) => state?.user?.currentCompany);
  const vehicules = company?.vehicules;
  const loading = useSelector((store) => store?.user?.isLoading);
  const [ping, setPing] = useState(false);

  // Fetch company data when modal opens
  useEffect(() => {
    if (visible && companyId) {
      dispatch(getCompanyById({ id: companyId })).then(()=>extractCompanyDetails());
    }
    return () => {
      // Cleanup if needed
    };
  }, [visible, companyId, dispatch, ping]);

  // Extract documents based on country type (Tunisia or Individual)
  const getDocuments = (documents) => {
    if (!documents) return {};

    const tunisiaDocs = documents.find(
      (doc) => doc.__typename === "ComponentCountryDocumentsTunisia"
    );
    const individualDocs = documents.find(
      (doc) => doc.__typename === "ComponentCountryDocumentsIndividual"
    );

    const docs = tunisiaDocs || individualDocs || {};

    return {
      attestation_cnss: docs.attestation_cnss,
      attestation_fiscale: docs.attestation_fiscale,
      cin_recto: docs.cin_recto_picture,
      cin_verso: docs.cin_verso_picture,
      licence_transport: docs.licence_transport,
      rib: docs.rib,
      rne: docs.rne,
      assurance_rc_pro: individualDocs?.assurance_rc_pro,
      carte_professionnelle: individualDocs?.carte_professionnelle,
      carte_professionnelle_transport:
        individualDocs?.carte_professionnelle_transport,
      assurance_expiration_date: docs.assurance_expiration_date,
      licence_transport_expiration_date: docs.licence_transport_expiration_date,
    };
  };

  // Compute company details directly (no useMemo)
  const [companyDetails, setCompanyDetails] = useState(null);

  const extractCompanyDetails = () =>{
    setCompanyDetails(company
    ? {
        id: company?.documentId,
        name: company?.name,
        owner:
          `${company?.owner?.firstName || ""} ${
            company?.owner?.lastName || ""
          }`.trim() || "N/A",
        email: company?.owner?.email,
        phone: company?.owner?.phoneNumber,
        address: company?.address,
        region: company?.region,
        city: company?.city,
        postalCode: company?.postalCode,
        activity: company?.activity,
        category: company?.category,
        country: company?.country,
        logo: company?.logo,
        confirmed: company.confirmed,
        status:
          company?.confirmed === null
            ? "wait"
            : company?.confirmed
            ? "valid"
            : "invalid",
        documents: getDocuments(company?.Documents),
        createdAt: company?.createdAt,
        publishedAt: company?.publishedAt,
      }
    : null)}

  // Compute company vehicles directly (no useMemo)
  const companyVehicles =
    vehicules?.filter((v) => v.company_id?.data?.id === company?.Id) || [];

  // Compute company drivers directly (no useMemo)
  const companyDrivers =
    users?.filter(
      (u) => u.company_id?.id === company?.Id && u?.user_role === "driver"
    ) || [];

  if (!companyDetails || loading) {
    return (
      <StyledModal
        title="Loading Company..."
        open={visible}
        width={1000}
        onCancel={onCancel}
        footer={null}
      >
        <Spin size="large" />
      </StyledModal>
    );
  }

  return (
    <StyledModal
      title={`Company #${companyDetails?.id}`}
      open={visible}
      width={1000}
      onCancel={onCancel}
      footer={null}
    >
      {loading ? (
        <Spin
          size="large"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      ) : (
        <>
          <HeaderSection>
            <CompanyTitle>
              {companyDetails.name}
              {companyDetails.logo?.url && (
                <Image
                  src={companyDetails.logo.url}
                  width={40}
                  height={40}
                  preview={false}
                  style={{ marginLeft: 10 }}
                />
              )}
              <StatusTag
                color={
                  companyDetails.status === "valid"
                    ? "green"
                    : companyDetails.status === "wait"
                    ? "orange"
                    : "red"
                }
              >
                {companyDetails.status}
              </StatusTag>
            </CompanyTitle>
            <StatusSelector
              currentStatus={companyDetails.status}
              companyId={companyDetails?.id}
              textFilter={textFilter}
              filterStatus={filterStatus}
              setPing={setPing}
              ping={ping}
            />
          </HeaderSection>

          <CompanySection title="Company Information">
            <InfoGrid>
              <InfoItem label="Owner" value={companyDetails.owner} />
              <InfoItem label="Phone" value={companyDetails.phone} />
              <InfoItem label="Email" value={companyDetails.email} />
              <InfoItem label="Address" value={companyDetails.address} />
              <InfoItem label="Region" value={companyDetails.region} />
              <InfoItem label="City" value={companyDetails.city} />
              <InfoItem
                label="Postal Code"
                value={companyDetails.postalCode}
              />
              <InfoItem label="Activity" value={companyDetails.activity} />
              <InfoItem label="Category" value={companyDetails.category} />
              <InfoItem label="Country" value={companyDetails.country} />
              <InfoItem
                label="Created At"
                value={new Date(companyDetails.createdAt).toLocaleDateString()}
              />
              {companyDetails.publishedAt && (
                <InfoItem
                  label="Published At"
                  value={new Date(
                    companyDetails.publishedAt
                  ).toLocaleDateString()}
                />
              )}
            </InfoGrid>
          </CompanySection>

          <CompanySection title="Legal Documents">
            <DocumentsGrid>
              {Object.entries(companyDetails.documents).map(
                ([key, doc]) =>
                  doc && (
                    <FilePreview
                      key={key}
                      label={key.replace(/_/g, " ")}
                      file={doc}
                      onPreview={setPreviewFile}
                      expirationDate={
                        key === "assurance_rc_pro"
                          ? companyDetails.documents.assurance_expiration_date
                          : key === "licence_transport"
                          ? companyDetails.documents
                              .licence_transport_expiration_date
                          : null
                      }
                    />
                  )
              )}
            </DocumentsGrid>
          </CompanySection>

          {companyDrivers.length > 0 && (
            <CompanySection title="Drivers">
              <DriversList>
                {companyDrivers.map((driver) => (
                  <DriverCard key={driver.id} driver={driver} />
                ))}
              </DriversList>
            </CompanySection>
          )}

          {companyVehicles.length > 0 && (
            <CompanySection title="Vehicles">
              <VehiclesList>
                {companyVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicule={vehicle} />
                ))}
              </VehiclesList>
            </CompanySection>
          )}

          <PdfViewer
            file={previewFile}
            visible={!!previewFile}
            onClose={() => setPreviewFile(null)}
          />
        </>
      )}
    </StyledModal>
  );
};

// Styled Components (unchanged)
const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CompanyTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusTag = styled(Tag)`
  font-size: 14px;
  padding: 4px 8px;
`;

const InfoGrid = styled(Row)`
  gap: 16px 0;
`;

const InfoItem = ({ label, value }) => (
  <Col span={8}>
    <div className="info-item">
      <label>{label}</label>
      <div className="value">{value || "N/A"}</div>
    </div>
  </Col>
);

const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

const DriversList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VehiclesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const CompanySection = ({ title, children }) => (
  <section className="company-section">
    <SectionTitle>{title}</SectionTitle>
    <DividerLine />
    {children}
  </section>
);

ViewCompanyModal.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  companyId: propTypes.string.isRequired,
  filter: propTypes.object,
};

export default ViewCompanyModal;