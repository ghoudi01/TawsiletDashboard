import React, { useEffect, useState } from "react";
import { Row, Col, Table, Spin, Input, Upload, message } from "antd";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import { getPrices, updatePrices } from "../../../redux/pricing/settingSlice";
import axios from "axios";

function Calcule() {
  const dispatch = useDispatch();
  const pricesData = useSelector((state) => state.setting?.prices);
  const isLoading = useSelector((state) => state.setting.isLoading);
  const [inputErrors, setInputErrors] = useState({});
  const [editingIndexes, setEditingIndexes] = useState({});
  const [uploadLoading, setUploadLoading] = useState({});
 
  const [newPrices, setNewPrices] = useState({});

  const isInputValid = (priceId, property) => {
    const currentPrices = newPrices[priceId];
    const errors = {};

    const validateProperty = (propertyName, value) => {
      const validNumberRegex = /^\d+(\.\d{1,2})?$/;

      if (typeof value === "string" && !value.trim()) {
        errors[propertyName] = `${propertyName} est requis`;
      } else if (propertyName === "places_numbers" && !validNumberRegex.test(value)) {
        errors[propertyName] = `${propertyName} doit être un nombre valide`;
      } else if (["min_course", "prix_klm", "prix_minute", "commission", "reservation_price"].includes(propertyName) && !validNumberRegex.test(value)) {
        errors[propertyName] = `${propertyName} doit être un nombre valide`;
      } else if (propertyName === "soon" && typeof value !== "boolean") {
        errors[propertyName] = `${propertyName} doit être un booléen`;
      } else if (propertyName === "show" && typeof value !== "boolean") {
        errors[propertyName] = `${propertyName} doit être un booléen`;
      }
    };

    validateProperty(property, currentPrices[property]);
    return errors;
  };

  useEffect(() => {
    dispatch(getPrices());
  }, [dispatch]);

  useEffect(() => {
    if (pricesData && pricesData.data) {
      const updatedPrices = {};
      pricesData.data.forEach((priceData) => {
        updatedPrices[priceData.id] = {
          min_course: priceData.min_course,
          prix_klm: priceData.prix_klm,
          prix_minute: priceData.prix_minute,
          commission: priceData.commission,
          reservation_price: priceData.reservation_price,
          name_ar: priceData.name_ar || "",
          name_fr: priceData.name_fr || "",
          name_en: priceData.name_en || "",
          places_numbers: priceData.places_numbers || 0,
          icon: priceData.icon || "",
          map_icon: priceData.map_icon || "",
          soon: priceData.soon ,
          show: priceData.show ,
          documentId: priceData.documentId
        };
      });
      setNewPrices(updatedPrices);
    }
  }, [pricesData]);

  const handleEditClick = (priceId, index) => {
    setEditingIndexes(prev => ({
      ...prev,
      [`${priceId}-${index}`]: !prev[`${priceId}-${index}`]
    }));
  };

  const handlePriceUpdate = (priceId, index, property) => {
    const errors = isInputValid(priceId, property);
    if (Object.keys(errors).length === 0) {
      const priceData = pricesData?.data?.find(item => item.id === priceId);
      if (!priceData) {
        console.error(`No data found for price ID: ${priceId}`);
        return;
      }

      dispatch(
        updatePrices({
          id: priceData.documentId,
          newPrice: {
            data: {
              [property]: newPrices[priceId][property],
            },
          },
        })
      );
      handleEditClick(priceId, index);
      setInputErrors({});
    } else {
      setInputErrors(errors);
    }
  };

  const handleFileUpload = async (priceId, file, iconType = 'icon') => {
    // Validate file size (1MB limit)
    const isLt1MB = file.size / 1024 / 1024 < 1;
    if (!isLt1MB) {
      message.error('Le fichier doit être inférieur à 1MB!');
      return false;
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Vous ne pouvez télécharger que des fichiers image!');
      return false;
    }

    setUploadLoading(prev => ({ ...prev, [iconType === 'icon' ? priceId : `${priceId}-map`]: true }));

    try {
      const formData = new FormData();
      formData.append("files", file);

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
        const uploadedFile = response.data[0];
       
        // Update the local state with the uploaded file data
        setNewPrices((prevPrices) => ({
          ...prevPrices,
          [priceId]: {
            ...prevPrices[priceId],
            [iconType]: { id: uploadedFile.id, url: uploadedFile.url },
          },
        }));

        message.success('Icône téléchargée avec succès!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Le téléchargement de l\'icône a échoué.');
    } finally {
      setUploadLoading(prev => ({ ...prev, [iconType === 'icon' ? priceId : `${priceId}-map`]: false }));
    }

    return false; // Prevent default upload behavior
  };

  const createDataSource = (priceId) => [
    {
      id: 1,
      Distance: "Nom (Arabe)",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-0`] ? (
        <div className="price_value_input">
          <Input
            type="text"
            size="sm"
            required
            value={newPrices[priceId]?.name_ar}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  name_ar: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.name_ar && (
            <span style={{ color: "red" }}>{inputErrors?.name_ar}</span>
          )}
        </div>
      ) : (
        newPrices[priceId]?.name_ar || "Non défini"
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-0`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 0, "name_ar")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 0)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 0)}
            />
          )}
        </div>
      ),
    },
    {
      id: 2,
      Distance: "Nom (Français)",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-1`] ? (
        <div className="price_value_input">
          <Input
            type="text"
            size="sm"
            required
            value={newPrices[priceId]?.name_fr}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  name_fr: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.name_fr && (
            <span style={{ color: "red" }}>{inputErrors?.name_fr}</span>
          )}
        </div>
      ) : (
        newPrices[priceId]?.name_fr || "Non défini"
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-1`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 1, "name_fr")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 1)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 1)}
            />
          )}
        </div>
      ),
    },
    {
      id: 3,
      Distance: "Nom (Anglais)",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-2`] ? (
        <div className="price_value_input">
          <Input
            type="text"
            size="sm"
            required
            value={newPrices[priceId]?.name_en}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  name_en: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.name_en && (
            <span style={{ color: "red" }}>{inputErrors?.name_en}</span>
          )}
        </div>
      ) : (
        newPrices[priceId]?.name_en || "Non défini"
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-2`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 2, "name_en")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 2)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 2)}
            />
          )}
        </div>
      ),
    },
    {
      id: 4,
      Distance: "Nombre de Places",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-3`] ? (
        <div className="price_value_input">
          <Input
            type="number"
            size="sm"
            required
            value={newPrices[priceId]?.places_numbers}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  places_numbers: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.places_numbers && (
            <span style={{ color: "red" }}>{inputErrors?.places_numbers}</span>
          )}
        </div>
      ) : (
        `${newPrices[priceId]?.places_numbers || 0} places`
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-3`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 3, "places_numbers")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 3)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 3)}
            />
          )}
        </div>
      ),
    },
    {
      id: 5,
      Distance: "Icône",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-4`] ? (
        <div className="price_value_input">
          <Upload
            beforeUpload={(file) => handleFileUpload(priceId, file)}
            showUploadList={false}
            accept="image/*"
            disabled={uploadLoading[priceId]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {uploadLoading[priceId] ? (
                <Spin size="small" />
              ) : (
                <FeatherIcon icon="upload" size={16} />
              )}
              <span>{uploadLoading[priceId] ? 'Téléchargement...' : 'Choisir une image'}</span>
            </div>
          </Upload>
          {newPrices[priceId]?.icon && (
            <img 
              src={newPrices[priceId].icon.url} 
              alt="Icon" 
              style={{ width: 40, height: 40, marginTop: 8, objectFit: 'cover' }} 
            />
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {newPrices[priceId]?.icon ? (
            <img 
              src={newPrices[priceId].icon.url} 
              alt="Icon" 
              style={{ width: 40, height: 40, objectFit: 'cover' }} 
            />
          ) : (
            <span>Aucune icône</span>
          )}
        </div>
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-4`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 4, "icon")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 4)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 4)}
            />
          )}
        </div>
      ),
    },
    {
      id: 6,
      Distance: "Icône sur la carte",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-5-map`] ? (
        <div className="price_value_input">
          <Upload
            beforeUpload={(file) => handleFileUpload(priceId, file, 'map_icon')}
            showUploadList={false}
            accept="image/*"
            disabled={uploadLoading[`${priceId}-map`]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {uploadLoading[`${priceId}-map`] ? (
                <Spin size="small" />
              ) : (
                <FeatherIcon icon="upload" size={16} />
              )}
              <span>{uploadLoading[`${priceId}-map`] ? 'Téléchargement...' : 'Choisir une image'}</span>
            </div>
          </Upload>
          {newPrices[priceId]?.map_icon && (
            <img 
              src={newPrices[priceId].map_icon.url} 
              alt="Map Icon" 
              style={{ width: 40, height: 40, marginTop: 8, objectFit: 'contain' }} 
            />
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {newPrices[priceId]?.map_icon ? (
            <img 
              src={newPrices[priceId].map_icon.url} 
              alt="Map Icon" 
              style={{ width: 40, height: 40, objectFit: 'cover' }} 
            />
          ) : (
            <span>Aucune icône</span>
          )}
        </div>
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-5-map`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, '5-map', "map_icon")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, '5-map')}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, '5-map')}
            />
          )}
        </div>
      ),
    },
    {
      id: 7,
      Distance: "Minimum Course",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-5`] ? (
        <div className="price_value_input">
          <Input
            pattern="[0-9]+"
            type="text"
            size="sm"
            required
            value={newPrices[priceId]?.min_course}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  min_course: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.min_course && (
            <span style={{ color: "red" }}>{inputErrors?.min_course}</span>
          )}
        </div>
      ) : (
        `${newPrices[priceId]?.min_course} TND`
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-5`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 5, "min_course")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 5)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 5)}
            />
          )}
        </div>
      ),
    },
    {
      id: 8,
      Distance: "Prix de 1 KlM",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-6`] ? (
        <div className="price_value_input">
          <Input
            pattern="[0-9]+"
            type="text"
            required
            size="sm"
            value={newPrices[priceId]?.prix_klm}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  prix_klm: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.prix_klm && (
            <span style={{ color: "red" }}>{inputErrors?.prix_klm}</span>
          )}
        </div>
      ) : (
        `${newPrices[priceId]?.prix_klm} TND par 1Klm`
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-6`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 6, "prix_klm")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 6)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 6)}
            />
          )}
        </div>
      ),
    },
    {
      id: 9,
      Distance: "Prix de 1 Minute",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-7`] ? (
        <div className="price_value_input">
          <Input
            pattern="[0-9]+"
            type="text"
            required
            size="sm"
            value={newPrices[priceId]?.prix_minute}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  prix_minute: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.prix_minute && (
            <span style={{ color: "red" }}>{inputErrors?.prix_minute}</span>
          )}
        </div>
      ) : (
        `${newPrices[priceId]?.prix_minute} TND par minute`
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-7`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 7, "prix_minute")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 7)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 7)}
            />
          )}
        </div>
      ),
    },
    {
      id: 10,
      Distance: "Commission de la plateforme",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-8`] ? (
        <div className="price_value_input">
          <Input
            pattern="[0-9]+"
            type="text"
            required
            size="sm"
            value={newPrices[priceId]?.commission}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  commission: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.commission && (
            <span style={{ color: "red" }}>{inputErrors?.commission}</span>
          )}
        </div>
      ) : (
        `${newPrices[priceId]?.commission} %`
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-8`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 8, "commission")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 8)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 8)}
            />
          )}
        </div>
      ),
    },
    {
      id: 11,
      Distance: "Prix de Réservation",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-9`] ? (
        <div className="price_value_input">
          <Input
            pattern="[0-9]+"
            type="text"
            required
            size="sm"
            value={newPrices[priceId]?.reservation_price}
            className="price_change_input"
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  reservation_price: e.target.value,
                },
              }))
            }
          />
          {inputErrors?.reservation_price && (
            <span style={{ color: "red" }}>{inputErrors?.reservation_price}</span>
          )}
        </div>
      ) : (
        `${newPrices[priceId]?.reservation_price || 0} TND`
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-9`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 9, "reservation_price")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 9)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 9)}
            />
          )}
        </div>
      ),
    },
    {
      id: 12,
      Distance: "Bientôt Disponible",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-10`] ? (
        <div className="price_value_input">
          <select
            value={newPrices[priceId]?.soon ? "true" : "false"}
            className="price_change_input"
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  soon: e.target.value === "true",
                },
              }))
            }
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
          {inputErrors?.soon && (
            <span style={{ color: "red" }}>{inputErrors?.soon}</span>
          )}
        </div>
      ) : (
        newPrices[priceId]?.soon ? "Oui" : "Non"
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-10`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 10, "soon")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 10)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 10)}
            />
          )}
        </div>
      ),
    },
    {
      id: 13,
      Distance: "Afficher",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-11`] ? (
        <div className="price_value_input">
          <select
            value={newPrices[priceId]?.show ? "true" : "false"}
            className="price_change_input"
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #d9d9d9" }}
            onChange={(e) =>
              setNewPrices((prevPrices) => ({
                ...prevPrices,
                [priceId]: {
                  ...prevPrices[priceId],
                  show: e.target.value === "true",
                },
              }))
            }
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
          {inputErrors?.show && (
            <span style={{ color: "red" }}>{inputErrors?.show}</span>
          )}
        </div>
      ) : (
        newPrices[priceId]?.show? "Oui" : "Non"
      ),
      update: (
        <div className="edit_price">
          {editingIndexes[`${priceId}-11`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 11, "show")}
              />
              <FeatherIcon
                icon="x-circle"
                size={22}
                stroke={"red"}
                onClick={() => handleEditClick(priceId, 11)}
              />
            </div>
          ) : (
            <FeatherIcon
              icon="edit-3"
              size={22}
              stroke={"gray"}
              onClick={() => handleEditClick(priceId, 11)}
            />
          )}
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "Type de Frais",
      dataIndex: "Distance",
      key: "Distance",
      sorter: (a, b) => a.Distance.localeCompare(b.Distance),
    },
    {
      title: "Montant",
      dataIndex: "Course",
      key: "Course",
    },
    {
      title: "",
      dataIndex: "update",
      key: "update",
      width: 100,
    },
  ];

 

  return (
    <>
      <PageHeader title="Calcule" />
      <Main>
        <Row gutter={30}>
          {pricesData?.data?.map((priceData) => (
            <Col key={priceData.id} sm={24} xs={24} className="mb-25">
              <Cards headless>
                <div>
                  <h1 style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
                    Calcul des frais de course pour les Véhicules de Type {priceData.id}
                  </h1>
                  <Table
                    className="table-responsive"
                    pagination={false}
                    dataSource={createDataSource(priceData.id)}
                    columns={columns}
                    rowKey="id"
                  />
                </div>
              </Cards>
            </Col>
          ))}
        </Row>
      </Main>
    </>
  );
}

export default Calcule;
