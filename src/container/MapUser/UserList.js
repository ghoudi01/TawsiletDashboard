import React from "react";
import styled from "styled-components";
import { Input } from "antd";
import UserItem from "./UserItem";

const { Search } = Input;

const UserList = ({
  usersList = [],
  selectedUser,
  setSelectedUser,
  setCenterSelected,
  setZoomSelected,
  filterText,
  setFilterText,
}) => {
  const filteredUsers = usersList.filter((user) => {
    if (!filterText) return true;
    const searchText = filterText.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(searchText)) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchText)) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchText)) ||
      (user.email && user.email.toLowerCase().includes(searchText))
    );
  });

  return (
    <UserListParent>
      <div style={{ padding: 10 }}>
        <Search
          placeholder="Nom, Téléphone, Email..."
          allowClear
          size="small"
          className="search-bar"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <UserListContainer>
        <div className="divWithScrollbar">
          {filteredUsers.map((user) => (
            <UserItem
              key={user.id}
              user={user}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setCenterSelected={setCenterSelected}
              setZoomSelected={setZoomSelected}
            />
          ))}
        </div>
      </UserListContainer>
    </UserListParent>
  );
};

export default UserList;

const UserListParent = styled.div`
  position: relative;
  height: calc(100vh - 125px);
`;

const UserListContainer = styled.div`
  background-color: rgba(250, 250, 250, 1);
  position: relative;
  max-width: 350px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  overflow-y: scroll;

  .divWithScrollbar {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`; 