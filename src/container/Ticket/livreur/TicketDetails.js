import axios from "axios";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import Geocode from "react-geocode";
import Avatar from "../../../static/img/avatar/profileImage.png";
import { Collapse, Image, Modal, Spin } from "antd";
import styled from "styled-components";
import CommandStatus from "../../../utility/enums/commandStatus";
import { useDispatch, useSelector } from "react-redux";
import {
  getTicketById,
  getTickets,
  updateTicket,
} from "../../../redux/tickets/ticketSlice";
import SelectGm from "../../../selectGm/SelectGm";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


const TicketDetails = ({ match }) => {
  const [response, setResponse] = useState("");
  const { id } = match.params;
  const dispatch = useDispatch();
  const currentTicket = useSelector(
    (state) => state?.tickets?.currentTicket?.data
  );
  const isLoading = useSelector(
    (state) => state?.tickets?.status === "loading"
  );
  const getLabel = (value, language = "en") => {
    if (language === "fr") {
      switch (value) {
        case "resolved":
          return "Résolu";
        case "open":
          return "Ouvert";
        case "inProgress":
          return "En Cours";
        default:
          return value;
      }
    } else {
      // Default to English
      switch (value) {
        case "resolved":
          return "Resolved";
        case "open":
          return "Open";
        case "inProgress":
          return "In Progress";
        default:
          return value;
      }
    }
  };
  
  // Options array with dynamic language support
  const options = [
    { value: "resolved", label: getLabel("resolved", "fr") }, // French
    { value: "open", label: getLabel("open", "fr") }, // French
    { value: "inProgress", label: getLabel("inProgress", "fr") }, // French
  ];

  useEffect(() => {
    dispatch(getTicketById(id))
      .then(() => {
      
      })
      .catch((err) => console.log(err));
  }, [id, dispatch]);

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", overflow: "scroll" }}>
      <DetailsContainer>
        <DetailsLeft>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: 50,
              gap: 30,
            }}
          >
            <CardContainer
              style={{   width: "90%",
                flex: 1,
                padding: 30, margin: "auto" }}
            >
         {currentTicket?.command&&( <Link to={`/admin/details/${currentTicket?.command?.documentId}`}>{" "}<span className="date-finished">#{currentTicket?.command?.refNumber}</span></Link>)}
              <CardBody style={{ flexWrap: "nowrap" }}>
                <Image.PreviewGroup movable={true}>
                  <div className="titel-img">
                    <Image
                      className="roundImage"
                      alt="Client pic"
                      width={100}
                      height={100}
                      src={
                        currentTicket?.command?.profilePicture?.url || Avatar
                      }
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
                  }}
                >
                  <h3 style={{ fontWeight: "600" }}>Coordonnées de Chauffeur:</h3>
                  <p>
                    Nom: {currentTicket?.client?.firstName}{" "}
                    {currentTicket?.client?.lastName}
                  </p>
                  <p>Tel: {currentTicket?.client?.phoneNumber}</p>
                  <p>Email: {currentTicket?.client?.email}</p>
                </CardBody>
              </CardBody>
            </CardContainer>

            <CardContainer
              style={{
                width: "90%",
                flex: 1,
                padding: 40,
                margin: "auto",
                flexDirection: "column",
                height:"auto"
              }}
            >
              <CardBodyDetails
                style={{ justifyContent: "space-between", paddingRight: 20 }}
              >
                <section>
                  <h3 style={{ fontWeight: "600" }}>Problème:</h3>
                  <div>
                    <h3 style={{ color: "#18365a", fontWeight: "600" }}>
                      Date de Création
                    </h3>
                    <h4>
                      {" "}
                      {new Date(currentTicket?.createdAt).toLocaleDateString(
                        "en-US"
                      )}
                    </h4>
                  </div>
                  <div>
                    <h3 style={{ color: "#18365a", fontWeight: "600" }}>
                      Titre
                    </h3>
                    <h4>{currentTicket?.title}</h4>
                  </div>
                  <div style={{ width: "450px" }}>
                    <h3 style={{ color: "#18365a", fontWeight: "600" }}>
                      Description
                    </h3>
                    <h4>{currentTicket?.description}</h4>
                  </div>
           
                </section>
             
              </CardBodyDetails>
            </CardContainer>
           
          </div>
        </DetailsLeft>
         <DetailsRight style={{ width: "50%",   display: "flex",
                    flexDirection: "column", gap:30 ,       marginTop: 50, height:"60%"  }}>
            <CardContainer
              style={{
                width: "80%",
                flex: 1,
                padding: 30,
                margin: "auto",
                flexDirection: "column",
                flex:0
             
              }}
            >
              <CardBodyDetails
                style={{ justifyContent: "space-between", paddingRight: 20 }}
              >
              
                  <h3 style={{ fontWeight: "600" }}>Ajouter une reponse:</h3>
                  <section      style={{
                      width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                 
                  
                  }}>
               
                  <h3 style={{ color: "#18365a", fontWeight: "600" }}>
                  Action:
                    </h3>
                  {/* <SelectGm
                    active={currentTicket?.action}
                    defaultValue={currentTicket?.action || "open"} // Set default selected value
                    options={[
                      // { value: "closed", label: "Closed" },
                      { value: "resolved", label: "Resolved" },
                      { value: "open", label: "Open" }, // Fixed the `default` key

                      { value: "inProgress", label: "In Progress" },
                    ]}
                    placeholder={currentTicket?.action || "Actions"}
                    onSelect={(e) => {
                      Modal.confirm({
                        title: "Confirmation D'action",
                        content:
                          "Etes-vous sûr de vouloir effectuer cette action?",
                        okText: "Oui",
                        okType: "danger",
                        cancelText: "Annuler",
                        onOk() {
                          dispatch(
                            updateTicket({
                              id: currentTicket?.documentId,
                              action: e.value,
                            })
                          ).then(() => {
                            dispatch(getTicketById(id))
                          });
                        },
                        onCancel() {
                          dispatch(getTicketById(id))
                        },
                      });
                    }}
                  /> */}
                                    <SelectGm
  active={getLabel(currentTicket?.action, "fr")} // Translate the active action
  defaultValue={getLabel(currentTicket?.action, "fr") || "Ouvert"} // Translate the default value
  options={options} // Use the French-translated options
  placeholder={getLabel(currentTicket?.action, "fr") || "Actions"} // Translate the placeholder
  onSelect={(e) => {
    Modal.confirm({
      title: "Confirmation D'action",
      content: "Etes-vous sûr de vouloir effectuer cette action?",
      okText: "Oui",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        dispatch(
          updateTicket({
            id: currentTicket?.documentId,
            action: e.value,
          })
        ).then(() => {
          dispatch(getTicketById(id));
        });
      },
      onCancel() {
        dispatch(getTicketById(id));
      },
    });
  }}
/>
                  </section>
               
                <section      style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",                  }}>
                  {currentTicket?.response ? (
                    <div
                      style={{
                        marginTop: 20,
                        padding: 10,
                        border: "1px solid #ddd",
                        borderRadius: 4,
                      }}
                    >
                      <p>{currentTicket.response}</p>
                    </div>
                  ) : (
                    <section style={{display: "flex", flexDirection:"column", width:"100%"}}>
                      <textarea
                        style={{
                          marginTop: 20,
                          width: "100%",
                          padding: 10,
                          border: "1px solid #ddd",
                          borderRadius: 4,
                          resize: "vertical",
                        }}
                        placeholder="Entrez votre reponse ici..."
                        rows={4}
                        value={response} // Bind the value to the state
                        onChange={(e) => setResponse(e.target.value)} // Update the state on change
                      />
                      <button
                        style={{
                          marginTop: 10,
                          padding: "10px 20px",
                          backgroundColor: "#dbb961",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // Submit the response
                          dispatch(
                            updateTicket({
                              id: currentTicket?.documentId,
                              response: response, // Include the response in the payload
                            })
                          ).then(() => {
                            dispatch(getTicketById(id));
                            setResponse(""); // Clear the textarea
                          });
                        }}
                      >
                        Ajouter
                      </button>
                    </section>
                  )}
                </section>
              
              </CardBodyDetails>
            </CardContainer>
            
            <CardContainer
              style={{
                width: "80%",
                flex: 1,
                padding: 20,
                margin: "auto",
                flexDirection: "column",
                height:"auto",
                flex:0
              }}
            >
              <CardBodyDetails
                style={{ justifyContent: "space-between", paddingRight: 20 , }}
              >
              
              
              <section>
                
                <div>
  <h3 style={{ color: "#18365a", fontWeight: "600" }}>
  Pièce jointe:
  </h3>

  {currentTicket?.attachment?.length > 0 ? (
    <div style={{ width: "100%", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {currentTicket.attachment.map((el) => (
        <Image.PreviewGroup movable={true} key={el.url}>
          <div className="titel-img">
            <Image
              className="roundemage"
              alt="Client pic"
              width={120}
              height={120}
              src={el.url}
            />
          </div>
        </Image.PreviewGroup>
      ))}
    </div>
  ) : (
    <p>Il n'y a pas de pièce jointe.</p> // "There is no attachment" in French
  )}
</div>
                </section>
              </CardBodyDetails>
            </CardContainer>
            </DetailsRight>
          
          
      </DetailsContainer>
    </div>
  );
};

export default TicketDetails;

// Styles remain the same...

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
  min-height: "auto";
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
  min-height: "auto";

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

  // border-bottom: 5px solid rgb(6, 43, 70);
  // border-right: 5px solid rgb(6, 43, 70);
  border-top: 0px;
  border-left: 0px;
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

const CardBodyDetails = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  flex-direction: row;
  justify-content:"space-between";
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
      
  .roundemage {
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: top;
    border-radius: 20px
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))
      drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
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
