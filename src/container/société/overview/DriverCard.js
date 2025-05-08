// DriverCard.js
import React from 'react';
import { PhoneOutlined } from '@ant-design/icons';

const DriverCard = ({ driver }) => (
  <div className="driver-card">
    <div className="driver-info">
      <img src={driver.avatar || 'default-avatar.png'} alt="Driver" />
      <div>
        <h4>{driver.firstName} {driver.lastName}</h4>
        <span style={{ color: 'green' }}>Active</span>
      </div>
    </div>
    <div className="driver-contacts">
      <p><PhoneOutlined /> {driver.phoneNumber}</p>
      <p>{driver.email}</p>
    </div>
  </div>
);

export default DriverCard;