import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, Divider, Col, Row, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  getusers,
  updateUser,
} from "../../../redux/User/userSlice";
import UploadNew from "../../../uploadMini/UploadNew";

function ChangeDriverInfo({ visible, onCancel, record }) {
  const dispatch = useDispatch();
  const toUpdate = useSelector((state) => state?.user?.getted);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    region: "",
  });

  const [fileList, setFileList] = useState({
    cinFront: [],
    cinBack: [],
    licenceFront: [],
    licenceBack: [],
  });

  const [inputErrors, setInputErrors] = useState({});

  const regionOptions = [
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
    "global",
  ];

  useEffect(() => {
    if (record) {
      dispatch(getUserById(record));
    }
  }, [record, dispatch]);

  useEffect(() => {
    if (toUpdate) {
      setFormData({
        firstName: toUpdate.firstName || "",
        lastName: toUpdate.lastName || "",
        email: toUpdate.email || "",
        phoneNumber: toUpdate.phoneNumber || "",
        password: "", // password not fetched for security
        region: toUpdate.region || "",
      });

      setFileList({
        cinFront: toUpdate.cinPictureFront
          ? [
              {
                url: toUpdate.cinPictureFront.url,
                name: toUpdate.cinPictureFront.name,
                uid: "-1",
                status: "done",
              },
            ]
          : [],
        cinBack: toUpdate.cinPictureBack
          ? [
              {
                url: toUpdate.cinPictureBack.url,
                name: toUpdate.cinPictureBack.name,
                uid: "-1",
                status: "done",
              },
            ]
          : [],
        licenceFront: toUpdate.licencePicture
          ? [
              {
                url: toUpdate.licencePicture.url,
                name: toUpdate.licencePicture.name,
                uid: "-1",
                status: "done",
              },
            ]
          : [],
        licenceBack: [],
      });
    }
  }, [toUpdate]);

  // Basic validation
  const validate = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First name required";
    if (!formData.lastName) errors.lastName = "Last name required";
    if (!formData.email) errors.email = "Email required";
    if (!formData.phoneNumber) errors.phoneNumber = "Phone required";
    if (!formData.region) errors.region = "Region required";
    if (formData.password && formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleUploadChange = (key, files) => {
    setFileList((prev) => ({
      ...prev,
      [key]: files,
    }));
  };

  const handleSave = () => {
    const errors = validate();
    if (Object.keys(errors).length) {
      setInputErrors(errors);
      return;
    }
    setInputErrors({});

    // Build the object with only changed fields
    const updatedFields = {};

    // Compare formData fields
    Object.keys(formData).forEach((key) => {
      if (key === "password") {
        if (formData.password && formData.password.length > 0) {
          updatedFields.password = formData.password;
        }
      } else if (formData[key] !== (toUpdate?.[key] || "")) {
        updatedFields[key] = formData[key];
      }
    });

    // Compare fileList fields
    const fileFields = [
      { key: "cinFront", toUpdateKey: "cinPictureFront" },
      { key: "cinBack", toUpdateKey: "cinPictureBack" },
      { key: "licenceFront", toUpdateKey: "licencePicture" },
      { key: "licenceBack", toUpdateKey: "licencePictureBack" },
    ];

    fileFields.forEach(({ key, toUpdateKey }) => {
      const newFile = fileList[key]?.[0] || null;
      const oldFile = toUpdate?.[toUpdateKey] || null;
      if (
        (newFile && !oldFile) ||
        (!newFile && oldFile) ||
        (newFile && oldFile && newFile.url !== oldFile.url)
      ) {
        updatedFields[key] = newFile;
      }
    });

    // Always include these if your backend requires them
    updatedFields.user_role = "driver";
    updatedFields.validation = {
      description: null,
      validation_state: "waiting",
    };
    updatedFields.username = formData.lastName + " " + formData.firstName;
    updatedFields.confirmed = true;

    dispatch(updateUser({ id: record, user: updatedFields })).then(() => {
      dispatch(getusers());
      message.success("Driver info updated successfully!");
      onCancel();
    });
  };

  return (
    <Modal
      title="Changer informations de Chauffeur"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Form layout="vertical">
        <Form.Item
          label="First Name"
          required
          validateStatus={inputErrors.firstName ? "error" : ""}
          help={inputErrors.firstName}
        >
          <Input
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="Enter first name"
          />
        </Form.Item>

        <Form.Item
          label="Last Name"
          required
          validateStatus={inputErrors.lastName ? "error" : ""}
          help={inputErrors.lastName}
        >
          <Input
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Enter last name"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          required
          validateStatus={inputErrors.email ? "error" : ""}
          help={inputErrors.email}
        >
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          required
          validateStatus={inputErrors.phoneNumber ? "error" : ""}
          help={inputErrors.phoneNumber}
        >
          <Input
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            placeholder="Enter phone number"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={inputErrors.password ? "error" : ""}
          help={inputErrors.password}
        >
          <Input.Password
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="New password"
          />
        </Form.Item>

        <Form.Item
          label="Region"
          required
          validateStatus={inputErrors.region ? "error" : ""}
          help={inputErrors.region}
        >
          <select
            value={formData.region}
            onChange={e => setFormData({ ...formData, region: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: 4, borderColor: inputErrors.region ? '#ff4d4f' : undefined }}
          >
            <option value="">Select region</option>
            {regionOptions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </Form.Item>

        <Divider>Identity Documents</Divider>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="CIN Front">
              <UploadNew
                dataToShow={fileList.cinFront}
                setFunction={(files) =>
                  handleUploadChange("cinFront", files.data)
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="CIN Back">
              <UploadNew
                dataToShow={fileList.cinBack}
                setFunction={(files) =>
                  handleUploadChange("cinBack", files.data)
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="Licence Front">
              <UploadNew
                dataToShow={fileList.licenceFront}
                setFunction={(files) =>
                  handleUploadChange("licenceFront", files.data)
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Licence Back">
              <UploadNew
                dataToShow={fileList.licenceBack}
                setFunction={(files) =>
                  handleUploadChange("licenceBack", files.data)
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button onClick={onCancel} style={{ marginRight: 12 }}>
            Annuler
          </Button>
          <Button type="primary" onClick={handleSave}>
            Enregistré
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangeDriverInfo;
