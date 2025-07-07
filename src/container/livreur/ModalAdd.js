import React, { useState } from "react";
import {
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
  Image,
  Alert,
  Input,
  Select,
} from "antd";
import {
  UploadOutlined,
  IdcardOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { registerDriver, getDriver } from "../../redux/User/userSlice";
import axios from "axios";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

function ModalAdd({ visible, onCancel }) {
  const dispatch = useDispatch();

  // Form data state (replacing useForm)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    region: "",
  });

  const [fileList, setFileList] = useState({
    cinFront: [],
    cinBack: [],
    licenceFront: [],
    licenceBack: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState(null);

  // Store confirmed form data when moving to confirmation step
  const [confirmedValues, setConfirmedValues] = useState(null);

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

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKUP_URL}upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data[0];
    } catch (error) {
      message.error(
        `Upload failed: ${error.response?.data?.message || error.message}`
      );
      throw error;
    }
  };

  const validateStep = (step) => {
    if (step === 0) {
      // Validate personal info fields
      const { firstName, lastName, email, phone, password, region } = formData;
      if (!firstName.trim()) return "First name is required";
      if (!lastName.trim()) return "Last name is required";
      if (!email.trim()) return "Email is required";
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return "Email is invalid";
      if (!phone.trim()) return "Phone number is required";
      if (!password) return "Password is required";
      if (password.length < 6) return "Password must be at least 6 characters";
      if (!region) return "Region is required";
    }
    if (step === 1) {
      // Validate files uploaded
      if (
        !fileList.cinFront[0] ||
        !fileList.cinBack[0] ||
        !fileList.licenceFront[0] ||
        !fileList.licenceBack[0]
      ) {
        return "Please upload all required documents";
      }
    }
    return null; // no error
  };

  const next = () => {
    const errorMsg = validateStep(currentStep);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError(null);

    if (currentStep === 1) {
      // When moving from documents step to confirmation, save confirmed values
      setConfirmedValues(formData);
    }

    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const onFinish = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate all data before submitting
      let errorMsg = validateStep(0);
      if (errorMsg) throw new Error(errorMsg);
      errorMsg = validateStep(1);
      if (errorMsg) throw new Error(errorMsg);

      // Upload files
      const [cinFront, cinBack, licenceFront, licenceBack] = await Promise.all([
        uploadFile(fileList.cinFront[0].originFileObj),
        uploadFile(fileList.cinBack[0].originFileObj),
        uploadFile(fileList.licenceFront[0].originFileObj),
        uploadFile(fileList.licenceBack[0].originFileObj),
      ]);

      const driverData = {
        ...formData,
        user_role: "driver",
        validation: {
          description: null,
          validation_state: "waiting",
        },
        cinFront,
        cinBack,
        licenceFront,
        licenceBack,
        username: formData.email,
        confirmed: true,
        phoneNumber:formData.phone
     //   username:formData.lastName+" "+ formData.firstName,
      };

      await dispatch(registerDriver(driverData)).unwrap();
      await dispatch(getDriver({}));

      message.success("Driver created successfully");
      handleCancel();
    } catch (error) {
      setError(error.message || "An error occurred while creating the driver");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const steps = [
    {
      title: "Informations",
      icon: <SolutionOutlined />,
      content: (
        <PersonalInfoForm data={formData} onChange={handleInputChange} />
      ),
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
      content: (
        <ConfirmationStep values={confirmedValues} fileList={fileList} />
      ),
    },
  ];

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      region: "",
    });
    setFileList({
      cinFront: [],
      cinBack: [],
      licenceFront: [],
      licenceBack: [],
    });
    setCurrentStep(0);
    setError(null);
    setConfirmedValues(null);
    onCancel();
  };

  return (
    <Modal
      title={<Title level={3}>Create New Driver</Title>}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
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

      <div style={{ minHeight: 400 }}>{steps[currentStep].content}</div>

      <Divider />
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

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="75%"
      >
        <Image alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
}

function PersonalInfoForm({ data, onChange }) {
  const regions = [
    "Ariana",
    "Beja",
    "Ben Arous",
    "Bizerte",
    "Gabes",
    "Gafsa",
    "Jendouba",
    "Kairouan",
    "Kasserine",
    "Kebili",
    "Kef",
    "Mahdia",
    "Manouba",
    "Medenine",
    "Monastir",
    "Nabeul",
    "Sfax",
    "Sidi Bouzid",
    "Siliana",
    "Sousse",
    "Tataouine",
    "Tozeur",
    "Tunis",
    "Zaghouan",
  ];

  const handleSelectChange = (value) => {
    onChange({ target: { name: "region", value } });
  };

  return (
    <>
      <InputWithLabel
        label="First Name"
        name="firstName"
        value={data.firstName}
        onChange={onChange}
        placeholder="First Name"
        prefix={<UserOutlined />}
      />
      <InputWithLabel
        label="Last Name"
        name="lastName"
        value={data.lastName}
        onChange={onChange}
        placeholder="Last Name"
        prefix={<UserOutlined />}
      />
      <InputWithLabel
        label="Email"
        name="email"
        value={data.email}
        onChange={onChange}
        placeholder="Email"
        prefix={<MailOutlined />}
        type="email"
      />
      <InputWithLabel
        label="Phone Number"
        name="phone"
        value={data.phone}
        onChange={onChange}
        placeholder="Phone Number"
        prefix={<PhoneOutlined />}
      />
      <SelectWithLabel
        label="Region"
        value={data.region}
        onChange={handleSelectChange}
        placeholder="Select Region"
        options={regions.map(region => ({ value: region, label: region }))}
      />
      <InputWithLabel
        label="Password"
        name="password"
        value={data.password}
        onChange={onChange}
        placeholder="Password"
        type="password"
      />
    </>
  );
}

function DocumentUpload({ fileList, setFileList, handlePreview }) {
  const uploadProps = (field) => ({
    listType: "picture-card",
    fileList: fileList[field],
    onPreview: handlePreview,
    beforeUpload: (file) => {
      setFileList((prev) => ({
        ...prev,
        [field]: [{ ...file, originFileObj: file }],
      }));
      return false; // disable auto upload
    },
    onRemove: () => {
      setFileList((prev) => ({
        ...prev,
        [field]: [],
      }));
    },
  });

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="CIN Front" bordered={false}>
          <Upload {...uploadProps("cinFront")}>
            {fileList.cinFront.length === 0 && <UploadOutlined />}
          </Upload>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="CIN Back" bordered={false}>
          <Upload {...uploadProps("cinBack")}>
            {fileList.cinBack.length === 0 && <UploadOutlined />}
          </Upload>
        </Card>
      </Col>
      <Col span={12} style={{ marginTop: 16 }}>
        <Card title="Licence Front" bordered={false}>
          <Upload {...uploadProps("licenceFront")}>
            {fileList.licenceFront.length === 0 && <UploadOutlined />}
          </Upload>
        </Card>
      </Col>
      <Col span={12} style={{ marginTop: 16 }}>
        <Card title="Licence Back" bordered={false}>
          <Upload {...uploadProps("licenceBack")}>
            {fileList.licenceBack.length === 0 && <UploadOutlined />}
          </Upload>
        </Card>
      </Col>
    </Row>
  );
}

function ConfirmationStep({ values, fileList }) {
  if (!values) {
    return <Text type="secondary">No data to display yet.</Text>;
  }

  return (
    <div>
      <Title level={4}>Please confirm your information</Title>
      <p>
        <strong>Name:</strong> {values.firstName} {values.lastName}
      </p>
      <p>
        <strong>Email:</strong> {values.email}
      </p>
      <p>
        <strong>Phone:</strong> {values.phone}
      </p>
      <p>
        <strong>Region:</strong> {values.region}
      </p>
      <Divider />
      <Title level={5}>Documents</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Text>CIN Front:</Text>
          {fileList.cinFront[0] && (
            <Image
              width={100}
              src={fileList.cinFront[0].thumbUrl || ""}
              alt="CIN Front"
              style={{ marginTop: 8 }}
            />
          )}
        </Col>
        <Col span={12}>
          <Text>CIN Back:</Text>
          {fileList.cinBack[0] && (
            <Image
              width={100}
              src={fileList.cinBack[0].thumbUrl || ""}
              alt="CIN Back"
              style={{ marginTop: 8 }}
            />
          )}
        </Col>
        <Col span={12} style={{ marginTop: 16 }}>
          <Text>Licence Front:</Text>
          {fileList.licenceFront[0] && (
            <Image
              width={100}
              src={fileList.licenceFront[0].thumbUrl || ""}
              alt="Licence Front"
              style={{ marginTop: 8 }}
            />
          )}
        </Col>
        <Col span={12} style={{ marginTop: 16 }}>
          <Text>Licence Back:</Text>
          {fileList.licenceBack[0] && (
            <Image
              width={100}
              src={fileList.licenceBack[0].thumbUrl || ""}
              alt="Licence Back"
              style={{ marginTop: 8 }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
}

function InputWithLabel({ label, name, value, onChange, placeholder, prefix, type = "text" }) {
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={name} style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
        {label}
      </label>
      {isPassword ? (
        <Input.Password
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          prefix={prefix}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      ) : (
        <Input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          prefix={prefix}
          type={type}
        />
      )}
    </div>
  );
}

function SelectWithLabel({ label, value, onChange, placeholder, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>
        {label}
      </label>
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        options={options}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default ModalAdd;
