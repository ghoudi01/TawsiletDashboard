import React, { useState } from "react";
import { Form, Input, Modal, message, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  getusers,
  registerAdmin,
  getAdmins,
} from "../../redux/User/userSlice";
import propTypes from "prop-types";
import { Button } from "../../components/buttons/buttons";

const AddAdminModal = ({ visible, onCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialValues = {};

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        user_role: "admin",
        confirmed: true,
      };
      await dispatch(registerAdmin(payload)).unwrap();
      await dispatch(getAdmins({}));
      message.success("Administrateur ajouté avec succès !");
      onCancel();
      form.resetFields();
    } catch (error) {
      message.error("Erreur lors de l'ajout de l'administrateur");
    } finally {
      setLoading(false);
    }
  };

  const formItems = [
    { name: "firstName", label: "Nom d'admin", rules: [{ required: true }] },
    { name: "lastName", label: "Prénom d'admin", rules: [{ required: true }] },
    {
      name: "phoneNumber",
      label: "Numéro de téléphone",
      rules: [{ required: true }],
    },
    {
      name: "email",
      label: "Adresse e-mail",
      rules: [
        { required: true },
        { type: "email", message: "E-mail non valide" },
      ],
    },
    {
      name: "password",
      label: "Mot de passe",
      rules: [{ required: true }],
      inputType: "password",
    },
  ];

  return (
    <Modal
      title="Ajouter un admin"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          {formItems.map((item) => (
            <Col span={12} key={item.name}>
              <Form.Item name={item.name} label={item.label} rules={item.rules}>
                {item.inputType === "password" ? (
                  <Input.Password placeholder={`${item.label}...`} />
                ) : (
                  <Input placeholder={`${item.label}...`} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: "right", marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Sauvegarder
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

AddAdminModal.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddAdminModal;
