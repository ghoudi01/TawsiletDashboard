import React, { useEffect, useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { Image } from 'antd';
import ReactStars from 'react-rating-stars-component';
import styled from 'styled-components';
import axios from 'axios';

const ICONS = {
  free: "../../images/Layer 1 (3).png",
  busy: "../../images/Layer 1 (1).png",
};

const DriverMarker = ({ driverId, location, onSelect, isSelected }) => {
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKUP_URL}users/?filters[documentId][$eq]=${driverId}&populate[0]=vehicule&populate[1]=profilePicture`);
        setDriverDetails(response.data[0]);
        
      } catch (error) {
        console.error(`Error fetching driver details for ${driverId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverData();
  }, [driverId]);

  if (loading || !driverDetails) {
    return null;
  }

  const { latitude, longitude, isFree,isActive } = location;
  const { firstName, vehicule, profilePicture, rating, phoneNumber } = driverDetails;
 
  const getCarIcon = (isActive, isFree) => {
    let color = "#808080"; // default: gray (not active)
    if (isActive) {
      color = isFree ? "#00cc00" : "#cc0000"; // green if free, red if busy
    }
  
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <path fill="${color}" d="M5,11H19L21,16H3L5,11M6.5,18A1.5,1.5 0 0,1 5,16.5A1.5,1.5 0 0,1 6.5,15A1.5,1.5 0 0,1 8,16.5A1.5,1.5 0 0,1 6.5,18M17.5,18A1.5,1.5 0 0,1 16,16.5A1.5,1.5 0 0,1 17.5,15A1.5,1.5 0 0,1 19,16.5A1.5,1.5 0 0,1 17.5,18Z"/>
      </svg>
    `;
  
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      scaledSize: new window.google.maps.Size(40, 40),
    };
  };

  return (
    <>
    <Marker
  icon={getCarIcon(isActive, isFree)}
  position={{
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
  }}
  onClick={() => onSelect(driverDetails)}
/>
      {isSelected && (
        <InfoWindow
          position={{
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          }}
          onCloseClick={() => onSelect(null)}
        >
          <InfoCard bordercolor={isFree ? "green" : "red"}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image.PreviewGroup>
                <div className="titel-img">
                  <Image
                    className="roundImage"
                    alt="vehicule pic"
                    width={40}
                    height={40}
                    src={profilePicture?.url ?? "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg"}
                  />
                </div>
              </Image.PreviewGroup>
              
              <div>
                <h4>{firstName}</h4>
                <h5>
                  {vehicule?.mark 
                    ? `${vehicule.mark} ${vehicule.model}`
                    : "Véhicule inconnu"
                  }
                </h5>
              </div>
            </div>

            <div style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}>
              <h6>
                <ReactStars
                  count={5}
                  edit={false}
                  isHalf={true}
                  size={15}
                  value={rating}
                  activeColor="#ffd700"
                />
              </h6>
              <h5>{phoneNumber}</h5>
            </div>
          </InfoCard>
        </InfoWindow>
      )}
    </>
  );
};

const InfoCard = styled.div`
  width: 300px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  .roundImage {
    border: 3px solid ${(props) => props.bordercolor};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export default DriverMarker; 