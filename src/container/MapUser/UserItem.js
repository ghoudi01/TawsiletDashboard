import React from "react";
import styled from "styled-components";

const UserItem = ({
  user,
  selectedUser,
  setSelectedUser,
  setCenterSelected,
  setZoomSelected,
}) => {
  const handleClick = () => {
    if (user.latitude && user.longitude) {
      setCenterSelected({ lat: user.latitude, lng: user.longitude });
      setSelectedUser(user);
      setZoomSelected(17);
    }
  };
   return (
    <UserCard
      onClick={handleClick}
      selected={selectedUser?.id === user.id}
      style={{
        backgroundColor: user.latitude && user.longitude ? "#fff" : "rgba(200,200,200,0.3)",
        pointerEvents: user.latitude && user.longitude ? "auto" : "none",
      }}
    >
      <img
        alt="user avatar"
        src={user.profilePicture?.url || "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg"}
        style={{ height: 40, width: 40, borderRadius: "50%", marginRight: 10 }}
      />
      <div>
        <div style={{ fontWeight: 500 }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ fontSize: 12, color: "gray" }}>{user.phoneNumber || user.email}</div>
      </div>
    </UserCard>
  );
};

export default UserItem;

const UserCard = styled.div`
  cursor: pointer;
  padding: 10px;
  border: 1px solid rgba(200,200,200,0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  &:hover {
    box-shadow: 0px 5px 5px rgba(57, 71, 81, 0.18);
  }
  ${(props) =>
    props.selected &&
    `
      border: 2px solid #4d57f5;
      background: #f0f3ff;
    `}
`; 