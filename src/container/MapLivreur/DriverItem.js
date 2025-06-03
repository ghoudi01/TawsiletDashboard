import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const DriverItem = ({
  driver,
  setCenterSelected,
  setSelectedDriver,
  setZoomSelected,
  asideActive,
}) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      
      if (driver?.id) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKUP_URL}users/?filters[documentId][$eq]=${driver.id}&populate[0]=vehicule&populate[1]=profilePicture`
          );
          console.log("response",response)
          setDriverDetails(response.data[0]);
        } catch (error) {
          console.error("Error fetching driver details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDriverDetails();
  }, [driver?.id]);

  const getCarIcon = (isActive, isFree) => {
    let color = "#808080"; // default: gray (not active)
    if (isActive) {
      color = isFree ? "#00cc00" : "#cc0000"; // green if free, red if busy
    }
    return color
  }

   
  return (
    <DriverCard
      onClick={() => {
        setCenterSelected({
          lat: driver?.location?.latitude,
          lng: driver?.location?.longitude,
        });
        setSelectedDriver(driver);
        setZoomSelected(12);
      }}
      disabled={!driver?.location?.location}
      disablecard={driver?.location?.longitude}
      style={{
        backgroundColor: driver?.location?.longitude ? "none" : "rgba(200,200,200,0.3)",
        pointerEvents: !driver?.location?.location && "none",
      }}
    >
      {driverDetails?.profilePicture ? (
        <img
          alt="driver profile"
          src={driverDetails?.profilePicture.url}
          style={{ height: "100px" }}
        />
      ) : (
        <img
          alt="driver avatar"
          src="https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg"
          style={{ height: "100px" }}
        />
      )}
      {asideActive && (
        <>
          <h1>
            {driverDetails?.firstName} {driverDetails?.lastName}
          </h1>

          <Bulle driverstatus={getCarIcon(driver?.location?.isFree,driver?.location?.isActive)} />
        </>
      )}
    </DriverCard>
  );
};

export default DriverItem;

const DriverCard = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid
    ${(props) => (props.disablecard ? "rgba(200,200,200,1)" : "none")};
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