import React, { useState } from "react";
import {
  Image,
  Tag,
  Button,
  Popconfirm,
  Tooltip,
  Badge,
  Progress,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FilePdfOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { validateFileType } from "../../../utility/fileUtils";

const FilePreview = ({ label, file, onPreview, expirationDate }) => {
  const [loading, setLoading] = useState(false);
  const isPDF = validateFileType(file?.pictureDetails?.url, "pdf");
  const isValid = file?.isVAlid;
  const isExpired = expirationDate && new Date(expirationDate) < new Date();

  const onValidate = () => {

  };

  const handleValidate = async (valid) => {
    setLoading(true);
    try {
      await onValidate(label, valid);
      message.success(
        `Document ${valid ? "approved" : "rejected"} successfully`
      );
    } catch (error) {
      message.error("Validation failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!file) return null;

    if (isValid === true) {
      return (
        <StatusBadge
          status="success"
          text="Valid"
          icon={<CheckCircleOutlined />}
        />
      );
    }
    if (isValid === false) {
      return (
        <StatusBadge
          status="error"
          text="Invalid"
          icon={<CloseCircleOutlined />}
        />
      );
    }
    return (
      <StatusBadge
        status="warning"
        text="Pending"
        icon={<QuestionCircleOutlined />}
      />
    );
  };

  const renderPreview = () => {
    if (!file) {
      return (
        <EmptyFile>
          <div>No document</div>
          <Tag color="default">Missing</Tag>
        </EmptyFile>
      );
    }

    if (isPDF) {
      return (
        <PdfContainer onClick={() => onPreview(file?.pictureDetails?.url)}>
          <FilePdfOutlined style={{ fontSize: 48, color: "#ff4d4f" }} />
          <PdfLabel>View PDF</PdfLabel>
        </PdfContainer>
      );
    }

    return (
      <ImageContainer>
        <StyledImage
          width="100%"
          src={
            file?.pictureDetails?.url ||
            "https://www.eprofessionnel.com/media/catalog/product/placeholder/default/image-non-disponible.jpg"
          }
          alt={label}
          preview={{
            mask: (
              <Tooltip title="Click to view">
                <EyeOutlined style={{ color: "#fff", fontSize: 20 }} />
              </Tooltip>
            ),
          }}
        />
      </ImageContainer>
    );
  };

  return (
    <FilePreviewContainer>
      <FileHeader>
        <FileTitle>{label.replace(/_/g, " ")}</FileTitle>
        {getStatusBadge()}
      </FileHeader>

      <FileContent>
        {renderPreview()}

        {expirationDate && (
          <ExpirationDate status={isExpired ? "error" : "success"}>
            Expires: {new Date(expirationDate).toLocaleDateString()}
            {isExpired && (
              <Tag color="red" style={{ marginLeft: 8 }}>
                EXPIRED
              </Tag>
            )}
          </ExpirationDate>
        )}

        {file?.pictureDetails?.size && (
          <FileMeta>
            <Progress
              percent={100}
              size="small"
              status={isExpired ? "exception" : isValid ? "success" : "normal"}
              showInfo={false}
            />
            <div>Size: {file.pictureDetails.size.toFixed(1)} KB</div>
          </FileMeta>
        )}
      </FileContent>

      {file && (
        <FileActions>
          <Tooltip title="Replace document">
            <ActionButton
              icon={<EditOutlined />}
              // onClick={() => onPreview(file?.pictureDetails?.url)}
            />
          </Tooltip>

          <ButtonGroup>
            <Popconfirm
              title="Are you sure this document is valid?"
              onConfirm={() => handleValidate(true)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Validate document">
                <ActionButton
                  type={isValid === true ? "primary" : "default"}
                  icon={<CheckCircleOutlined />}
                  loading={loading}
                />
              </Tooltip>
            </Popconfirm>

            <Popconfirm
              title="Are you sure this document is invalid?"
              onConfirm={() => handleValidate(false)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Reject document">
                <ActionButton
                  danger={isValid === false}
                  type={isValid === false ? "primary" : "default"}
                  icon={<CloseCircleOutlined />}
                  loading={loading}
                />
              </Tooltip>
            </Popconfirm>
          </ButtonGroup>
        </FileActions>
      )}
    </FilePreviewContainer>
  );
};

// Styled Components
const FilePreviewContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d9d9d9;
  }
`;

const FileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const FileTitle = styled.h4`
  margin: 0;
  font-size: 16px;
  text-transform: capitalize;
  color: #333;
`;

const StatusBadge = styled(({ status, text, icon, ...props }) => (
  <div {...props}>
    <Badge status={status} />
    <span style={{ marginLeft: 8 }}>{text}</span>
    {React.cloneElement(icon, { style: { marginLeft: 4 } })}
  </div>
))`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: ${(props) =>
    props.status === "success"
      ? "#52c41a"
      : props.status === "error"
      ? "#ff4d4f"
      : "#faad14"};
`;

const FileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled(Image)`
  .ant-image-img {
    object-fit: contain;
    max-height: 180px;
  }
`;

const PdfContainer = styled.div`
  border: 1px dashed #ff4d4f;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  margin-bottom: 12px;
  transition: all 0.3s;

  &:hover {
    background-color: #fff2f0;
  }
`;

const PdfLabel = styled.div`
  margin-top: 8px;
  color: #ff4d4f;
  font-weight: 500;
`;

const EmptyFile = styled.div`
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-bottom: 12px;
  color: #bfbfbf;
`;

const ExpirationDate = styled.div`
  font-size: 12px;
  color: ${(props) => (props.status === "error" ? "#ff4d4f" : "#52c41a")};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const FileMeta = styled.div`
  font-size: 11px;
  color: #8c8c8c;
  margin-top: auto;
`;

const FileActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
`;

const ActionButton = styled(Button)`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export default FilePreview;
