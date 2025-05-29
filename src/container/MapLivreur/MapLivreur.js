import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getDriver,
  getDriversWithCars,
  getMapDriver,
  getReviews,
} from "../../redux/User/userSlice";
import { getLocalisation } from "../../redux/Localisation/localisationSlice";
import ReactStars from "react-rating-stars-component";
import DriverList from "./DriverList";
import { Image, Spin } from "antd";
import { database } from "../../config/firebase";
import { ref, onValue } from "firebase/database";

const defaultProps = {
  center: { lat: 34.8566, lng: 9.3522 },
  zoom: 7,
};

const MapLivreur = () => {
  const dispatch = useDispatch();
  const [driversList, setDriversList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [centerSelected, setCenterSelected] = useState(defaultProps.center);
  const [zoomSelected, setZoomSelected] = useState(defaultProps.zoom);
  const [ping, setPing] = useState(false);
  const [filterText, setFilterText] = useState("");

  const isLoading = useSelector((state) => state.user.isLoading);
  const drivers = useSelector((state) => state.user.driversWithCars);
  const Reviews = useSelector((state) => state.user.reviews);
  const currentUser = useSelector((state) => state.user.currentUser);
  const role = currentUser?.user_role;
  // Firebase subscription
  const iconFree = "../../images/Layer 1 (3).png";
  const iconBusy = "../../images/Layer 1 (1).png";
  useEffect(() => {
    dispatch(getDriversWithCars());
  }, [dispatch]);
  
  useEffect(() => {
    const driversRef = ref(database, "drivers");

    const unsubscribe = onValue(driversRef, (snapshot) => {
      const firebaseData = snapshot.val();

      if (firebaseData) {
        const firebaseDrivers = Object.entries(firebaseData).map(
          ([id, driver]) => ({
            ...driver,
            id,
            coordinates: driver?.location
              ? [driver.location.latitude, driver.location.longitude]
              : [null, null],
          })
        );

        if (drivers && drivers.length > 0) {
          const mergedDrivers = firebaseDrivers
            .map((fbDriver) => {
              const reduxDriver = drivers.find(
                (d) => d.documentId === fbDriver.id && d.user_role === "driver"
              );
              if (!reduxDriver) return null;
              return {
                ...fbDriver,
                vehicule: reduxDriver?.vehicule,
                firstName: reduxDriver?.firstName,
                lastName: reduxDriver?.lastName,
                email: reduxDriver?.email,
                phoneNumber: reduxDriver?.phoneNumber,
                profilePicture: reduxDriver?.profilePicture,
                isActive: reduxDriver?.isActive,
                isFree: reduxDriver?.isFree,
                rating: reduxDriver?.rating,
                region: reduxDriver?.region,
                type: reduxDriver?.vehicule?.type?.id,
              };
            })
            .filter((d) => d !== null); // Remove unmatched entries

          setDriversList(mergedDrivers);
        } else {
          setDriversList([]); // No Redux drivers loaded yet
        }
      }
    });

    return () => unsubscribe();
  }, [drivers]);

  useEffect(() => {
    dispatch(getReviews());
  }, []);

  useEffect(() => {
    dispatch(getMapDriver({ text: filterText }));
  }, [filterText, ping]);
  return (
    <div
      style={{
        height: "calc(100vh - 125px)",
        display: "flex",
        position: "relative",
      }}
    >
      <>
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
          >
            {driversList.map((el, i) => {
              console.log(el,'================el===========')
              return el?.latitude !== null && el?.longitude !== null ? (
                <Marker
                  key={i}
                  icon={{
                    url: el.isFree ? iconFree : iconBusy,
                    scaledSize: new window.google.maps.Size(30, 20),
                  }}
                  position={{
                    lat: parseFloat(el.latitude),
                    lng: parseFloat(el.longitude),
                  }}
                  onClick={() => setSelectedDriver(el)}
                />
              ) : null;
            })}

            {selectedDriver && (
              <InfoWindow
                position={{
                  lat: selectedDriver?.latitude,
                  lng: selectedDriver?.longitude,
                }}
                onCloseClick={() => setSelectedDriver(null)}
              >
                <InfoCard
                  bordercolor={selectedDriver?.isFree ? "green" : "red"}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Image.PreviewGroup>
                      <div className="titel-img">
                        <Image
                          className="roundImage"
                          alt="vehicule pic"
                          width={40}
                          height={40}
                          src={
                            selectedDriver?.profilePicture?.url ??
                            "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg"
                          }
                        />
                      </div>
                    </Image.PreviewGroup>
                    
                    <div>
                      <h4>{selectedDriver?.firstName}</h4>
                      {selectedDriver?.vehicule?.mark ? (
                        <h5>
                          {selectedDriver?.vehicule?.mark}{" "}
                          {selectedDriver?.vehicule?.model}
                        </h5>
                      ) : (
                        <h5>Véhicule inconnu</h5>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <h6>
                      <ReactStars
                        count={5}
                        edit={false}
                        isHalf={true}
                        size={15}
                        value={selectedDriver.rating}
                        activeColor="#ffd700"
                      />
                    </h6>
                    <h5>{selectedDriver?.phoneNumber}</h5>
                  </div>
                </InfoCard>
              </InfoWindow>
            )}
          </GoogleMap>
        </PlienMap>
      </>
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
