// VehicleCard.js
import React from 'react';
import { LinkOutlined } from '@ant-design/icons';

const VehicleCard = ({ vehicule }) => (
  <div className="vehicle-card">
    <div className="vehicle-info">
      <img src={vehicule?.vehiculePictureface1?.url || 'default-vehicle.png'} alt="Vehicle" height={200}/>
      <div>
        <h4>{vehicule.mark}</h4>
        <span style={{ color: 'green' }}>In Service</span>
      </div>
    </div>
   
    <LinkOutlined className="vehicle-icon" />
  </div>
);

export default VehicleCard;