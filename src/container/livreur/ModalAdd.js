import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  Steps,
  Upload,
  message,
  Typography,
  Divider,
  Card,
  Row,
  Col,
  Descriptions,
  Image,
  Space,
  Alert,
} from "antd";
import {
  UploadOutlined,
  IdcardOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  FileImageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  registerDriver,
  getDriver,
} from "../../redux/User/userSlice";
import axios from "axios";
import propTypes from "prop-types";
import styled from "styled-components";

const { Title, Text } = Typography;
const { Step } = Steps;

function ModalAdd({ visible, onCancel }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
 const currentId =0
  //  useSelector(
  //   (state) => state?.user?.currentUser?.companies[0]?.id
  // );
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState({
    cinFront: [],
    cinBack: [],
    license: [],
  });
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState(null);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      try {
        file.preview = await getBase64(file.originFileObj);
      } catch (error) {
        message.error("Failed to load image preview");
        return;
      }
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const steps = [
    {
      title: "Informations",
      icon: <SolutionOutlined />,
      content: <PersonalInfoForm form={form} />,
    },
    {
      title: "Documents",
      icon: <IdcardOutlined />,
      content: (
        <DocumentUpload
          fileList={fileList}
          setFileList={setFileList}
          handlePreview={handlePreview}
        />
      ),
    },
    {
      title: "Confirmation",
      icon: <CheckCircleOutlined />,
      content: <ConfirmationStep form={form} fileList={fileList} />,
    },
  ];

  const handleCancel = () => {
    form.resetFields();
    setFileList({
      cinFront: [],
      cinBack: [],
      license: [],
    });
    setCurrentStep(0);
    setError(null);
    onCancel();
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadFile = async (file, fieldName) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data[0];
    } catch (error) {
      message.error(
        `Upload failed: ${error.response?.data?.message || error.message}`
      );
      throw error;
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const values=form.getFieldValue() 
      // Check if all documents are uploaded
      if (
        !fileList.cinFront[0] ||
        !fileList.cinBack[0] ||
        !fileList.license[0]
      ) {
        throw new Error("Please upload all required documents");
      }

      // Upload all files
      const [cinFront, cinBack, license] = await Promise.all([
        uploadFile(fileList.cinFront[0].originFileObj, "cinFront"),
        uploadFile(fileList.cinBack[0].originFileObj, "cinBack"),
        uploadFile(fileList.license[0].originFileObj, "license"),
      ]);

      const driverData = {
        ...values,
        user_role: "driver",
        driver_company: currentId,
        firstName: values.firstName,
        lastName: values.lastName,
        adress: values.adress,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        cin: values.cin,
        licenceNumber: values.licenceNumber,
        licenceClass: values.licenceClass,
        validation: {
          description: null,
          validation_state: "waiting",
        },
        cinPictureFront: cinFront,
        cinPictureBack: cinBack,
        licencePicture: license,
        username: values.email,
      };


      await dispatch(registerDriver(driverData)).unwrap();
      await dispatch(getDriver({})); 

      message.success("Driver created successfully");
      handleCancel();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An error occurred while creating the driver");
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    try {
      await form.validateFields();
      setError(null);
      setCurrentStep(currentStep + 1);
    } catch (err) {
      setError("Please fill in all required fields correctly");
    }
  };

  const prev = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: "0" }}>
          Create New Driver
        </Title>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      // centered
      destroyOnClose
      style={{ top: 20 }}
    >
      {/* <Divider style={{ margin: '16px 0' }} /> */}

      <Steps
        current={currentStep}
        style={{ margin: "auto", paddingBottom: 24 }}
      >
        {steps.map((item) => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div style={{ minHeight: 400 }}>{steps[currentStep].content}</div>

        <Divider style={{ margin: "24px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {currentStep > 0 && (
            <Button onClick={prev} style={{ width: 120 }}>
              Back
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={next}
              style={{ width: 120, marginLeft: "auto" }}
            >
              Next
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={onFinish}
              loading={loading}
              style={{ width: 120, marginLeft: "auto" }}
            >
              Confirm
            </Button>
          )}
        </div>
      </Form>

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        // centered
        width="75%"
      >
        <Image alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
}

// Sub-components for each step
const PersonalInfoForm = ({ form }) => {
  return (
    <>
      <Title level={5} style={{ marginBottom: 24 }}>
        Personal Information
      </Title>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input
              placeholder="Driver's first name"
              prefix={<UserOutlined />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input placeholder="Driver's last name" prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter phone number" },
              { pattern: /^[0-9]+$/, message: "Invalid number" },
            ]}
          >
            <FormInput
              placeholder="Phone number"
              // prefix={<PhoneOutlined  className="reg_icon" />}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input placeholder="Email address" prefix={<MailOutlined />} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="cin"
            label="ID Number"
            rules={[{ required: true, message: "Please enter ID number" }]}
          >
            <Input placeholder="ID number" prefix={<IdcardOutlined />} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="licenceNumber"
            label="License Number"
            rules={[{ required: true, message: "Please enter license number" }]}
          >
            <Input placeholder="License number" prefix={<IdcardOutlined />} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="licenceClass"
            label="License Class"
            rules={[{ required: true, message: "Please enter license class" }]}
          >
            <Input placeholder="License class" prefix={<IdcardOutlined />} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="adress"
        label="Address"
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <Input.TextArea rows={2} placeholder="Full address" />
      </Form.Item>
    </>
  );
};
const DocumentUpload = ({ fileList, setFileList, handlePreview }) => {
  const uploadProps = (field) => ({
    accept: "image/*",
    fileList: fileList[field],
    listType: "picture-card",
    beforeUpload: (file) => {
      if (file.size > 5 * 1024 * 1024) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      if (file.type.indexOf("image/") === -1) {
        message.error("You can only upload images!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: (info) => {
      if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
        return;
      }
      setFileList((prev) => ({
        ...prev,
        [field]: info.fileList.slice(-1), // Only keep the last uploaded file
      }));
    },
    onRemove: () => {
      setFileList((prev) => ({
        ...prev,
        [field]: [],
      }));
    },
    onPreview: handlePreview,
  });

  return (
    <>
      <Title level={5} style={{ marginBottom: 24 }}>
        Required Documents
      </Title>
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        Please upload clear images of the following documents (Max 5MB each)
      </Text>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ID Card (Front)"
            bordered={false}
            size="small"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            <Upload {...uploadProps("cinFront")}>
              {fileList.cinFront.length === 0 && (
                <div style={{ padding: "16px 0" }}>
                  <UploadOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                  <div style={{ marginTop: 8 }}>Click to Upload</div>
                </div>
              )}
            </Upload>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            title="ID Card (Back)"
            bordered={false}
            size="small"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            <Upload {...uploadProps("cinBack")}>
              {fileList.cinBack.length === 0 && (
                <div style={{ padding: "16px 0" }}>
                  <UploadOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                  <div style={{ marginTop: 8 }}>Click to Upload</div>
                </div>
              )}
            </Upload>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            title="Driver License"
            bordered={false}
            size="small"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            <Upload {...uploadProps("license")}>
              {fileList.license.length === 0 && (
                <div style={{ padding: "16px 0" }}>
                  <UploadOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                  <div style={{ marginTop: 8 }}>Click to Upload</div>
                </div>
              )}
            </Upload>
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          Note: Upload clear images where all details are readable. Supported
          formats: JPG, PNG.
        </Text>
      </div>
    </>
  );
};

const ConfirmationStep = ({ form, fileList }) => {
  const formValues = form.getFieldValue();
  return (
    <div style={{ padding: "16px 0" }}>
      <Title level={5} style={{ marginBottom: 24, textAlign: "center" }}>
        Please confirm the information below
      </Title>

      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Full Name">
            <Text strong>
              {formValues?.firstName} {formValues?.lastName}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            <Text strong>{formValues?.phoneNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Text strong>{formValues?.email}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="ID Number">
            <Text strong>{formValues?.cin}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="License Number">
            <Text strong>{formValues?.licenceNumber}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="License Class">
            <Text strong>{formValues?.licenceClass}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            <Text strong>{formValues?.adress}</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Title level={5} style={{ margin: "24px 0 16px", textAlign: "center" }}>
        Uploaded Documents Preview
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ID Front"
            size="small"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            {fileList.cinFront[0] ? (
              <Image
                src={URL.createObjectURL(fileList.cinFront[0].originFileObj)}
                alt="ID Front"
                style={{ width: "100%", borderRadius: 4 }}
                preview={false}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 16 }}>
                <FileImageOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />
                <div style={{ color: "#ff4d4f" }}>No image uploaded</div>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="ID Back"
            size="small"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            {fileList.cinBack[0] ? (
              <Image
                src={URL.createObjectURL(fileList.cinBack[0].originFileObj)}
                alt="ID Back"
                style={{ width: "100%", borderRadius: 4 }}
                preview={false}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 16 }}>
                <FileImageOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />
                <div style={{ color: "#ff4d4f" }}>No image uploaded</div>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            title="Driver License"
            size="small"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            {fileList.license[0] ? (
              <Image
                src={URL.createObjectURL(fileList.license[0].originFileObj)}
                alt="License"
                style={{ width: "100%", borderRadius: 4 }}
                preview={false}
              />
            ) : (
              <div style={{ textAlign: "center", padding: 16 }}>
                <FileImageOutlined style={{ fontSize: 32, color: "#ff4d4f" }} />
                <div style={{ color: "#ff4d4f" }}>No image uploaded</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

ModalAdd.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ModalAdd;

const FormInput = styled(Input)`
  .reg_icon {
    svg {
      font-size: 10px !important;
    }
  }
`;
