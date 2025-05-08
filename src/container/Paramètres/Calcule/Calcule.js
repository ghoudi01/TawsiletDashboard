import React, { useEffect, useState } from "react";
import { Row, Col, Table, Spin, Input } from "antd";
import FeatherIcon from "feather-icons-react";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Main } from "../../styled";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { useDispatch, useSelector } from "react-redux";
import { getPrices, updatePrices } from "../../../redux/pricing/settingSlice";

function Calcule() {
  const dispatch = useDispatch();
  const pricesData = useSelector((state) => state.setting?.prices);
  const isLoading = useSelector((state) => state.setting.isLoading);
  const [inputErrors, setInputErrors] = useState({});
  const [editingIndexes, setEditingIndexes] = useState({});
 
  const [newPrices, setNewPrices] = useState({});

  const isInputValid = (priceId, property) => {
    const currentPrices = newPrices[priceId];
    const errors = {};

    const validateProperty = (propertyName, value) => {
      const validNumberRegex = /^\d+(\.\d{1,2})?$/;

      if (typeof value === "string" && !value.trim()) {
        errors[propertyName] = `${propertyName} est requis`;
      } else if (!validNumberRegex.test(value)) {
        errors[propertyName] = `${propertyName} doit être un nombre valide`;
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

  const createDataSource = (priceId) => [
    {
      id: 1,
      Distance: "Minimum Course",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-0`] ? (
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
          {editingIndexes[`${priceId}-0`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 0, "min_course")}
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
      Distance: "Prix de 1 KlM",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-1`] ? (
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
          {editingIndexes[`${priceId}-1`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 1, "prix_klm")}
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
      Distance: "Prix de 1 Minute",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-2`] ? (
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
          {editingIndexes[`${priceId}-2`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 2, "prix_minute")}
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
      Distance: "Commission de la plateforme",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-3`] ? (
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
          {editingIndexes[`${priceId}-3`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 3, "commission")}
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
      Distance: "Prix de Réservation",
      Course: isLoading ? (
        <Spin />
      ) : editingIndexes[`${priceId}-4`] ? (
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
          {editingIndexes[`${priceId}-4`] ? (
            <div className="edit_price_actions">
              <FeatherIcon
                icon="check"
                size={22}
                stroke={"green"}
                onClick={() => handlePriceUpdate(priceId, 4, "reservation_price")}
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

  const getVehicleTypeName = (id) => {
    const vehicleTypes = {
      1: "Éco",
      2: "Berline",
      3: "Van"
    };
    return vehicleTypes[id] || `Type ${id}`;
  };

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
                    Calcul des frais de course pour les Véhicules de Type {getVehicleTypeName(priceData.id)}
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
