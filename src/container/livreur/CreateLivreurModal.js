import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Typography, Divider, Upload, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { getusers, registerDriver } from "../../redux/User/userSlice";
import propTypes from "prop-types";

const { Title, Text } = Typography;

function CreateLivreurModal({ visible, onCancel }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const currentId = useSelector((state) => state?.user?.currentUser?.id);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      dispatch(getusers());
      form.resetFields();
    }
  }, [visible, dispatch, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = (values) => {
    setConfirmLoading(true);
    

    const driverData = {
      ...values,
      user_role: "driver",
      firstName: values.firstName,
      lastName: values.lastName,
      adress: values.adress,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
      cin: values.cin,
      licenceNumber: values.licenceNumber,
      licenceClass: values.licenceClass,
       accountOverview: [{
        __component: "section.driver",
        firstName: values.firstName,
        lastName: values.lastName,
        cin: values.cin,
        licenceNumber: values.licenceNumber,
        licenceClass: values.licenceClass,
       
        adress: values.adress
      }]
    };

    dispatch(registerDriver(driverData))
      .unwrap()
      .then(() => {
        message.success('Livreur créé avec succès');
        handleCancel();
      })
      .catch((error) => {
        message.error(`Erreur: ${error.message}`);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Vous ne pouvez télécharger que des fichiers image!');
      }
      return isImage || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} téléchargé avec succès`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} échec du téléchargement.`);
      }
    },
  };

  return (
    <Modal
      title={<Title level={4} style={{ margin: 0 }}>Créer un nouveau livreur</Title>}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <Divider style={{ margin: '16px 0' }} />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Left Column */}
          <div>
            <Form.Item
              label="Nom"
              name="firstName"
              rules={[{ required: true, message: 'Veuillez saisir le nom' }]}
            >
              <Input placeholder="Nom du livreur" />
            </Form.Item>

            <Form.Item
              label="Prénom"
              name="lastName"
              rules={[{ required: true, message: 'Veuillez saisir le prénom' }]}
            >
              <Input placeholder="Prénom du livreur" />
            </Form.Item>

            <Form.Item
              label="Numéro de téléphone"
              name="phoneNumber"
              rules={[
                { required: true, message: 'Veuillez saisir le numéro' },
                { pattern: /^[0-9]+$/, message: 'Numéro invalide' }
              ]}
            >
              <Input placeholder="Numéro de téléphone" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Veuillez saisir l\'email' },
                { type: 'email', message: 'Email invalide' }
              ]}
            >
              <Input placeholder="Adresse email" />
            </Form.Item>
          </div>

          {/* Right Column */}
          <div>
            <Form.Item
              label="Numéro d'identité (CIN)"
              name="cin"
              rules={[{ required: true, message: 'Veuillez saisir le numéro CIN' }]}
            >
              <Input placeholder="Numéro CIN" />
            </Form.Item>

            <Form.Item
              label="Numéro de permis"
              name="licenceNumber"
              rules={[{ required: true, message: 'Veuillez saisir le numéro de permis' }]}
            >
              <Input placeholder="Numéro de permis" />
            </Form.Item>

            <Form.Item
              label="Classe de permis"
              name="licenceClass"
              rules={[{ required: true, message: 'Veuillez saisir la classe de permis' }]}
            >
              <Input placeholder="Classe de permis" />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[
                { required: true, message: 'Veuillez saisir le mot de passe' },
                { min: 6, message: 'Minimum 6 caractères' }
              ]}
            >
              <Input.Password
                placeholder="Mot de passe"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          </div>
        </div>

        {/* Full Width Fields */}
        <Form.Item
          label="Adresse"
          name="adress"
          rules={[{ required: true, message: 'Veuillez saisir l\'adresse' }]}
        >
          <Input.TextArea rows={2} placeholder="Adresse complète" />
        </Form.Item>

        <Form.Item label="Photo de profil">
          <Upload {...uploadProps} accept="image/*">
            <Button icon={<UploadOutlined />}>Télécharger photo</Button>
          </Upload>
        </Form.Item>

        <Divider style={{ margin: '24px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <Button onClick={handleCancel} style={{ width: '120px' }}>
            Annuler
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={confirmLoading}
            style={{ width: '120px' }}
          >
            Enregistrer
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

CreateLivreurModal.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateLivreurModal;