import React from "react";
import styled from "styled-components";

const DriverItem = ({
  driver,
  driverDetails,
  setCenterSelected,
  setSelectedDriver,
  setZoomSelected,
  asideActive,
  onClick,
}) => {
 
  const getCarIcon = (isActive, isFree) => {
    
    if (!isFree) {
      return "#808080"; // Gray when not active
    }
    if (!isActive) {
      return "#cc0000"; // Red when not free
    }
    return "#00cc00"; // Green when active and free
  }

   
  return (
    <DriverCard
      onClick={() => {
          
        setCenterSelected({
          lat: driver?.location?.latitude,
          lng: driver?.location?.longitude,
        });
        setSelectedDriver(driver);
        setZoomSelected(17);
        if (onClick) onClick();
      }}
      disablecard={driver?.location?.longitude}
      style={{
        backgroundColor: (driver?.location?.latitude && driver?.location?.longitude) ? "none" : "rgba(200,200,200,0.3)",
        pointerEvents: (driver?.location?.latitude && driver?.location?.longitude) ? "auto" : "none",
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