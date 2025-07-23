import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const UserMarker = ({ user, onSelect, isSelected }) => {
  if (!user.latitude || !user.longitude) return null;
   return (
    <>
      <Marker
        position={{ lat: user.latitude, lng: user.longitude }}
        onClick={() => onSelect(user)}
        icon={{
          url: user.profilePicture?.url || "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg",
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />
      {isSelected && (
        <InfoWindow
          position={{ lat: user.latitude, lng: user.longitude }}
          onCloseClick={() => onSelect(null)}
        >
          <div style={{ minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                alt="user avatar"
                src={user.profilePicture?.url || "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg"}
                style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{user.firstName} {user.lastName}</h4>
                <div style={{ fontSize: 12, color: "gray" }}>{user.phoneNumber || user.email}</div>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default UserMarker; 