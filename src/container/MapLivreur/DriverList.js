import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Skeleton, Modal, Select, Spin } from "antd";
import ReloadIcon from "../../static/img/icon/reload.svg";
import DragIcon from "../../static/img/icon/drag.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import DriverItem from "./DriverItem";
import axios from "axios";
import OverwiewLivreur from "../livreur/OverwiewLivreur";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 18,
    }}
    spin
  />
);
const { Search } = Input;

const colors = {
  vert: "green",
  rouge: "red",
  gris: "gray",
};

const DriverList = ({
  selectedDriver,
  setSelectedDriver,
  driversList,
  setCenterSelected,
  setZoomSelected,
  setPing,
  ping,
  filterText,
  setFilterText,
}) => {
  const [combinedDrivers, setCombinedDrivers] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDriver, setModalDriver] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const onSearch = (e) => setFilterText(e.target.value);
  const isLoading = useSelector((store) => store.user.isLoading);
  const [asideActive, setAsideActive] = useState(true);

  const tunisianRegions = [
    { value: 'all', label: 'Toutes les régions' },
    { value: 'Ariana', label: 'ariana' },
    { value: 'Beja', label: 'Beja' },
    { value: 'Ben_arous', label: 'Ben Arous' },
    { value: 'Bizerte', label: 'Bizerte' },
    { value: 'Gabes', label: 'Gabes' },
    { value: 'Gafsa', label: 'Gafsa' },
    { value: 'Jendouba', label: 'Jendouba' },
    { value: 'Kairouan', label: 'Kairouan' },
    { value: 'Kasserine', label: 'Kasserine' },
    { value: 'Kebili', label: 'Kebili' },
    { value: 'Kef', label: 'Kef' },
    { value: 'Mahdia', label: 'Mahdia' },
    { value: 'Manouba', label: 'Manouba' },
    { value: 'Medenine', label: 'Medenine' },
    { value: 'Monastir', label: 'Monastir' },
    { value: 'Nabeul', label: 'Nabeul' },
    { value: 'Sfax', label: 'Sfax' },
    { value: 'Sidi_bouzid', label: 'Sidi Bouzid' },
    { value: 'Siliana', label: 'Siliana' },
    { value: 'Sousse', label: 'Sousse' },
    { value: 'Tataouine', label: 'Tataouine' },
    { value: 'Tozeur', label: 'Tozeur' },
    { value: 'Tunis', label: 'Tunis' },
    { value: 'Zaghouan', label: 'Zaghouan' }
  ];

  useEffect(() => {
    const fetchAllDriverDetails = async () => {
      if (driversList.length > 0) {
        setIsLoadingDetails(true);
        try {
          const driverIds = driversList.map(driver => driver.id).filter(Boolean);

          // Helper to chunk array into batches of 100
          const chunkArray = (array, size) => {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
              result.push(array.slice(i, i + size));
            }
            return result;
          };

          const idChunks = chunkArray(driverIds, 100);
          let allDetails = [];

          for (const chunk of idChunks) {
            const params = new URLSearchParams();
            chunk.forEach((id, index) => {
              params.append(`filters[documentId][$in][${index}]`, id);
            });
            params.append('populate[0]', 'vehicule');
            params.append('populate[1]', 'profilePicture');

            const response = await axios.get(
              `${process.env.REACT_APP_BACKUP_URL}users/?${params.toString()}`
            );
            allDetails = allDetails.concat(response.data);
          }

          // Create a map of driver details
          const detailsMap = allDetails.reduce((acc, driver) => {
            acc[driver.documentId] = driver;
            return acc;
          }, {});

          // Combine driversList with their details and filter out non-existent ones
          const combined = driversList
            .map(driver => ({
              ...driver,
              details: {
                ...detailsMap[driver.id],
                isActive: driver.location.isActive,
                isFree: driver.location.isFree
              }
            }))
            .filter(driver => driver?.details?.id!==undefined); // Only keep drivers that exist in both systems

          setCombinedDrivers(combined);
        } catch (error) {
          console.error("Error fetching driver details:", error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };

    fetchAllDriverDetails();
  }, []); // Added ping as a dependency

  const filteredDrivers = combinedDrivers.filter(driver => {

     // Text filter
    if (filterText) {
      const details = driver.details;
      if (!details) return false;

      const searchText = filterText.toLowerCase();
      const matchesText = (
        details.firstName?.toLowerCase().includes(searchText) ||
        details.lastName?.toLowerCase().includes(searchText) ||
        details.phone?.toLowerCase().includes(searchText)
      );
      if (!matchesText) return false;
    }

    if (statusFilter !== 'all') {
      const isActive = driver.details?.isActive;
      const isFree = driver.details?.isFree;
     
       

      switch (statusFilter) {
        case 'disponible':
          return isActive==true && isFree==true;
        case 'en_cours':
          return isFree==false;
        case 'offline':
          return isActive==false;
        default:
          return true;
      }
    }


     // Region filter
    if (regionFilter !== 'all') {
      if (driver.details?.region !== regionFilter) return false;
    }

    return true;
  });

  return (
    <DriverListParent>
      <OpenClose onClick={() => setAsideActive(!asideActive)}>
        <img src={DragIcon} alt="drag" />
      </OpenClose>
      <DriverListContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: asideActive ? "space-between" : "center",
            paddingRight: asideActive ? 10 : 0,
            gap: "8px",
          }}
        >
          {asideActive ? (
            <div className="filter-section">
              <Search
                placeholder="Nom , Télephone , ..."
                allowClear
                size="small"
                className="search-bar"
                onChange={onSearch}
              />
              <div className="filters-row">
                <Select
                  size="small"
                  className="filter-select"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: 'all', label: 'Tous' },
                    { value: 'disponible', label: 'Disponible' },
                    { value: 'en_cours', label: 'En cours' },
                    { value: 'offline', label: 'Off-line' },
                  ]}
                />
                <Select
                  size="small"
                  className="filter-select"
                  value={regionFilter}
                  onChange={setRegionFilter}
                  options={tunisianRegions}
                />
              </div>
            </div>
          ) : null}
          <ReloadContainer
            asideactive={asideActive}
            onClick={() => setPing(!ping)}
          >
            {isLoading ? (
              <Spin className="reload-icon" indicator={antIcon} />
            ) : (
              <img src={ReloadIcon} alt="reload" className="reload-icon" />
            )}
          </ReloadContainer>
        </div>
        <div className="divWithScrollbar">
          {filteredDrivers.map((driver, i) => (
            <DriverItem
              key={i}
              driver={driver}
              driverDetails={driver.details}
              setCenterSelected={setCenterSelected}
              setSelectedDriver={setSelectedDriver}
              setZoomSelected={setZoomSelected}
              asideActive={asideActive}
              onClick={() => {

                setModalDriver(driver);

              }}
            />
          ))}
        </div>
      </DriverListContainer>

    </DriverListParent>
  );
};

export default DriverList;

const DriverListParent = styled.div`
  position: relative;
  height: calc(100vh - 125px);
`;

const DriverListContainer = styled.div`
  * {
    margin: 0%;
    padding: 0;
    box-sizing: border-box;
  }

  background-color: rgba(250, 250, 250, 1);
  position: relative;
  max-width: 350px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* === */
  height: 100%;
  overflow-y: scroll;

  .filter-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .search-bar {
    width: 100%;
  }

  .filters-row {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .filter-select {
    flex: 1;
    min-width: 0; /* Prevents flex items from overflowing */
  }

  .ant-input-affix-wrapper {
    height: 30px;
    padding-inline: 5px;
  }

  .reload-icon {
    width: 18px;
    height: 18px;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 3px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (max-width: 350px) {
    .filters-row {
      flex-direction: column;
    }
  }
`;

const DriverCard = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid ${(props) => (props.disablecard ? "rgba(200,200,200,1)" : "none")};
  border-radius: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  &:hover {
    box-shadow: 0px 5px 5px rgba(57, 71, 81, 0.18);
  }
  h1 {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    color: ${(props) => (props.disablecard ? "black" : "gray")};
  }

  img {
    width: 40px;
    height: 40px !important;
    object-fit: cover;
    object-position: top;
    border-radius: 50%;
    border: 1px solid rgba(200, 200, 200, 0.5);
  }
`;

const Bulle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.driverstatus};
`;

const OpenClose = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 40vh;
  right: -25px;
  background-color: white;
  z-index: 99;
  padding: 4px;
  border-radius: 10px;
  transform: rotate(45deg);
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    transform: rotate(-45deg);
  }
`;

const ReloadContainer = styled.div`
  cursor: pointer;
  padding: ${(props) => (props.asideactive ? "4px" : "8px")};
  border: 1px solid rgba(200, 200, 200, 0.9);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => (props.asideactive ? "80%" : "100%")};
  width: ${(props) => (props.asideactive ? "unset" : "100%")};
`;