import axios from "axios";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import Geocode from "react-geocode";
import Avatar from "../../static/img/avatar/profileImage.png";
import reloadIcon from "../../static/img/icon/reload.png";
import CachIcon from "../../static/img/icon/cash.svg";
import CreditIcon from "../../static/img/icon/credit.svg";
import ArrowRight from "../../static/img/icon/arrow-right.svg";
import ArrowLeft from "../../static/img/icon/arrow-left.svg";
import AssigneDriver from "../commandes/overview/AssigneDriver";
import ReactStars from "react-rating-stars-component";

import { Button, Collapse, Image, Spin, Tag } from "antd";
import styled from "styled-components";
import CommandStatus from "../../utility/enums/commandStatus";
import { useDispatch, useSelector } from "react-redux";
import { getCommandDetailsById } from "../../redux/reservations/reservationSlice";
import ReserveModal from "../reservations/overview/ReserveModal";
import { database } from "../../config/firebase";
import { ref, onValue } from "firebase/database";
import OverviewModal from "../clients/OverviewModal";

const CAR_TYPES = {
  "1": "Éco",
  "2": "Berline ",
  "3": "Van",
};
const colorStatus = (value) => {
  switch (value) {
    case CommandStatus.PENDING:
    case CommandStatus.DISPATCHED_TO_PARTNER:
      return "#9E57E5";
    case CommandStatus.CANCELED_BY_CLIENT:
    case CommandStatus.CANCELED_BY_PARTNER:
      return "#F3935D";
    case CommandStatus.ASSIGNED_TO_DRIVER:
    case CommandStatus.DRIVER_ON_ROUTE_TO_PICKUP:
    case CommandStatus.ARRIVED_AT_PICKUP:
    case CommandStatus.PICKED_UP:
    case CommandStatus.ON_ROUTE_TO_DELIVERY:
    case CommandStatus.ARRIVED_AT_DELIVERY:
      return "#53B483";
    case CommandStatus.DELIVERED:
    case CommandStatus.COMPLETED:
      return "#59B4D1";
    case CommandStatus.FAILED_PICKUP:
    case CommandStatus.FAILED_DELIVERY:
      return "#FF5B5B";
    default:
      return "gray";
  }
};

const handleStatusText = (value) => {
  switch (value) {
    case CommandStatus.PENDING:
      return "Nouveau command";
    case CommandStatus.CANCELED_BY_CLIENT:
    case CommandStatus.CANCELED_BY_PARTNER:
      return "Annulé";
    case CommandStatus.DISPATCHED_TO_PARTNER:
      return "En attente";
    case CommandStatus.ASSIGNED_TO_DRIVER:
      return "Assigné au conducteur";
    case CommandStatus.DRIVER_ON_ROUTE_TO_PICKUP:
      return "En route vers le ramassage";
    case CommandStatus.ARRIVED_AT_PICKUP:
      return "Arrivé au ramassage";
    case CommandStatus.PICKED_UP:
      return "Ramassé";
    case CommandStatus.ON_ROUTE_TO_DELIVERY:
      return "En route vers la livraison";
    case CommandStatus.ARRIVED_AT_DELIVERY:
      return "Arrivé à la livraison";
    case CommandStatus.DELIVERED:
      return "Livré";
    case CommandStatus.COMPLETED:
      return "Terminé";
    case CommandStatus.FAILED_PICKUP:
      return "Échec du ramassage";
    case CommandStatus.FAILED_DELIVERY:
      return "Échec de la livraison";
    default:
      return "";
  }
};

const DRIVER_STATUSES_WITH_POSITION = [
  "Assigned_to_driver",
  "Driver_on_route_to_pickup",
  "Arrived_at_pickup",
  "Picked_up",
  "On_route_to_delivery",
  "Arrived_at_delivery",
  "Delivered",
  "Go_to_pickup",
  
];

const CommandProfile = ({ match }) => {
  const { id } = match.params;
  const [ping, setPing] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const jwt = localStorage.getItem("token");
  const command = useSelector((store) => store?.reservations?.viewedCommand);
  const isLoading = useSelector((store) => store?.reservations?.isLoading);
  const [mapCenter, setMapCenter] = useState(defaultProps.center);

  const [showDetails, setShowDetails] = useState(true);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openReserver, setOpenReserver] = useState(false);
  const [driverPosition, setDriverPosition] = useState(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const onCancel = () => {
    setOpenAdd(false);
  };

  async function calculateRoute({ depart, arrivee }) {
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

 
    const results = await directionsService.route({
      origin: depart, //|| originPosition,
      destination: arrivee, // || destinationPosition ,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
   

    const routeBounds = results?.routes[0]?.bounds;

    if (routeBounds) {
      const newCenter = {
        lat:
          (routeBounds.getNorthEast().lat() +
            routeBounds.getSouthWest().lat()) /
          2,
        lng:
          (routeBounds.getNorthEast().lng() +
            routeBounds.getSouthWest().lng()) /
          2,
      };

      // Update the map center
      setTimeout(() => {
        setMapCenter(newCenter);
      }, 1000);
    }

    setDirectionsResponse(results);
  
  }

  const dispatch = useDispatch();
   useEffect(() => {
    dispatch(getCommandDetailsById(id))
      .then(() => {
         calculateRoute({
          depart: {
            lat: command?.pickUpAddress?.coordonne?.latitude,
            lng: command?.pickUpAddress?.coordonne?.longitude,
          },
          arrivee: {
            lat: command?.dropOfAddress?.coordonne?.latitude,
            lng: command?.dropOfAddress?.coordonne?.longitude,
          },
        });
      })
      .catch((err) => console.log(err));
  }, [id, ping, dispatch]);
  
   useEffect(() => {
     let unsubscribe;
     console.log( command?.driver?.documentId &&
      DRIVER_STATUSES_WITH_POSITION.includes(command?.commandStatus))
    if (
      command?.driver?.documentId &&
      DRIVER_STATUSES_WITH_POSITION.includes(command?.commandStatus)
    ) {
       
      const driverRef = ref(database, `drivers/${command.driver.documentId}`);
      unsubscribe = onValue(driverRef, (snapshot) => {
         console.log(`drivers/${command.driver.documentId}`)
        const data = snapshot.val();
       
        if (data && data.latitude && data.longitude) {
          setDriverPosition({
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
          });
        } else {
          setDriverPosition(null);
        }
      });
    } else {
      setDriverPosition(null);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [command?.driver?.documentId, command?.commandStatus]);

  const [map, setMap] = React.useState(null);
   return (
    <div style={{ minHeight: "calc(100vh - 140px)", overflow: "scroll" }}>
      {/* <h1>CommandProfile</h1> */}
      {isLoading && (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255,0.6)",
            position: "absolute",
            zIndex: 999999,
            height: "100%",
            top: "0px",
            left: "0px",
            bottom: "0px",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      )}
      <DetailsContainer>
        <DetailsLeft>
          <div style={{ width: "100%", height: 200 }}>
            <PlienMap>
              <GoogleMap
                center={mapCenter || defaultProps.center}
                zoom={defaultProps.zoom}
                onLoad={(map) => {
                  setMap(map);
                }}
                onZoomChanged={() => {
                  if (map) {
                 
                  }
                }}
                mapContainerClassName="mapcadre"
                mapContainerStyle={{ width: "100%", height: "100%" }}
                // mapTypeControlOptions={{
                //   mapTypeIds: ["moon", "satellite"],

                // }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  // fullscreenControl: false,
                }}
              >
                {directionsResponse && (
                  <DirectionsRenderer
                    directions={directionsResponse}
                    options={{
                      draggable: false,
                      suppressMarkers: false,
                      zoom: 10,
                      polylineOptions: {
                        strokeOpacity: 1,
                        strokeWeight: 4,
                        strokeColor: "#E524DA",
                      },
                    }}
                  />
                )}
                {/* Driver real-time marker */}
                {driverPosition && (
                  <Marker
                    position={driverPosition}
                    icon={{
                      url: require("../../static/img/GreenEco.png"),
                      scaledSize: new window.google.maps.Size(40, 40),
                    }}
                  />
                )}
              </GoogleMap>
            </PlienMap>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TopHeader>
              <h1>Ref N°: {command?.refNumber}</h1>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    onClick={() => dispatch(getCommandDetailsById(id))}
                    style={{ cursor: "pointer" }}
                    width={16}
                    alt="reload"
                    src={reloadIcon}
                  />
                  <Status
                    style={{
                      backgroundColor: colorStatus(command?.commandStatus),
                    }}
                  >
                    {handleStatusText(command?.commandStatus)}
                  </Status>
                </div>

                {command?.driver === null && (
                  <Button
                    style={{ paddingInline: 8, borderRadius: 8 }}
                    className="btn__reserver_negative"
                    onClick={() => {
                      // setSelectedId(value);
                      setOpenReserver(true);
                    }}
                  >
                    Réserver
                  </Button>
                )}
                {command?.commandStatus ===
                  CommandStatus.DISPATCHED_TO_PARTNER && (
                  <Button
                    style={{ paddingInline: 8, borderRadius: 8 }}
                    className="btn__reserver_negative"
                    onClick={() => {
                      // setSelectedId(value);
                      setOpenAdd(true);
                    }}
                  >
                    Affecter un Chauffeur
                  </Button>
                )}
                {command?.commandStatus ===
                  CommandStatus.DISPATCHED_TO_PARTNER && (
                  <Button
                    style={{
                      paddingInline: 8,
                      borderRadius: 8,
                      backgroundColor: "#ee2211",
                    }}
                    className="btn__reserver_danger"
                    onClick={() => {
                      // setSelectedId(value);
                      // setOpenAdd(true);
                    }}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </TopHeader>
            <CardContainer>
              <CardBody
                style={{
                  justifyContent: "space-between",
                  padding: "0px 20px",
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <img
                    src={command?.payType === "Credit" ? CreditIcon : CachIcon}
                    alt="payment method"
                    width={20}
                    height={20}
                  />
                  <p>
                    {command?.payType === "Credit"
                      ? "Payment en ligne"
                      : "Payement à la Livraison"}
                    :
                  </p>
                  <p
                    style={{
                      fontWeight: 600,
                      color:
                        command?.paymentStatus === "success" ? "green" : "red",
                    }}
                  >
                    {command?.paymentStatus === "success" ? "Payé" : "Impayé"}
                  </p>
                </div>
                <h3>{command?.totalPrice} TND</h3>
                {/* <p>{command?.paymentUrl}</p> */}
              </CardBody>
            </CardContainer>
            <CardContainer style={{ width: "unset", flex: 1 }}>
              {/* <h2>Client:</h2> */}
              <CardBody style={{ flexWrap: "nowrap" }}>
                <Image.PreviewGroup movable={true}>
                  <div
                    className="titel-img"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedClient(command?.client);
                      setClientModalOpen(true);
                    }}
                  >
                    <Image
                      className="roundImage"
                      alt="Client pic"
                      width={100}
                      height={100}
                      src={`${
                        command?.client?.profilePicture?.url
                          ? `${command?.client?.profilePicture?.url}`
                          : Avatar
                      }`}
                    />
                  </div>
                </Image.PreviewGroup>

                <CardBody
                  style={{
                    width: "calc(100% - 120px)",
                    // maxWidth: "calc(100% - 120px)",
                    // minWidth: "fit-content",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    overflow: "hidden",
                    gap: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedClient(command?.client);
                    setClientModalOpen(true);
                  }}
                >
                  <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    Coordonnées de Client:
                    {command?.client?.trusted && (
                      <Tag color="gold" style={{ marginLeft: 8 }}>Trusted</Tag>
                    )}
                  </h4>
                  <p>
                    Nom: {command?.client?.firstName}{" "}
                    {command?.client?.lastName}
                  </p>
                  <p>Tel: {command?.client?.phoneNumber}</p>
                  <p>Email: {command?.client?.email}</p>
                </CardBody>
              </CardBody>
            </CardContainer>
            {command?.driver && (
              <CardContainer style={{ width: "unset", flex: 1 }}>
                {/* <h2>Chauffeur:</h2> */}
                <CardBody style={{ flexWrap: "nowrap" }}>
                  <Image.PreviewGroup movable={true}>
                    <div className="titel-img">
                      {/* <h3 className="company_details_main_title">Face Gauche</h3> */}
                      <Image
                        className="roundImage"
                        alt="Driver pic"
                        width={100}
                        height={100}
                        src={`${
                          command?.driver?.profilePicture?.url
                            ? `${command?.driver?.profilePicture?.url}`
                            : Avatar
                        }`}
                      />
                      <ReactStars
                        half={true}
                        edit={false}
                        size={22}
                        value={command?.driver?.rating || 0}
                      />
                    </div>
                  </Image.PreviewGroup>
                  <CardBody
                    style={{
                      flex: 1,
                      width: "calc(100% - 120px)",
                      // minWidth: "fit-content",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <h4>Coordonnées de Chauffeur:</h4>
                    <p>
                      Nom: {command?.driver?.firstName}{" "}
                      {command?.driver?.lastName}
                    </p>
                    <p>Tel: {command?.driver?.phoneNumber}</p>
                    <p>Email: {command?.driver?.email}</p>
                  </CardBody>
                </CardBody>
              </CardContainer>
            )}
            {command?.driver?.vehicule && (
              <CardContainer>
                <h4>Détails de Véhicule:</h4>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <CardBody
                    style={{
                      gap: "2px",
                      width: "20%",
                      flexDirection: "column",
                      minWidth: "fit-content",
                      alignItems: "flex-start",
                    }}
                  >
                    <p>
                      Matricule:{" "}
                      <b>{command?.driver?.vehicule?.matriculation}</b>
                    </p>
                    <p>Marque: {command?.driver?.vehicule?.mark}</p>
                    <p>Modéle: {command?.driver?.vehicule?.model}</p>
                    <p>Année: {command?.driver?.vehicule?.year}</p>
                  </CardBody>
                  <CardBody
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      padding: "0 20px 20px",
                    }}
                  >
                    <Image.PreviewGroup movable={true}>
                      <div className="titel-img">
                        {/* <h3 className="company_details_main_title">Face Gauche</h3> */}
                        <Image
                          style={{ borderRadius: 16 }}
                          className="roundImage"
                          alt="vehicule pic"
                          width={100}
                          height={100}
                          src={`${
                            command?.driver?.vehicule?.vehiculePictureface1
                              ?.url
                              ? `${command?.driver?.vehicule?.vehiculePictureface1?.url}`
                              : Avatar
                          }`}
                        />
                      </div>
                    </Image.PreviewGroup>
                    <Image.PreviewGroup movable={true}>
                      <div className="titel-img">
                        {/* <h3 className="company_details_main_title">Face Gauche</h3> */}
                        <Image
                          style={{ borderRadius: 16 }}
                          className="roundImage"
                          alt="vehicule pic"
                          width={100}
                          height={100}
                          src={`${
                            command?.driver?.vehicule?.vehiculePictureface2
                              ?.url
                              ? `${command?.driver?.vehicule?.vehiculePictureface2?.url}`
                              : Avatar
                          }`}
                        />
                      </div>
                    </Image.PreviewGroup>
                    <Image.PreviewGroup movable={true}>
                      <div className="titel-img">
                        {/* <h3 className="company_details_main_title">Face Gauche</h3> */}
                        <Image
                          style={{ borderRadius: 16 }}
                          className="roundImage"
                          alt="vehicule pic"
                          width={100}
                          height={100}
                          src={`${
                            command?.driver?.vehicule?.vehiculePictureface3
                              ?.url
                              ? `${command?.driver?.vehicule?.vehiculePictureface3?.url}`
                              : Avatar
                          }`}
                        />
                      </div>
                    </Image.PreviewGroup>
                    <Image.PreviewGroup movable={true}>
                      <div className="titel-img">
                        {/* <h3 className="company_details_main_title">Face Gauche</h3> */}
                        <Image
                          style={{ borderRadius: 16 }}
                          className="roundImage"
                          alt="vehicule pic"
                          width={100}
                          height={100}
                          src={`${
                            command?.driver?.vehicule?.vehiculePictureface4
                              ?.url
                              ? `${command?.driver?.vehicule?.vehiculePictureface4?.url}`
                              : Avatar
                          }`}
                        />
                      </div>
                    </Image.PreviewGroup>
                  </CardBody>
                </div>
              </CardContainer>
            )}
            <CardContainer>
              {/* <h2>Société:</h2> */}
              <CardBody
                style={{ justifyContent: "space-between", paddingRight: 20 }}
              >
              
                <div>
                  <p>Tel: </p>
                  <h4>{command?.company_id?.owner?.phoneNumber}</h4>
                </div>
                <div>
                  <p>Email:</p> <h4>{command?.company_id?.owner?.email}</h4>
                </div>
                <div>
                  <p>Addresse:</p>
                  <h4>{command?.company_id?.address}</h4>
                </div>
              </CardBody>
            </CardContainer>
          </div>
        </DetailsLeft>

        <DetailsRight style={{ width: showDetails ? "25%" : "50px" }}>
          {" "}
          <Flesh onClick={() => setShowDetails(!showDetails)}>
            <img
              src={showDetails ? ArrowRight : ArrowLeft}
              alt="arrow"
              style={{
                width: 20,
                height: 20,
              }}
            />

            <span class="tooltiptext">
              {showDetails ? "Fermer" : "Plus de Détails"}
            </span>
          </Flesh>
          {/* <div>
            <h2 style={
              { textAlign: "center" }}>{command?.totalPrice} TND</h2>
          </div> */}
          {showDetails ? (
            <div
              style={{
                width: showDetails ? "100%" : "0px",
                transform: "width 0.5s",
              }}
            >
              <CardContainer
                style={{ gap: 0, border: "none", boxShadow: "none" }}
              >
                <p>Distance à parcourir:</p>
                <h4 className="grayText">
                  {Math.round(command?.distance / 1000)} km
                </h4>
                <p>Durée du voyage:</p>
                <h4 className="grayText"> {command?.duration}</h4>
                <p>Date de départ</p>
            
              </CardContainer>
              <Divider />
              <CardContainer
                style={{ gap: 0, border: "none", boxShadow: "none" }}
              >
                <p>Date de création</p>
                <h4 className="grayText">
                  {command?.createdAt.slice(0, 10)}{" "}
                  {command?.createdAt.slice(11, 16)}
                </h4>
                <p>Dernier mise à jour</p>
                <h4 className="grayText">
                  {command?.updatedAt.slice(0, 10)}{" "}
                  {command?.updatedAt.slice(11, 16)}
                </h4>
              </CardContainer>
              <Divider />
             
            </div>
          ) : null}
            
          <CardContainer style={{ gap: 0, border: "none", boxShadow: "none" }}>
            {(command?.commandStatus === "Canceled_by_partner" ||
              command?.commandStatus === "Canceled_by_client") && (
              <>
              <p>Annulé par :</p>
              <h4 className="grayText">
                 { command?.commandStatus === "Canceled_by_partner" ?"Chauffeur ":"Client"}
              </h4>
                <p>Raison d'annulation :</p>

                <h4 className="grayText">
                  {command?.cancelReason || "Aucune raison spécifiée"}
                </h4>
              </>
            )}
          </CardContainer>
        </DetailsRight>
      </DetailsContainer>
      {openAdd && (
        <AssigneDriver
          record={command}
          visible={openAdd}
          onCancel={onCancel}
          ping={ping}
          setPing={setPing}
        />
      )}
      {openReserver && (
        <ReserveModal
          reservationId={command.documentId}
          open={openReserver}
          setOpen={setOpenReserver}
          ping={ping}
          carType={command?.carType}
          refNumber={command?.refNumber}
          setPing={setPing}
        />
      )}
      <OverviewModal open={clientModalOpen} setOpen={setClientModalOpen} modalId={selectedClient} />
    </div>
  );
};

const defaultProps = {
  center: {
    lat: 34.25,
    lng: 9.4,
  },
  zoom: 5,
};

export default CommandProfile;

export const PlienMap = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid rgba(57, 71, 81, 0.25);
  box-shadow: 0px 5px 5px rgba(57, 71, 81, 0.18);
  border-radius: 13px;
  padding: 10px;
  overflow: hidden;
  @media (max-width: 744px) {
    display: flex;
    /* height: 100vh; */
    flex-direction: column-reverse;
  }
`;

const DetailsContainer = styled.div`
  padding: 10px 10px;
  min-height: calc(100vh - 100px);
  width: 100%;
  display: flex;
  gap: 10px;
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  /* overflow: scroll; */
`;

const TopHeader = styled.div`
  width: 100%;
  display: flex;
  background-color: #d3d6dc;
  border-radius: 8px;
  color: white;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;

  h1 {
    font-size: 24px;
    font-weight: 900;
    color: #18365a;
  }
`;

const Status = styled.div`
  padding: 4px 10px 4px;
  border-radius: 8px;
  /* border: 1px solid rgba(255, 0, 0, 0.5); */
  background-color: rgba(255, 0, 0, 0.2);
  height: fit-content;
  /* margin-right: 10px; */
`;

const DetailsLeft = styled.div`
  min-height: 100%;
  /* width: 80%; */
  /* flex: 3; */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailsRight = styled.div`
  /* flex: 1; */
  position: relative;
  min-height: 100%;

  display: flex;
  flex-direction: column;
  gap: 10px;
  /* background-color: green; */
  /* border: 1px solid rgba(57, 71, 81, 0.25);
  box-shadow: 0px 5px 5px rgba(57, 71, 81, 0.25); */
  border-radius: 13px;
  /* padding: 10px; */
  transition: width 0.5s;
`;

const CardContainer = styled.div`
  width: 100%;
  border: 1px solid rgba(57, 71, 81, 0.18);
  box-shadow: 0px 2px 5px rgba(57, 71, 81, 0.18);
  border-radius: 13px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .grayText {
    color: #0174be;
    font-weight: 500;
    margin-bottom: 10px;
  }
  p {
    font-size: 12px;
  }
`;

const CardBody = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  p {
    margin: 0;
    font-size: 14px;
  }

  .roundImage {
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: top;
    border-radius: 50%;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))
      drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 90%;
  background: linear-gradient(
    90deg,
    hsla(196, 70%, 33%, 0.219),
    hsla(196, 100%, 32%, 0.493),
    hsla(196, 69%, 37%, 0.171)
  );
`;

const Flesh = styled.div`
  z-index: 999;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 6px;
  right: 10px;
  cursor: pointer;
  padding: 8px;
  box-sizing: content-box;
  display: inline-block;
  /* border-bottom: 1px dotted black; If you want dots under the hoverable text */

  /* Tooltip text */
  .tooltiptext {
    visibility: hidden;
    /* width: 120px; */
    font-size: 14px;
    background-color: black;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    padding: 5px 10px;
    border-radius: 6px;
    top: 5px;
    right: 105%;
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 99;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  &:hover .tooltiptext {
    visibility: visible;
  }
`;
