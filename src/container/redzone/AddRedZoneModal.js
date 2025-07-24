import React, { useState, useEffect } from "react";
import { Modal, Input, Radio } from "antd";
import { GoogleMap, DrawingManager, Polygon, useJsApiLoader,LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { message } from "antd";

// Move libraries array outside the component to avoid re-creating it on every render
const GOOGLE_MAP_LIBRARIES = ["drawing"];

const DEFAULT_CENTER = { lat: 34.8566, lng: 9.3522 };

function AddRedZoneModal({ open, onCancel, onOk }) {
  const [zoneName, setZoneName] = useState("");
  const [polygonPath, setPolygonPath] = useState([]);
  const [rectangle, setRectangle] = useState(null);
  const [drawingMode, setDrawingMode] = useState("rectangle"); // rectangle or circle

  // Google Maps API loader
  // const { isLoaded } = useJsApiLoader({
  //  // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  //   libraries: GOOGLE_MAP_LIBRARIES
  // });

  // Safely define DrawingManager options only when Google Maps API is loaded and drawing library is available
  const drawingManagerOptions =
    window.google &&
    window.google.maps &&
    window.google.maps.drawing
      ? {
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              window.google.maps.drawing.OverlayType.RECTANGLE,
              window.google.maps.drawing.OverlayType.CIRCLE,
            ],
          },
          rectangleOptions: {
            fillColor: "#FF0000",
            fillOpacity: 0.4,
            strokeWeight: 2,
            clickable: false,
            editable: false,
            zIndex: 1,
          },
          circleOptions: {
            fillColor: "#FF0000",
            fillOpacity: 0.4,
            strokeWeight: 2,
            clickable: false,
            editable: false,
            zIndex: 1,
          },
        }
      : {};

  // Handle rectangle complete and store as a square (4 corners)
  const handleRectangleComplete = (rectangleObj) => {
    const bounds = rectangleObj.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    // Calculate the other two corners
    const nw = { lat: ne.lat(), lng: sw.lng() };
    const se = { lat: sw.lat(), lng: ne.lng() };
    // Path in order: NE, NW, SW, SE, NE (to close the square)
    const path = [
      { lat: ne.lat(), lng: ne.lng() },
      nw,
      { lat: sw.lat(), lng: sw.lng() },
      se,
      { lat: ne.lat(), lng: ne.lng() },
    ];
    setPolygonPath(path);
    setRectangle(bounds);
    rectangleObj.setMap(null); // Remove drawn rectangle from map after drawing
  };

  // Handle circle complete and store as an approximate polygon
  const handleCircleComplete = (circleObj) => {
    const center = circleObj.getCenter();
    const radius = circleObj.getRadius();
    // Approximate the circle as a polygon (e.g., 40 points)
    const points = 40;
    const path = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const lat = center.lat() + (radius / 111320) * Math.cos(angle); // 1 deg lat ~ 111.32km
      const lng = center.lng() + (radius / (111320 * Math.cos(center.lat() * (Math.PI / 180)))) * Math.sin(angle);
      path.push({ lat, lng });
    }
    setPolygonPath(path);
    setRectangle(null);
    circleObj.setMap(null); // Remove drawn circle from map after drawing
  };

  const handleOk = async () => {
    if (zoneName && polygonPath.length > 2) {
      try {
       

        await axios.post(`${process.env.REACT_APP_BACKUP_URL}red-zones`, {data:{
          name: zoneName,
          polygonPath: polygonPath,
        }
        
        },{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

       
        message.success("Zone rouge ajoutée avec succès");
        onOk({ name: zoneName, polygonPath });
        setZoneName("");
        setPolygonPath([]);
        setRectangle(null);
      } catch (error) {
        message.error("Erreur lors de l'ajout de la zone rouge");
      }
    }
  };

  const handleCancel = () => {
    setZoneName("");
    setPolygonPath([]);
    setRectangle(null);
    onCancel();
  };

  // Debug: Log when the drawing library is loaded
  // useEffect(() => {
  //   if (isLoaded && window.google && window.google.maps && window.google.maps.drawing) {
  //     console.log("Drawing library loaded:", window.google.maps.drawing);
  //   } else if (isLoaded) {
  //     // Try again after a short delay if drawing is not yet available
  //     const timeout = setTimeout(() => {
  //       if (window.google && window.google.maps && window.google.maps.drawing) {
  //         console.log("Drawing library loaded (delayed):", window.google.maps.drawing);
  //       } else {
  //         console.log("Drawing library still not available after delay.");
  //       }
  //     }, 500);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [isLoaded]);

  return (
    <Modal
      title="Ajouter une zone rouge"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Ajouter"
      cancelText="Annuler"
      width={800}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nom de la zone rouge"
          value={zoneName}
          onChange={e => setZoneName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Radio.Group
          value={drawingMode}
          onChange={e => setDrawingMode(e.target.value)}
          optionType="button"
        >
          <Radio.Button value="rectangle">Rectangle</Radio.Button>
          <Radio.Button value="circle">Cercle</Radio.Button>
        </Radio.Group>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={["drawing"]}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={DEFAULT_CENTER}
            zoom={7}
            libraries={['drawing']}
          >
            <DrawingManager
              drawingMode={
                window.google && window.google.maps && window.google.maps.drawing
                  ? drawingMode === "rectangle"
                    ? window.google.maps.drawing.OverlayType.RECTANGLE
                    : window.google.maps.drawing.OverlayType.CIRCLE
                  : null
              }
              onRectangleComplete={handleRectangleComplete}
              onCircleComplete={handleCircleComplete}
              options={drawingManagerOptions}
            />
            {polygonPath.length > 0 && (
              <Polygon
                path={polygonPath}
                options={{
                  fillColor: "#FF0000",
                  fillOpacity: 0.4,
                  strokeWeight: 2,
                  clickable: false,
                  editable: false,
                  zIndex: 1,
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </Modal>
  );
}

export default AddRedZoneModal; 