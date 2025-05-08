import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, message, Upload } from "antd";
import axios from "axios";
import { logout, updateUser } from "../redux/User/userSlice";

// Constants
const FILE_TYPES = {
  KABIS: "kabis_picture",
  RC_PRO: "assurance_rc_pro_picture",
  CIN_RECTO: "cin_recto_picture",
  CIN_VERSO: "cin_verso_picture",
  TRANSPORT_LICENSE: "licence_de_transport_picture",
  RIB: "rib_picture",
};

const Revalidate = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [pictures, setPictures] = useState({});
  const [picturesErrors, setPicturesErrors] = useState({
    kabis_picture: false,
    assurance_rc_pro_picture: false,
    cin_recto_picture: false,
    cin_verso_picture: false,
    licence_de_transport_picture: false,
    rib_picture: false,
    licence_de_transport_date: false,
    assurance_rc_pro_date: false,
  });

  // Initialize form with current user data
  useEffect(() => {
    if (currentUser) {
      setPictures({
        validation: { validation_state: "waiting" },
        accountOverview: [{
          __component: "section.company",
          kabis_picture: currentUser?.kabis_picture || null,
          assurance_rc_pro_picture: currentUser?.assurance_rc_pro_picture || null,
          cin_recto_picture: currentUser?.cin_recto_picture || null,
          cin_verso_picture: currentUser?.cin_verso_picture || null,
          licence_de_transport_picture: currentUser?.licence_de_transport_picture || null,
          rib_picture: currentUser?.rib_picture || null,
          assurance_rc_pro_date: currentUser?.assurance_rc_pro_date || null,
          licence_de_transport_date: currentUser?.licence_de_transport_date || null,
        }],
      });
    }
  }, [currentUser]);

  // Helper function to create file list
  const createFileList = (fileData) => {
    if (!fileData?.[0]) return [];
    return [{
      uid: "-1",
      name: fileData[0]?.name || "",
      status: "done",
      url: `${process.env.REACT_APP_BACKUP_URL}${fileData[0]?.url}` || "",
    }];
  };

  // File lists for each upload component
  const fileLists = {
    [FILE_TYPES.KABIS]: createFileList(currentUser?.kabis_picture),
    [FILE_TYPES.RC_PRO]: createFileList(currentUser?.assurance_rc_pro_picture),
    [FILE_TYPES.CIN_RECTO]: createFileList(currentUser?.cin_recto_picture),
    [FILE_TYPES.CIN_VERSO]: createFileList(currentUser?.cin_verso_picture),
    [FILE_TYPES.TRANSPORT_LICENSE]: createFileList(currentUser?.licence_de_transport_picture),
    [FILE_TYPES.RIB]: createFileList(currentUser?.rib_picture),
  };

  // Generic file upload handler
  const handleFileUpload = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKUP_URL}upload`, formData);
      const updatedData = { ...pictures };
      updatedData.accountOverview[0][fieldName] = response?.data[0];
      setPictures(updatedData);
    } catch (error) {
      message.error("File upload failed");
    }
  };

  // Create upload props for each file type
  const createUploadProps = (fieldName) => ({
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileUpload(file, fieldName);
      return false;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: "picture",
    defaultFileList: fileLists[fieldName],
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" />,
    },
  });

  // Handle date changes
  const handleDateChange = (fieldName, newDate) => {
    setPictures(prev => ({
      ...prev,
      accountOverview: [{
        ...prev.accountOverview[0],
        [fieldName]: newDate,
      }],
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: currentUser?.id, user: pictures }));
  };

  return (
    <FormContainer>
      <Formulaire onSubmit={handleUpdate}>
        {/* Document Upload Sections */}
        {/* <DISP>
          <UploadSection 
            fieldName={FILE_TYPES.CIN_RECTO}
            label="Pièce d'identité recto"
            uploadProps={createUploadProps(FILE_TYPES.CIN_RECTO)}
            pictures={pictures}
          />
          <UploadSection 
            fieldName={FILE_TYPES.CIN_VERSO}
            label="Pièce d'identité Verso"
            uploadProps={createUploadProps(FILE_TYPES.CIN_VERSO)}
            pictures={pictures}
          />
        </DISP>

        <DISP>
          <UploadSection 
            fieldName={FILE_TYPES.KABIS}
            label="Photo Kbis"
            uploadProps={createUploadProps(FILE_TYPES.KABIS)}
            pictures={pictures}
          />
          <UploadSection 
            fieldName={FILE_TYPES.RC_PRO}
            label="Photo Assurance RC Pro"
            uploadProps={createUploadProps(FILE_TYPES.RC_PRO)}
            pictures={pictures}
          />
        </DISP>

        <DISP>
          <UploadSection 
            fieldName={FILE_TYPES.TRANSPORT_LICENSE}
            label="licence de transport"
            uploadProps={createUploadProps(FILE_TYPES.TRANSPORT_LICENSE)}
            pictures={pictures}
          />
          <UploadSection 
            fieldName={FILE_TYPES.RIB}
            label="RIB Société"
            uploadProps={createUploadProps(FILE_TYPES.RIB)}
            pictures={pictures}
          />
        </DISP>

        {/* Date Pickers */}
       {/* <DISP>
          <DatePickerSection
            label="Date expiration assurance rc pro"
            value={pictures?.accountOverview?.[0]?.assurance_rc_pro_date}
            onChange={(date) => handleDateChange("assurance_rc_pro_date", date)}
          />
          <DatePickerSection
            label="Date expiration licence de transport"
            value={pictures?.accountOverview?.[0]?.licence_de_transport_date}
            onChange={(date) => handleDateChange("licence_de_transport_date", date)}
            error={picturesErrors?.licence_de_transport_date}
          />
        </DISP> */}

        {/* Action Buttons */}
        <div className="validate_user_actions">
          <Button size="default" type="primary" onClick={() => dispatch(logout())}>
            Retourner à la page d'accueil
          </Button>
          {/* <SubmitButton type="submit">Valider</SubmitButton> */}
        </div>
      </Formulaire>
    </FormContainer>
  );
};

// Reusable Upload Section Component
const UploadSection = ({ fieldName, label, uploadProps, pictures }) => (
  <Container>
    <Upload
      fileList={pictures?.accountOverview?.[0]?.[fieldName] 
        ? [{ uid: 1, name: pictures.accountOverview[0][fieldName]?.name }] 
        : []}
      accept="image/png, image/jpeg"
      multiple={false}
      {...uploadProps}
      className="In"
    >
      <Button className="InBtn" icon={<UploadOutlined />}>
        Télécharger
      </Button>
    </Upload>
    <Label right={false}>{label}</Label>
  </Container>
);

// Reusable Date Picker Section Component
const DatePickerSection = ({ label, value, onChange, error }) => (
  <Container>
    <DatePicker value={value || null} onChange={onChange} />
    {error && <ErrorMessage>Obligatoire</ErrorMessage>}
    <Label right={false}>{label}</Label>
  </Container>
);

// Styled Components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  @media (max-width: 1050px) {
    margin-top: 5%;
    width: 95%;
  }
`;

const Formulaire = styled.form``;

const Container = styled.div`
  position: relative;
  margin-bottom: 16px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Label = styled.label`
  position: absolute;
  top: 10px;
  left: ${(props) => (props.right ? "120px" : "10px")};
  font-size: 13px;
  color: #999;
  pointer-events: none;
  transition: transform 0.3s, color 0.3s;
  transform: translateY(-100%) translateX(-10%) scale(0.75);
  color: #000;
  background-color: white;
  padding: 0px 12px;
  width: max-content;
  @media (max-width: 1050px) {
    color: white;
    background-color: #18365a;
  }
`;

const ErrorMessage = styled.span`
  color: #ff6961;
  padding: 6px 10px;
  max-width: 100%;
  font-size: 10px;
  overflow: hidden;
  align-self: flex-start;
`;

const DISP = styled.section`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  @media (max-width: 1050px) {
    flex-wrap: wrap;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 45px;
  font-size: 16px;
  padding: 10px;
  border: 1px solid #000;
  background-color: transparent;
  border-radius: 8px;
  transition: border-bottom-color 0.3s;
  @media (max-width: 1050px) {
    width: 100%;
    color: white;
    border-color: white;
    height: 60px;
  }
`;

export default Revalidate;