import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button, message } from "antd";
import axios from "axios"; // or your preferred HTTP client
import { getDriver, updateUser } from "../../redux/User/userSlice";
import { useDispatch } from "react-redux";

const UpdateUserModal = ({ open, onClose, data, refresh }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // Set initial values when modal opens
  useEffect(() => {
    if (data) {
      form.setFieldsValue({ ...data });
    }
  }, [data, form]);

  const handleFinish = async (values) => {
    // Log the values to check what is being passed
    console.log("Form Values:", values);

    // Dispatch the updateUser action with the values
    dispatch(updateUser({ id: data.id, user: values }));

    // Log the dispatch of getDriver
    console.log("Dispatching getDriver action...");
    dispatch(getDriver());
  };

  return (
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
            <Input type="email" />
          </Form.Item>
          <Form.Item name="phoneNumber" label="Téléphone">
            <Input />
          </Form.Item>

          <Form.Item name="isActive" label="Actif" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isFree" label="Libre" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="confirmed" label="Confirmé" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="blocked" label="Bloqué" valuePropName="checked">
            <Switch />
          </Form.Item>

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
  );
};

export default UpdateUserModal;
