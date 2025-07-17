import React, { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import DriverList from "./DriverList";
import { Spin } from "antd";
import { database } from "../../config/firebase";
import { ref, onValue } from "firebase/database";
import DriverMarker from "./DriverMarker";

const MAP_DEFAULTS = {
  center: { lat: 34.8566, lng: 9.3522 },
  zoom: 7,
  minZoomForMarkers: 15, // Minimum zoom level to show markers
};

const MapLivreur = () => {
  const dispatch = useDispatch();
  const [driversList, setDriversList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [centerSelected, setCenterSelected] = useState(MAP_DEFAULTS.center);
  const [zoomSelected, setZoomSelected] = useState(MAP_DEFAULTS.zoom);
  const [ping, setPing] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const driversRef = ref(database, "drivers");
    setLoading(true);

    const unsubscribe = onValue(driversRef, (snapshot) => {
      const firebaseData = snapshot.val();

      if (firebaseData) {
 
        const drivers = Object.entries(firebaseData).map(([id, driver]) => {
       
          return ({
          id,
          location: {
            latitude: driver?.latitude || null,
            longitude: driver?.longitude || null,
            isFree: driver?.isFree || true,
            isActive: driver?.isActive || false,
            lastSeen: driver?.lastSeen,
            lastUpdated: driver?.lastUpdated,
            heading: driver?.heading || 0
          }
        })});

        setDriversList(drivers);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <LoaderFull>
        <Spin size="large" />
      </LoaderFull>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 125px)", display: "flex", position: "relative" }}>
      <DriverList
        driversList={driversList}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        setCenterSelected={setCenterSelected}
        setZoomSelected={setZoomSelected}
        setPing={setPing}
        ping={ping}
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
          {zoomSelected >= MAP_DEFAULTS.minZoomForMarkers && driversList.map((driver) => {
            return <DriverMarker
              key={driver.id}
              driverId={driver.id}
              location={driver.location}
              onSelect={setSelectedDriver}
              isSelected={selectedDriver?.documentId === driver.id}
            />
          })}
        </GoogleMap>
      </PlienMap>
    </div>
  );
};

export default MapLivreur;

// Styled Components
export const PlienMap = styled.div`
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
