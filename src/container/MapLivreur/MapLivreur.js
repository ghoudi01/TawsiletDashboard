import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  getDriver,
  getMapDriver,
  getReviews,
} from "../../redux/User/userSlice";
import { useSelector } from "react-redux";
import { getLocalisation } from "../../redux/Localisation/localisationSlice";
import ReactStars from "react-rating-stars-component";
import DriverList from "./DriverList";
import { Image, Spin } from "antd";
// import Truck from "../../../public/images/Layer 1.png";

const MapLivreur = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  const drivers = useSelector((state) => state?.user?.mapDrivers);
  const role = useSelector((state) => state?.user?.currentUser?.user_role);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const [driversList, setDriversList] = useState([]);
  const Reviews = useSelector((state) => state?.user?.reviews);
  const [ping, setPing] = useState(false);
  const [filterText, setFilterText] = useState("");
  useEffect(() => {
    dispatch(getMapDriver({ text: filterText }));
  }, [ping, filterText]);

  useEffect(() => {
    dispatch(getReviews());
  }, []);
  useEffect(() => {
    if (drivers) {
      // Map the data inside the if block
      const formattedData = drivers.map((driver) => {
        return {
          vehicule: driver?.vehicule_id,
          firstName: driver?.firstName,
          lastName: driver?.lastName,
          company: driver?.company_id?.id,
          email: driver.email,
          id: driver.id,
          location: driver?.location,
          phoneNumber: driver.phoneNumber,
          profilePicture: driver?.profilePicture,
          isActive: driver?.isActive,
          isFree: driver?.isFree,
          coordinates: [
            driver?.location?.latitude,
            driver?.location?.longitude,
          ],
          rating: driver?.rating,
        };
      });

      // if (role === "admin" || role === "owner") {
      setDriversList(formattedData);
      // } else {
      //   // Filter data outside of the if block
      //   const companyDrivers = formattedData.filter(
      //     (el) => el.company === currentUser?.id
      //   );
      //   setDriversList(companyDrivers);
      // }
    }
  }, [drivers, role, currentUser]);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [centerSelected, setCenterSelected] = useState(defaultProps.center);
  const [zoomSelected, setZoomSelected] = useState(defaultProps.zoom);

  return (
    <div
      style={{
        height: "calc(100vh - 125px)",
        display: "flex",
        position: "relativew",
      }}
    >
      {/* {driversList.length ? ( */}
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
            {drivers &&
              drivers?.map((el, i) => (
                <Marker
                  key={i}
                  // icon={{
                  //   url: el?.profilePicture
                  //     ? el?.isActive & el.isFree
                  //       ? `${process.env.REACT_APP_BACKUP_URL}${el?.profilePicture}` + "#green"
                  //       : `${process.env.REACT_APP_BACKUP_URL}${el?.profilePicture}` +
                  //         "#custom_marker"
                  //     : el?.isActive && el.isFree
                  //     ? "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg" +
                  //       "#green"
                  //     : "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg" +
                  //       "#custom_marker",
                  //   scaledSize: new window.google.maps.Size(30, 30),
                  // }}
                  icon={{
                    // path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    url: el?.isActive
                      ? el?.isFree
                        ? "../../images/Layer 1 (3).png"
                        : "../../images/Layer 1 (1).png"
                      : "../../images/Layer 1 (4).png",
                    scale: 1, // Adjust the scale as needed
                    scaledSize: new window.google.maps.Size(30, 20),
                    fillColor: el?.isActive && el.isFree ? "green" : "red",
                    fillOpacity: 1,

                    strokeColor: "black", // Set the stroke (border) color
                    strokeWeight: 1, // Set the stroke weight as needed
                  }}
                  position={{
                    lat: parseFloat(el?.location?.latitude),
                    lng: parseFloat(el?.location?.longitude),
                  }}
                  onClick={() => setSelectedDriver(el)}
                >
                  <div></div>
                </Marker>
              ))}

            {selectedDriver && (
              <InfoWindow
                position={{
                  lat: selectedDriver?.location?.latitude,
                  lng: selectedDriver?.location?.longitude,
                }}
                onCloseClick={() => setSelectedDriver(null)}
              >
                <InfoCard
                  bordercolor={
                    selectedDriver?.isActive
                      ? selectedDriver?.isFree
                        ? "green"
                        : "orange"
                      : "gray"
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {" "}
                    <Image.PreviewGroup movable={true}>
                      <div className="titel-img">
                        {/* <h3 className="company_details_main_title">Face Gauche</h3> */}
                        <Image
                          // style={{ borderRadius: 16 }}
                          className="roundImage"
                          alt="vehicule pic"
                          width={40}
                          height={40}
                          src={`${
                            selectedDriver?.profilePicture
                              ? `${selectedDriver?.profilePicture?.url}`
                              : "https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg"
                          }`}
                        />
                      </div>
                    </Image.PreviewGroup>
                    {/* {selectedDriver?.profilePicture ? (
                    <img
                      src={`${process.env.REACT_APP_BACKUP_URL}${selectedDriver?.profilePicture}`}
                    />
                  ) : (
                    <img src="https://static.vecteezy.com/system/resources/previews/026/175/074/original/driver-avatar-round-flat-icon-vector.jpg" />
                  )} */}
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
                        value={
                          Reviews.filter(
                            (el) =>
                              el?.driver?.data?.id ===
                              selectedDriver?.id
                          ).reduce(
                            (acc, obj) => acc + obj?.note,
                            0
                          ) /
                          Reviews.filter(
                            (el) =>
                              el?.driver?.data?.id ===
                              selectedDriver?.id
                          ).length
                        }
                        // onChange={ratingChanged}
                        size={15}
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
      {/* ) : (
        <LoaderFull>
          <Spin />
        </LoaderFull>
      )} */}
    </div>
  );
};

const defaultProps = {
  center: {
    lat: 34.8566,
    lng: 9.3522,
  },
  zoom: 7,
};

export default MapLivreur;

export const PlienMap = styled.div`
  /* width: 100%; */
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
