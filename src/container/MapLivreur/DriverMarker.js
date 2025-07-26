import React, { useEffect, useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { Image } from 'antd';
import ReactStars from 'react-rating-stars-component';
import styled from 'styled-components';
import axios from 'axios';

const ICONS = {
  
  "1":{
    free: require("../../static/img/GreenEco.png"),
    busy: require("../../static/img/RedEco.png"),
    offline: require("../../static/img/GrayEco.png"),
  },
  "2":{
    free: require("../../static/img/GreenClass.png"),
    busy: require("../../static/img/RedClass.png"),
    offline: require("../../static/img/GrayClass.png"),
  },
  "3":{
    free: require("../../static/img/GreenVan.png"),
    busy: require("../../static/img/RedVan.png"),
    offline: require("../../static/img/GrayVan.png"),
  }

};




const DriverMarker = ({ driverId, location, onSelect, isSelected }) => {

  
  const [driverDetails, setDriverDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKUP_URL}users/?filters[documentId][$eq]=${driverId}&populate[0]=vehicule&populate[1]=profilePicture&populate[2]=vehicule.type`);
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
  const { firstName, vehicule, profilePicture, rating, phoneNumber,region } = driverDetails;
  

  const getCarIcon = (isActive, isFree,carTypeId) => {
    let imageURL= "../../static/img/GreenEco.png"
    if(carTypeId){
      if (isActive) {
        imageURL = isFree ? ICONS[carTypeId].free : ICONS[carTypeId].busy
      }
      else {
        imageURL = ICONS[carTypeId].offline
      }
    }
     
  
  
    return {
      url: imageURL,
      scaledSize: new window.google.maps.Size(40, 40),
    };
  };
   return (
    <>
    <Marker
  icon={getCarIcon(isActive, isFree,vehicule?.type[0]?.id)}
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
                <h6>
                  {vehicule?.type?.id === 1 && 'Eco'}
                  {vehicule?.type?.id === 2 && 'Van'}
                  {vehicule?.type?.id === 3 && 'Berline'}
                </h6>
                <h6>
                  Région: {region || 'Inconnue'}
                </h6>
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