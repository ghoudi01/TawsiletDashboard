import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap } from "@react-google-maps/api";
import styled from "styled-components";
import UserList from "./UserList";
import UserMarker from "./UserMarker";
import { Spin } from "antd";
import { database } from "../../config/firebase";
import { ref, onValue } from "firebase/database";
import axios from "axios";

const MAP_DEFAULTS = {
  center: { lat: 34.8566, lng: 9.3522 },
  zoom: 7,
  minZoomForMarkers: 10,
};

const MapUser = () => {
  const [usersList, setUsersList] = useState([]);
  const [detailedUsersList, setDetailedUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [centerSelected, setCenterSelected] = useState(MAP_DEFAULTS.center);
  const [zoomSelected, setZoomSelected] = useState(MAP_DEFAULTS.zoom);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleZoomChanged = useCallback(() => {
    if (map) {
      setZoomSelected(map.getZoom());
    }
  }, [map]);

  // Fetch users from Firebase
  useEffect(() => {
    const usersRef = ref(database, "users");
    setLoading(true);
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        const users = Object.entries(firebaseData).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsersList(users);
      } else {
        setUsersList([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch user details from API and combine with Firebase users
  useEffect(() => {
    const fetchAllUserDetails = async () => {
      if (usersList.length > 0) {
        setLoadingDetails(true);
        try {
          const userIds = usersList.map(user => user.id).filter(Boolean);
          const chunkArray = (array, size) => {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
              result.push(array.slice(i, i + size));
            }
            return result;
          };
          const idChunks = chunkArray(userIds, 100);
          let allDetails = [];
          for (const chunk of idChunks) {
            const params = new URLSearchParams();
            chunk.forEach((id, index) => {
              params.append(`filters[documentId][$in][${index}]`, id);
            });
            params.append('populate[0]', 'profilePicture');
            // Add more populate fields if needed
            const response = await axios.get(
              `${process.env.REACT_APP_BACKUP_URL}users/?${params.toString()}`
            );
            allDetails = allDetails.concat(response.data);
          }
          // Create a map of user details
          const detailsMap = allDetails.reduce((acc, user) => {
            acc[user.documentId] = user;
            return acc;
          }, {});
          // Combine usersList with their details and filter out non-existent ones
          const combined = usersList
            .map(user => ({
              ...user,
              ...detailsMap[user.id],
            }))
            .filter(user => user?.id !== undefined); // Only keep users that exist in both systems
          setDetailedUsersList(combined);
        } catch (error) {
          console.error("Error fetching user details:", error);
          setDetailedUsersList([]);
        } finally {
          setLoadingDetails(false);
        }
      } else {
        setDetailedUsersList([]);
      }
    };
    fetchAllUserDetails();
  }, [usersList]);

  if (loading || loadingDetails) {
    return (
      <LoaderFull>
        <Spin size="large" />
      </LoaderFull>
    );
  }

  return (
    <Container>
      <UserList
        usersList={detailedUsersList}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setCenterSelected={setCenterSelected}
        setZoomSelected={setZoomSelected}
        filterText={filterText}
        setFilterText={setFilterText}
      />
      <PlienMap>
        <GoogleMap
          center={centerSelected}
          zoom={zoomSelected}
          mapContainerClassName="mapcadre"
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onZoomChanged={handleZoomChanged}
        >
          {zoomSelected >= MAP_DEFAULTS.minZoomForMarkers && detailedUsersList.map((user) => {
            if (!user.latitude || !user.longitude) return null;
            return (
              <UserMarker
                key={user.id}
                user={user}
                onSelect={setSelectedUser}
                isSelected={selectedUser?.id === user.id}
              />
            );
          })}
        </GoogleMap>
      </PlienMap>
    </Container>
  );
};

export default MapUser;

const Container = styled.div`
  height: calc(100vh - 125px);
  display: flex;
  position: relative;
`;

const PlienMap = styled.div`
  flex: 1;
  height: 100%;
  position: relative;

  @media (max-width: 744px) {
    display: flex;
    height: 100vh;
    flex-direction: column-reverse;
  }

  .gm-style-iw,
  .gm-style-iw-tc {
    margin-top: -20px;
  }
`;

const LoaderFull = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(77, 87, 245, 0.3);
  z-index: 9999;
`; 