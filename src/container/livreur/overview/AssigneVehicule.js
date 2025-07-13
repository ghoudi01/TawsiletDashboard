import React, { useState, useEffect, useMemo } from "react";
import { Modal, Input, List, Avatar, Pagination, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import propTypes, { array } from "prop-types";
import { Button } from "../../../components/buttons/buttons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getDriver,
  updateUser,
} from "../../../redux/User/userSlice";
import { updateVehicule } from "../../../redux/vehicule/vehiculeSlice";
import { fetchVehicleTypes, getVehicleTypeName } from "../../../utility/vehicleTypeUtils";

const { Search } = Input;

// Custom styles
const customStyles = {
  searchInput: {
    marginBottom: 20,
  },
  searchInputFocus: {
    borderColor: "#dbb961",
    boxShadow: "0 0 0 2px rgba(219, 185, 97, 0.2)",
  },
  selectedItem: {
    backgroundColor: "rgba(219, 185, 97, 0.1) !important",
    borderLeft: "3px solid #dbb961",
  },
  listItem: {
    cursor: "pointer",
    padding: "12px 24px",
    borderBottom: "1px solid #f0f0f0",
    transition: "all 0.3s ease",
  },
  listItemHover: {
    backgroundColor: "rgba(219, 185, 97, 0.05)",
  },
};

function AssigneVehicule({ visible, onCancel, usersList, driverDetais }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store?.user?.currentUser);

  // Fetch vehicle types from settings API
  useEffect(() => {
    const loadVehicleTypes = async () => {
      try {
        const types = await fetchVehicleTypes();
        setVehicleTypes(types);
      } catch (error) {
        console.error("Error loading vehicle types:", error);
      }
    };

    loadVehicleTypes();
  }, []);

  const fetchVehicles = async (currentPage = 1, search = "") => {
    try {
      setLoading(true);
      const jwt = localStorage.getItem("token");
      const offset = (currentPage - 1) * pagination.pageSize;
      const filterString = [
        `filters[$or][0][mark][$containsi]=${encodeURIComponent(search)}`,
        `filters[$or][1][model][$containsi]=${encodeURIComponent(search)}`,
        `filters[$or][2][matriculation][$containsi]=${encodeURIComponent(search)}`
      ].join('&');
      
      // Build pagination and populate manually
      const paginationString = `pagination[start]=${offset}&pagination[limit]=${pagination.pageSize}`;
      const populateString = `populate[0]=vehiculePictureface1&populate[1]=driver&&populate[2]=driver.vehicule&populate[3]=driver.vehicules&populate[4]=type`;
      
      // Combine all parts into one full query string
      const fullUrl = `${process.env.REACT_APP_BACKUP_URL}vehicules?${filterString}&${paginationString}&${populateString}`;
      
      const response = await axios.get(fullUrl, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setVehicles(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        current: currentPage
      }));
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchVehicles();
    }
  }, [visible]);

  const handleSearch = (value) => {
    setSearchText(value);
    fetchVehicles(1, value);
  };

  const handlePageChange = (page) => {
    fetchVehicles(page, searchText);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSave = async () => {
    if (!selectedVehicle) return;
    let new_vehiculesList = Array.isArray(driverDetais?.vehicules)
    ? driverDetais.vehicules.map(x => x.id)
    : [];
  
  new_vehiculesList.push(selectedVehicle.id);
   
  new_vehiculesList = [...new Set(new_vehiculesList)];
console.log("selectedVehicle",selectedVehicle)
if(selectedVehicle?.driver?.id){
  await dispatch(
        updateUser({
          id: selectedVehicle?.driver?.id,
          user: {vehicules:selectedVehicle?.driver?.vehicules.map(x=>x.id!==selectedVehicle.id) },
        }));

        if(selectedVehicle?.driver.vehicle===selectedVehicle.id){
          updateUser({
            id: selectedVehicle?.driver?.id,
            user: {vehicule:null },
          })
        }
      
}
  // we must remove the vehcule from the previos driver , how ? get the ddriver froom the vehcule puht tthe ddriver



  await dispatch(
      updateUser({
        id: driverDetais?.id,
        user: {vehicules:new_vehiculesList },
      })
    );

    await dispatch(
      updateVehicule({
        id: selectedVehicle.documentId,
        vehicule: {
          data: {
            driver:driverDetais?.id
          },
        },
      })
    )

    dispatch(getDriver({}))
    onCancel()
  };
   return (
    <Modal
      title="Assigné un Vehicule"
      visible={visible}
      footer={null}
      onCancel={onCancel}
      width={600}
    >
      <div className="vehicle-assignment-container" style={{ padding: "20px 0" }}>
        <Search
          placeholder="Rechercher par marque, modèle ou matricule..."
          allowClear
          enterButton={<SearchOutlined style={{ color: "#dbb961" }} />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => setSearchText(e.target.value)}
          style={customStyles.searchInput}
          className="custom-search-input"
        />

        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={vehicles}
          style={{
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
          }}
          renderItem={(vehicle) => {
            const typeName = getVehicleTypeName(vehicleTypes, vehicle.type?.id);
            return (
              <List.Item
                onClick={() => handleVehicleSelect(vehicle)}
                style={{
                  ...customStyles.listItem,
                  ...(selectedVehicle?.id === vehicle.id
                    ? customStyles.selectedItem
                    : {}),
                }}
                onMouseEnter={(e) => {
                  if (selectedVehicle?.id !== vehicle.id) {
                    e.currentTarget.style.backgroundColor =
                      customStyles.listItemHover.backgroundColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedVehicle?.id !== vehicle.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={vehicle?.vehiculePictureface1?.url}
                      style={{ width: 40, height: 40 }}
                    />
                  }
                  title={
                    <>
                      {`${vehicle.mark || "N/A"} ${vehicle.model || "N/A"}`}
                      {typeName && (
                        <Tag style={{ marginLeft: 8 }}>{typeName}</Tag>
                      )}
                    </>
                  }
                  description={`Matricule: ${
                    vehicle.matriculation || "N/A"
                  }`}
                />
              </List.Item>
            );
          }}
          locale={{
            emptyText: "Aucun véhicule disponible pour cette société",
          }}
        />

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>

      <div className="project-modal-footer" style={{ marginTop: 20, textAlign: "right" }}>
        <Button
          size="default"
          className="btn_Suivant"
          outlined
          onClick={onCancel}
          style={{ marginRight: 8 }}
        >
          Annuler
        </Button>
        <Button
          size="default"
          type="primary"
          className="btn_ADD"
          disabled={!selectedVehicle}
          onClick={handleSave}
          style={{ backgroundColor: "#dbb961", borderColor: "#dbb961" }}
        >
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}

AssigneVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  usersList: propTypes.array.isRequired,
  driverDetais: propTypes.object.isRequired,
};

export default AssigneVehicule;
