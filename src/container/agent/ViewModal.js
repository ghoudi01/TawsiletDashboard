import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";
import { getDriver, updateUser } from "../../redux/User/userSlice";
import { useDispatch } from "react-redux";

const UpdateUserModal = ({ open, onClose, data, refresh }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const dispatch = useDispatch();

  // Set initial values when modal opens
  useEffect(() => {
    if (data) {
      form.setFieldsValue({ ...data });
    }
  }, [data, form]);

  // Open modal with clicked image
  const handleImageClick = (url) => {
    setModalImageUrl(url);
    setModalVisible(true);
  };

  // Close image preview modal
  const handleModalClose = () => {
    setModalVisible(false);
    setModalImageUrl(null);
  };

  const handleFinish = async (values) => {
   
    dispatch(updateUser({ id: data.id, user: values }));
    dispatch(getDriver());
  };

  return (
    <>
      <Modal
        title="Modifier l'utilisateur"
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {data ? (
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item name="firstName" label="Prénom">
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Nom">
              <Input />
            </Form.Item>
            <Form.Item name="username" label="Nom d'utilisateur">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input type="email" disabled />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Téléphone">
              <Input disabled />
            </Form.Item>

            <Form.Item name="isActive" label="Actif" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name="isFree" label="Libre" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item
              name="confirmed"
              label="Confirmé"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item name="blocked" label="Bloqué" valuePropName="checked">
              <Switch />
            </Form.Item>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Form.Item label="licenceBack">
                <img
                  src={data?.licenceBack?.url}
                  alt="Licence Back"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(data?.licenceBack?.url)}
                />
              </Form.Item>

              <Form.Item label="licenceFront">
                <img
                  src={data?.licenceFront?.url}
                  alt="Licence Front"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(data?.licenceFront?.url)}
                />
              </Form.Item>

              <Form.Item label="cinFront">
                <img
                  src={data?.cinFront?.url}
                  alt="CIN Front"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(data?.cinFront?.url)}
                />
              </Form.Item>

              <Form.Item label="cinBack">
                <img
                  src={data?.cinBack?.url}
                  alt="CIN Back"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(data?.cinBack?.url)}
                />
              </Form.Item>

              <Form.Item label="assurancePictures">
                <img
                  src={data?.vehicule?.assurancePictures?.url}
                  alt="Assurance"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(data?.vehicule?.assurancePictures?.url)
                  }
                />
              </Form.Item>

              <Form.Item label="grayCardPictures">
                <img
                  src={data?.vehicule?.grayCardPictures?.url}
                  alt="Gray Card Front"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(data?.vehicule?.grayCardPictures?.url)
                  }
                />
              </Form.Item>

             

              <Form.Item label="vehiculePictureface1">
                <img
                  src={data?.vehicule?.vehiculePictureface1?.url}
                  alt="Vehicle Face 1"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(data?.vehicule?.vehiculePictureface1?.url)
                  }
                />
              </Form.Item>

              <Form.Item label="vehiculePictureface2">
                <img
                  src={data?.vehicule?.vehiculePictureface2?.url}
                  alt="Vehicle Face 2"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(data?.vehicule?.vehiculePictureface2?.url)
                  }
                />
              </Form.Item>

              <Form.Item label="vehiculePictureface3">
                <img
                  src={data?.vehicule?.vehiculePictureface3?.url}
                  alt="Vehicle Face 3"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(data?.vehicule?.vehiculePictureface3?.url)
                  }
                />
              </Form.Item>

              <Form.Item label="vehiculePictureface4">
                <img
                  src={data?.vehicule?.vehiculePictureface4?.url}
                  alt="Vehicle Face 4"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleImageClick(data?.vehicule?.vehiculePictureface4?.url)
                  }
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sauvegarder
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <p>Aucune donnée trouvée.</p>
        )}
      </Modal>

      {/* Modal for image preview */}
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={handleModalClose}
        centered
        bodyStyle={{ padding: 0 }}
      >
        <img
          src={modalImageUrl}
          alt="Preview"
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </Modal>
    </>
  );
};

export default UpdateUserModal;
