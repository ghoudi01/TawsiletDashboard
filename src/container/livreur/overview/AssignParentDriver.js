import React, { useState, useEffect } from "react";
import { Modal, Input, List, Avatar, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";
import { useDispatch } from "react-redux";
import { updateUser, getDriver } from "../../../redux/User/userSlice";
import axios from "axios";

const { Search } = Input;

const customStyles = {
  searchInput: { marginBottom: 20 },
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

function AssignParentDriver({ visible, onCancel, usersList, driverDetais }) {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (visible) {
      setSearchText("");
      setSelectedParent(null);
      setFilteredDrivers(usersList);
      setPagination({
        current: 1,
        pageSize: 10,
        total: usersList.length,
      });
    }
  }, [visible, usersList]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = usersList.filter(
      (u) =>
        (u.firstName + " " + u.lastName + " " + u.email + " " + u.phoneNumber)
          .toLowerCase()
          .includes(value.toLowerCase())
    );
    setFilteredDrivers(filtered);
    setPagination((prev) => ({ ...prev, current: 1, total: filtered.length }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const handleParentSelect = (driver) => {
    setSelectedParent(driver);
  };

  const handleSave = async () => {
    if (!selectedParent) return;
    let new_sub_drivers=selectedParent.sub_drivers.map(x=>x.id);
    new_sub_drivers.push(driverDetais?.id)
    new_sub_drivers = [...new Set(new_sub_drivers)];

    const parent_driverRep=await axios.get(`${process.env.REACT_APP_BACKUP_URL}users?filters[sub_drivers][id][$in]=${driverDetais?.id}&populate[0]=sub_drivers`)
    console.log("ffff",parent_driverRep.data)
    if(parent_driverRep.data.length>0){
       
        let temp_sub_drivers=parent_driverRep.data[0].sub_drivers.map(x=>x.id)
        temp_sub_drivers=temp_sub_drivers.filter(x=>x!==driverDetais?.id)
        
        await dispatch(
            updateUser({
              id: parent_driverRep.data[0]?.id,
              user: { sub_drivers: temp_sub_drivers },
            })
          );
     }


    await dispatch(
      updateUser({
        id: selectedParent?.id,
        user: { sub_drivers: new_sub_drivers },
      })
    );
    dispatch(getDriver({}));
    onCancel();
  };

  // Pagination logic
  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedDrivers = filteredDrivers.slice(startIdx, endIdx);

  return (
    <Modal
      title="Assigner un parent driver"
      visible={visible}
      footer={null}
      onCancel={onCancel}
      width={600}
    >
      <div style={{ padding: "20px 0" }}>
        <Search
          placeholder="Rechercher par nom, email ou téléphone..."
          allowClear
          enterButton={<SearchOutlined style={{ color: "#dbb961" }} />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          style={customStyles.searchInput}
          className="custom-search-input"
        />
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={paginatedDrivers}
          style={{
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
          }}
          renderItem={(driver) => (
            <List.Item
              onClick={() => handleParentSelect(driver)}
              style={{
                ...customStyles.listItem,
                ...(selectedParent?.id === driver.id ? customStyles.selectedItem : {}),
              }}
              onMouseEnter={(e) => {
                if (selectedParent?.id !== driver.id) {
                  e.currentTarget.style.backgroundColor = customStyles.listItemHover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedParent?.id !== driver.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <List.Item.Meta
                avatar={<Avatar>{driver.firstName?.[0]}</Avatar>}
                title={`${driver.firstName || ""} ${driver.lastName || ""}`}
                description={`Email: ${driver.email || "N/A"} | Téléphone: ${driver.phoneNumber || "N/A"}`}
              />
            </List.Item>
          )}
          locale={{ emptyText: "Aucun driver pro trouvé" }}
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
          disabled={!selectedParent}
          onClick={handleSave}
          style={{ backgroundColor: "#dbb961", borderColor: "#dbb961" }}
        >
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}

AssignParentDriver.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  usersList: propTypes.array.isRequired,
  driverDetais: propTypes.object.isRequired,
};

export default AssignParentDriver; 