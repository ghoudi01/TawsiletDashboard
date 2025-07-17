import React, { useEffect, useState } from "react";
import { AutoComplete, Button, Modal, Input, Upload, Form, Select, Space, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getDriver, getDriverById } from "../../../redux/User/userSlice";
import { addHistorique, getHistorique } from "../../../redux/chartContent/chartSlice";
import axios from "axios";

const { Title, Text } = Typography;

// Constants
const MAX_FILE_SIZE_MB = 5;
const PAGE_SIZE = 100;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * AddHistorique Component
 * Modal for adding new financial transactions
 * @param {Object} props
 * @param {boolean} props.visible - Controls modal visibility
 * @param {Function} props.onCancel - Callback when modal is closed
 * @param {number} props.defaultAmount - Default amount for the transaction
 * @param {string} props.defaultDriverId - Default driver ID for the transaction
 */
function AddHistorique({ visible, onCancel, defaultAmount, defaultDriverId }) {
 
  const dispatch = useDispatch();
  const drivers = useSelector((state) => state?.user?.drivers?.results ?? []);
  const currentUser = useSelector((state) => state.user.currentUser);

  // State management
  const [formState, setFormState] = useState({
    selectedLabel: "",
    selectedDriverId: defaultDriverId || null,
    montant: defaultAmount || "1",
    transactionType: "virement",
    type: true, // true = income, false = outcome
  });

  const [fileState, setFileState] = useState({
    fileList: [],
    uploadedFileId: null,
  });

  const [searchState, setSearchState] = useState({
    page: 1,
    searchText: "",
  });

  // Fetch drivers when modal is visible or when search parameters change
  useEffect(() => {
    if (visible) {
 
      dispatch(getDriver({ 
        page: searchState.page, 
        pageSize: PAGE_SIZE, 
        text: searchState.searchText 
      }));
    }
  }, [visible, searchState.page, searchState.searchText, dispatch]);

  // Update selectedLabel when defaultDriverId changes or drivers are loaded
  useEffect(() => {
    if (defaultDriverId) {
      const driver = drivers.find(d => d.id === defaultDriverId);
      if (driver) {
        setFormState(prev => ({
          ...prev,
          selectedLabel: `${driver.lastName} ${driver.firstName} (${driver.email})`,
          selectedDriverId: driver.id
        }));
      } else {
        // If driver not found, fetch it by ID
        dispatch(getDriverById({ id: defaultDriverId }))
          .then((res) => {
            const fetched = res?.payload;
            if (fetched && fetched.id) {
              setFormState(prev => ({
                ...prev,
                selectedLabel: `${fetched.lastName} ${fetched.firstName} (${fetched.email})`,
                selectedDriverId: fetched.id
              }));
            }
          });
      }
    }
  }, [defaultDriverId, drivers, dispatch]);

  // Update montant when defaultAmount changes
  useEffect(() => {
    if (defaultAmount) {
      setFormState(prev => ({ ...prev, montant: defaultAmount }));
    }
  }, [defaultAmount]);

  // Prepare options for AutoComplete
  const driverOptions = drivers.map((driver) => ({
    value: driver.id,
    label: `${driver.lastName} ${driver.firstName} (${driver.email})`,
  }));

  const handleSearch = (value) => {
    setSearchState(prev => ({
      ...prev,
      searchText: value,
      page: 1 // reset to first page on new search
    }));
  };

  const handleSelect = (driverId) => {
    const selected = driverOptions.find((opt) => opt.value === driverId);
    setFormState(prev => ({
      ...prev,
      selectedDriverId: driverId,
      selectedLabel: selected?.label || ""
    }));
  };

  const handleFileUpload = async (file) => {
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

      if (response.status === 201 || response.status === 200) {
        return response.data[0];
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Upload error:', error);
      message.error("Le téléchargement du fichier a échoué.");
      return null;
    }
  };

  const handleSubmit = async () => {
   
    if (!formState.selectedDriverId || !formState.montant) {
      message.error("Veuillez remplir tous les champs requis");
      return;
    }

    let fileId = null;
    if (fileState.fileList.length > 0) {
      const uploadedFile = await handleFileUpload(fileState.fileList[0]);
      if (!uploadedFile) {
        message.error("Erreur lors du téléchargement du fichier");
        return;
      }
      fileId = uploadedFile;
    }

    const historiqueData = {
      sender: formState.selectedDriverId,
      reciever: currentUser.id,
      sold: formState.montant,
      transactionType: formState.type ? "incomes" : "outcomes",
      payType: formState.transactionType,
      evidence: fileId?.id,
      debit:Math.max(parseFloat(defaultAmount)-parseFloat(formState.montant),0)
    };

    try {
      await dispatch(addHistorique({ data: historiqueData }));
      await dispatch(getHistorique());

      // Reset form state
      setFormState({
        selectedLabel: "",
        selectedDriverId: null,
        montant: "",
        transactionType: "virement",
        type: true,
      });
      setFileState({ fileList: [], uploadedFileId: null });
      onCancel();
      message.success("Transaction enregistrée avec succès");
    } catch (error) {
      message.error("Erreur lors de l'enregistrement de la transaction");
    }
  };

  const uploadProps = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      const isLt5MB = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;
      if (!isLt5MB) {
        message.error(`Le fichier doit être inférieur à ${MAX_FILE_SIZE_MB}MB!`);
        return false;
      }
      setFileState(prev => ({ ...prev, fileList: [file] }));
      return false;
    },
    onRemove: () => {
      setFileState(prev => ({ ...prev, fileList: [] }));
    },
    fileList: fileState.fileList,
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      title="Nouvelle Transaction"
      width={700}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <Button 
            type={formState.type ? "primary" : "default"}
            onClick={() => setFormState(prev => ({ ...prev, type: !prev.type }))}
            style={{ marginBottom: 16 }}
          >
            {formState.type ? "Passer à Dépense" : "Passer à Revenus"}
          </Button>
        </div>

        <Title level={4} style={{ marginBottom: 24 }}>
          {formState.type
            ? "Le chauffeur que vous sélectionnez vous a payé :"
            : "Vous avez payé au chauffeur sélectionné :"}
        </Title>

        <Form layout="vertical">
          <Form.Item label="Sélectionner le chauffeur" required>
            <AutoComplete
              options={driverOptions}
              onSelect={handleSelect}
              onSearch={handleSearch}
              placeholder="Rechercher chauffeur par nom ou email..."
              value={formState.selectedLabel}
              onChange={(value) => setFormState(prev => ({ ...prev, selectedLabel: value }))}
              filterOption={(inputValue, option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
              }
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Montant" required>
            <Input
              placeholder="Montant en chiffre"
              value={formState.montant}
              onChange={(e) => setFormState(prev => ({ ...prev, montant: e.target.value }))}
              type="number"
              prefix="DT"
              disabled={true}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Type de paiement">
            <Select
              value={formState.transactionType}
              onChange={(value) => setFormState(prev => ({ ...prev, transactionType: value }))}
              style={{ width: "100%" }}
            >
              <Select.Option value="virement">Virement</Select.Option>
              <Select.Option value="espece">Espèce</Select.Option>
              <Select.Option value="cheque">Chèque bancaire</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Preuve de transaction">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Télécharger une preuve</Button>
            </Upload>
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              Formats acceptés: PDF, JPG, PNG (max {MAX_FILE_SIZE_MB}MB)
            </Text>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24, textAlign: "right" }}>
          <Space>
            <Button onClick={onCancel}>
              Annuler
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Enregistrer
            </Button>
          </Space>
        </div>
      </Space>
    </Modal>
  );
}

export default AddHistorique;
