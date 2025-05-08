import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import Styled from "styled-components";
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  DatePicker,
  Badge,
  Dropdown,
  Menu,
  Switch,
  message,
  AutoComplete,
  Steps,
} from "antd";
import Geocode from "react-geocode";
import {
  useJsApiLoader,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { fourniture } from "./StaticData.js";
import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";
import { Modal } from "../../../components/modals/antd-modals";

import { useDispatch } from "react-redux";
// import { getusers } from "../../../redux/User/userSlice";
import { useSelector } from "react-redux";
import {
  createNewReservation,
  getReservations,
} from "../../../redux/reservations/reservationSlice.js";
import { useForm } from "react-hook-form";
import { getDate } from "date-fns";
import CreateNewUser from "./CreateNewUser.js";
import { getusers } from "../../../redux/User/userSlice.js";
 import DateTimeInput from "./DateTimeInput.js";
import { calculatePrice } from "./priceCalcul.js";
import { getPrices } from "../../../redux/pricing/settingSlice.js";
import { sendNotification } from "../../../redux/notifications/notificationSlice.js";
import axios from "axios";

const { Option } = Select;
const dateFormat = "YYYY-MM-DD";

function CreateReservation({ visible, onCancel, setPing, ping }) {
  const newCreatedUser = useSelector((state) => state.user.newUser);
   const currentUser = useSelector((state) => state?.user?.currentUser);
  const destiantionRef = useRef();

  const [destiantionState, setDestiantionState] = useState(null);
  const [Inputerrors, setInputErrors] = useState({});
  const [access, setAccess] = useState({
    pickUp: "Rez-de-chaussée",
    drop: "Rez-de-chaussée",
  });
  const {
    register,
    handleSubmit,
    getValues,

    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (visible) {
      dispatch(getPrices());
    }
  }, [visible]);

  const onSubmitHandler = async (data) => {
    try {
      // Calculate the price
      axios
        .post(`${process.env.REACT_APP_BACKUP_URL}calcul`, {
          distance: newreservation?.data?.distance,
          volume: selectedArticles,
          accessDepart: newreservation?.data?.pickUpAcces,
          accessArrivee: newreservation?.data?.dropAcces,
        })
        .then((totalPrice) => {
          // Set the calculated price in the reservation data
          const reservationDataWithPrice = {
            ...data,
            data: {
              ...data.data,
              totalPrice: totalPrice.data,
              items: selectedArticles,
            },
          };
          const createOrder = () => {
            return new Promise(async (resolve, reject) => {
              try {
                const result = await dispatch(
                  createNewReservation(reservationDataWithPrice)
                );
                resolve(result);
              } catch (error) {
                /* console.error(`Erreur lors du traitement de la commande :, error); */
                reject(
                  new Error(
                    "Une erreur s'est produite lors du traitement de votre demande."
                  )
                );
              }
            });
          };
          // Dispatch the createNewReservation action with the updated reservation data
          createOrder().then((res) => {
            setPing(!ping);
            dispatch(
              sendNotification({
                id: reservationDataWithPrice?.data?.client_id,
                title: "Vous avez passés une commande.",
                sendFrom: {
                  id: currentUser?.id,
                  name: currentUser?.name,
                },
                command: res?.id,
                notification_type: "dispatched",
                types: ["notification", "email"],
                smsCore: `${currentUser?.name} vous a créés la commande numéro : ${res?.payload?.data?.refNumber}`,
                notificationCore: "vous avez une notification",
                saveNotification: true,
                template_id: "d-8b266aac7fd64f73bab6ee0c80df8dbd",
                dynamicTemplateData: {
                  commandeid: res?.payload?.data?.id,
                },
              })
            );
          });

          // Display success message
          message.success("Ajouter avec succès!");

          // Close the modal or handle any other necessary actions
          handleCancel();
        });
    } catch (error) {
      // Handle any errors that might occur during reservation submission
      console.error("Error submitting reservation:", error);
    }
  };

  const [newreservation, setNewreservation] = useState({
    data: {
      departDate: "",
      payType: null,
      totalPrice: null,
      distance: null,
      deparTime: null,
      SpecificNote: "",
      duration: "",
      pickUpAddress: {
        Address: "",
        coordonne: {
          latitude: null,
          longitude: null,
        },
      },
      dropOfAddress: {
        Address: "",
        coordonne: {
          latitude: null,
          longitude: null,
        },
      },
      items: [],
      client_id: null,
      TansportType: {
        Type: "",
        Quantity: 1,
      },
      dropAcces: {
        options: "Camion",
        floor: 0,
      },
      pickUpAcces: {
        options: "Camion",
        floor: 0,
      },
    },
  });

  const [isCreditMode, setIsCreditMode] = useState(false);
  const [isLivraisonMode, setIsLivraisonMode] = useState(false);

  const handleCreditSwitchChange = (checked) => {
    setIsCreditMode(checked);
    setIsLivraisonMode(!checked);
    setNewreservation((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        payType: checked ? "Credit" : "",
      },
    }));
  };

  const handleLivraisonSwitchChange = (checked) => {
    setIsLivraisonMode(checked);
    setIsCreditMode(!checked);
    setNewreservation((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        payType: checked ? "Livraison" : "",
      },
    }));
  };
  const [selectedArticles, setSelectedArticles] = useState([
    {
      item: {
        name: "",
        volume: 0,
        category: null,
        weight: 0,
      },
      quant: 1,
    },
  ]);
  const handleSelectChange = (value, index) => {
    

    setSelectedArticles((prevSelectedArticles) => {
      const updatedArticles = prevSelectedArticles.map((item, i) => {
        if (i === index) {
          // Check if the index matches
          return {
            ...item,
           
            item: {
              ...item.item,
              
            },
          };
        }
        return item;
      });
      return updatedArticles;
    });
  };

  const dispatch = useDispatch();

  // const [steps, setSteps] = useState(1);
  const client = useSelector((state) => state?.user?.users);
  const [showCreateNewClient, setShowCreateNewClient] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const originRef = useRef();
  const [originState, setOriginState] = useState(null);
  useEffect(() => {
    dispatch(getusers());
  }, [newCreatedUser, dispatch]);

  const [newUser, setnewUser] = useState({
    username: "",
    email: "",
    phoneNumber: null,
    user_role: "client",
    password: "",
    accountOverview: [
      {
        __component: "section.client",

        firstName: "",
        lastName: "",
        adress: "",
      },
    ],
  });
  const [state, setState] = useState({
    visible,
    modalType: "primary",
    checked: [],
  });
 

  const updatedOptions = client
    .filter((el) => el?.user_role === "client")
    .map((el) => ({
      value: el?.id || "", // Provide a default value for 'value' if 'id' is missing
      label:
        (el?.accountOverview?.[0]?.firstName || "") +
        " " +
        (el?.accountOverview?.[0]?.lastName || "") +
        (`   (${el?.email})` || ""),
    }));
  useEffect(() => {
    setOptions(updatedOptions?.reverse());
  }, [client, newCreatedUser]);
  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      setState({
        visible,
      });
    }

    return () => {
      unmounted = true;
      prev();
    };
  }, [visible]);

  const handleCancel = () => {
    onCancel();
  };
  const handleDeleteItem = (id) => {
    setSelectedArticles((prevState) => {
      if (prevState.length > 1) {
        const updatedArticles = prevState.filter((item) => item.id !== id);
        return updatedArticles;
      } else {
        // If there's only one article left, prevent deletion
        return prevState;
      }
    });
  };

  const isStep1Valid = () => {
    const {
      client_id,
      pickUpAddress,
      departDate,
      dropOfAddress,
      pickUpAcces,
      dropAcces,
    } = newreservation.data;

    const errors = {};

    if (!client_id) {
      errors.client_id = "Le client est requis.";
    }
    if (!pickUpAddress.Address) {
      errors.pickUpAddress = "L'adresse de prise en charge est requise.";
    }
    if (!departDate) {
      errors.departDate = "La date de départ est requise.";
    }
    if (!dropOfAddress.Address) {
      errors.dropOfAddress = "L'adresse de dépôt est requise.";
    }
    if (!pickUpAcces) {
      errors.pickUpAcces = "L'accès à la prise en charge est requis.";
    }
    if (!dropAcces) {
      errors.dropAcces = "L'accès au dépôt est requis.";
    }

    return errors;
  };
  // const settings = useSelector(
  //   (state) => state?.setting?.prices?.data[0]?.attributes
  // );
  // const calculateTotalVolume = (items) => {
  //   return items.reduce(
  //     (total, item) => total + item.count * item.item.volume,
  //     0
  //   );
  // };

  const calc = async () => {
    const result = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/calcul`,
      {
        distance: newreservation?.data?.distance,
        volume: newreservation?.data?.items,
        accessDepart: newreservation?.data?.pickUpAcces,
        accessArrivee: newreservation?.data?.dropAcces,
      }
    );
    return result.data;
  };

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // const commandData = await JSON.parse(localStorage.getItem("command"));
      // const originRef = await commandData?.pickUpAddress?.Address;
      // const destiantionRef = await commandData?.dropOfAddress?.Address;
      // await console.log(commandData.pickUpAddress.Address);

      const result = await calculateRoute({
        originRef: newreservation?.data?.pickUpAddress?.Address,
        destiantionRef: newreservation?.data?.dropOfAddress?.Address,
      });

      return result;
    };
    fetchData().catch((err) => console.log(err));

    // axios
    //   .post(`${process.env.REACT_APP_BACKUP_URL}/calcul`, {
    //     distance: newreservation?.data?.distance,
    //     volume: newreservation?.data?.items,
    //   })
    //   .then((res) => setMinPrice(res.data));
    // axios
    //   .post(`${process.env.REACT_APP_BASE_URL}/calcul`, {
    //     distance: newreservation?.data?.distance,
    //     volume: newreservation?.data?.items,
    //     accessDepart: newreservation?.data?.pickUpAcces,
    //     accessArrivee: newreservation?.data?.dropAcces,
    //   })
    //   .then((res) => setMaxPrice(res.data));
  }, []);
  async function calculateRoute({ originRef, destiantionRef }) {
    if (originRef === "" || destiantionRef === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    // let originPositionAddress = originPosition
    //   ? Geocode.fromLatLng(originPosition.lat, originPosition.lng)
    //   : null;

    // Geocode.fromLatLng(destinationPosition.lat, destinationPosition.lng).then(
    //   (response) =>
    //     setDestinationPositionAddress(response.results[0].formatted_address)
    // );
    // console.log(originRef, "++++++", destiantionRef);
    // console.log(destinationPositionAddress);

    const results = await directionsService.route({
      origin: originRef, //|| originPosition,
      destination: destiantionRef, // || destinationPosition ,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    // console.log(results);
    setNewreservation({
      ...newreservation,
      data: {
        ...newreservation?.data,
        distance: results.routes[0].legs[0].distance.value,
        duration: results.routes[0].legs[0].duration.text,
        pickUpAddress: {
          ...newreservation?.data?.pickUpAddress,
          coordonne: {
            lat: results.routes[0].legs[0].start_location.lat(),
            lng: results.routes[0].legs[0].start_location.lng(),
          },
        },
        dropOfAddress: {
          ...newreservation?.data?.dropOfAddress,
          coordonne: {
            lat: results.routes[0].legs[0].end_location.lat(),
            lng: results.routes[0].legs[0].end_location.lng(),
          },
        },
      },
    });
    // setDirectionsResponse(results);
    // setDistance(results.routes[0].legs[0].distance.value);
    // setDuration(results.routes[0].legs[0].duration.text);

    // setOriginPosition({
    //   lat: results.routes[0].legs[0].start_location.lat(),
    //   lng: results.routes[0].legs[0].start_location.lng(),
    // });

    // setDestinationPosition({
    //   lat: results.routes[0].legs[0].end_location.lat(),
    //   lng: results.routes[0].legs[0].end_location.lng(),
    // });

    // // results.routes[0].legs[0].end_location.lat();        end location lat
    // // results.routes[0].legs[0].end_location.lng();        end location lng

    // results.routes[0].legs[0].start_location.lat();         start location lat
    // results.routes[0].legs[0].start_location.lng();          start location lng

    // results.request.destination.query;
    // results.request.origin.query;
    // console.log(originPosition, destinationPosition);
  }
  useEffect(() => {
    const buttonVisible = hasFilledItem();
    setInputErrors({
      ...Inputerrors,
      articles: !buttonVisible ? "Merci d'ajouter quelques articles." : null,
    });
  }, [selectedArticles]);
  const hasFilledItem = () => {
    const selectedArticlesHasItem =
      selectedArticles.length > 0 &&
      selectedArticles.every((article) => article.item?.name?.trim() !== "");

    return selectedArticlesHasItem;
  };

  // steps
  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    const step1Errors = isStep1Valid(); // Get the validation errors
    if (Object.keys(step1Errors).length === 0) {
      calculateRoute({
        originRef: originRef.current.value,
        destiantionRef: destiantionRef.current.value,
      });

      setCurrent(current + 1);
    } else {
      setInputErrors(step1Errors); // Set the validation errors to the state
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  // stepssss
  const steps = [
    {
      title: " Détails de la livraison ",
      content: (
        <div className="add_reservation_container">
          <div className="create_reservation_client">
            <span>Client</span>
            <div className="create_agent_header_new_user">
              {/* <Select
              defaultValue={newreservation.data.client_id}
              placeholder="Selectez un client.."
              name="client"
              options={options}
              className="create_reservation_select"
              onSelect={(clientId) => {
                setInputErrors({ ...Inputerrors, client_id: null });
                setNewreservation({
                  ...newreservation,
                  data: {
                    ...newreservation.data,
                    client_id: clientId,
                  },
                });
              }}
            /> */}
              <AutoComplete
                className="create_reservation_select"
                options={options}
                onSelect={(clientId) => {
                  const selectedClient = updatedOptions.find(
                    (option) => option.value === clientId
                  );
                  setInputErrors({ ...Inputerrors, client_id: null });
                  setNewreservation({
                    ...newreservation,
                    data: {
                      ...newreservation.data,
                      client_id: clientId,
                    },
                  });
                  setSelectedLabel(selectedClient.label);
                }}
                placeholder="Saisir le nom de client ..."
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e)}
                filterOption={(inputValue, option) =>
                  option.label
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              />
              <Button
                onClick={() => setShowCreateNewClient(!showCreateNewClient)}
              >
                Créer nouveau client
              </Button>
            </div>

            {Inputerrors.client_id && (
              <span className="error__message" style={{ color: "red" }}>
                {Inputerrors.client_id}
              </span>
            )}
          </div>
          {showCreateNewClient && (
            <div className="create_new_client_form">
              <CreateNewUser
                visible={showCreateNewClient}
                onCancel={setShowCreateNewClient}
                setnewUser={setnewUser}
                newUser={newUser}
              />
            </div>
          )}
          <div className="create_reservation_client_items">
            <span>Adresse de Départ</span>
            <div className="create_reservation_client_gap">
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setBounds({
                    // Define the boundaries of Île-de-France region
                    east: 2.8666,
                    west: 2.2241,
                    north: 49.0391,
                    south: 48.3647,
                  });
                }}
                options={{
                  strictBounds: true, // Restrict results to the specified bounds
                  types: ["address"], // Restrict results to only show addresses
                }}
                style={{ zIndex: 9999999999999, width: "100%" }}
                onPlaceChanged={() => {
                  setOriginState(originRef?.current?.value);

                  setNewreservation({
                    ...newreservation,
                    data: {
                      ...newreservation.data,
                      pickUpAddress: {
                        ...newreservation.data.pickUpAddress,
                        Address: originRef?.current?.value,
                      },
                    },
                  });
                  // clearRoute();
                  // calculateRoute();
                }}
              >
                <InputItem dir="auto">
                  {/* <InputIcon src={markerStep} /> */}
                  <InputDate
                    autocomplete={false}
                    name="number"
                    type="text"
                    className="inputt"
                    placeholder={
                      newreservation?.data?.pickUpAddress?.Address ||
                      "Adresse-départ"
                    }
                    ref={originRef}
                  />
                </InputItem>
              </Autocomplete>
              {/* <Input
                defaultValue={newreservation.data.pickUpAddress.Adress}
                placeholder="adresse de ramassage.."
                onChange={(e) => {
                  setInputErrors({ ...Inputerrors, pickUpAddress: null });
                  setNewreservation({
                    ...newreservation,
                    data: {
                      ...newreservation.data,
                      pickUpAddress: {
                        ...newreservation.data.pickUpAddress,
                        Address: e.target.value,
                      },
                    },
                  });
                }}
              /> */}
              {Inputerrors.pickUpAddress && (
                <span className="error__message" style={{ color: "red" }}>
                  {Inputerrors.pickUpAddress}
                </span>
              )}
            </div>
            <div className="create_reservation_client_gap ">
              <span>Date de Départ</span>
              <DateTimeInput
                command={newreservation}
                setCommand={setNewreservation}
              />
              {Inputerrors.departDate && (
                <span className="error__message" style={{ color: "red" }}>
                  {Inputerrors.departDate}
                </span>
              )}
            </div>
          </div>
          <div className="create_reservation_details">
            <div className="create_reservation_client_items">
              <span>Adresse d'Arrivée</span>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setBounds({
                    // Define the approximate boundaries of DTpe
                    east: 39.6494, // Easternmost point
                    west: -9.8274, // Westernmost point
                    north: 71.1855, // Northernmost point
                    south: 35.3964, // Southernmost point
                  });
                }}
                options={{
                  componentRestrictions: {
                    country: ["fr", "lux", "bel", "nld", "deu", "ita", "ch"],
                  },
                  strictBounds: false, // Restrict results to the specified bounds
                  types: ["address"], // Restrict results to only show addresses
                }}
                style={{ zIndex: 9999999999999, width: "100%" }}
                onPlaceChanged={() => {
                  setDestiantionState(destiantionRef?.current?.value);
                  setNewreservation({
                    ...newreservation,
                    data: {
                      ...newreservation.data,
                      dropOfAddress: {
                        ...newreservation.data.pickUpAddress,
                        Address: destiantionRef?.current?.value,
                      },
                    },
                  });
                  // clearRoute();
                  // calculateRoute();
                }}
              >
                <InputItem dir="auto">
                  {/* <InputIcon src={markerStep} /> */}
                  <InputDate
                    autocomplete={false}
                    name="number"
                    type="text"
                    className="inputt"
                    placeholder={
                      newreservation?.data?.dropOfAddress?.Address ||
                      "Adresse-arrivée"
                    }
                    ref={destiantionRef}
                  />
                </InputItem>
              </Autocomplete>
            </div>
            {Inputerrors.dropOfAddress && (
              <span className="error__message" style={{ color: "red" }}>
                {Inputerrors.dropOfAddress}
              </span>
            )}
          </div>{" "}
          <div className="create_reservation_client_items">
            {" "}
            <span>Accés</span>{" "}
            <div className="articles__wrapper">
              {" "}
              <Select
                defaultValue={newreservation.data.pickUpAcces.options}
                options={[
                  { value: "Camion", label: "Au pied de Camion" },
                  { value: "Rez-de-chaussée", label: "Rez-de-chaussée" },
                  {
                    value: "Monter",
                    label: "Monter",
                  },
                  {
                    value: "Ascenseur",
                    label: "Ascenseur",
                  },
                ]}
                placeholder={"Accés de ramassage..."}
                className="create_reservation_select"
                onSelect={(e) => {
                  setInputErrors({ ...Inputerrors, pickUpAcces: null });
                  setNewreservation({
                    ...newreservation,
                    data: {
                      ...newreservation.data,
                      pickUpAcces: {
                        ...newreservation.data.pickUpAcces,
                        options: e,
                      },
                    },
                  });
                  setAccess({ ...access, pickUp: e });
                }}
              />
              {Inputerrors.pickUpAcces && (
                <span className="error__message" style={{ color: "red" }}>
                  {Inputerrors.pickUpAcces}
                </span>
              )}
              {access.pickUp === "Rez-de-chaussée" ? null : (
                <Input
                  type="number"
                  defaultValue={1}
                  className="create_reservation_select_number"
                  min={1}
                  size="middle"
                  onChange={(e) =>
                    setNewreservation({
                      ...newreservation,
                      data: {
                        ...newreservation.data,
                        pickUpAcces: {
                          ...newreservation.data.pickUpAcces,
                          floor: e.target.value,
                        },
                      },
                    })
                  }
                />
              )}
            </div>
          </div>
          <div className="articles__wrapper">
            {" "}
            <Select
              defaultValue={newreservation.data.dropAcces.options}
              options={[
                { value: "Camion", label: "Au pied de Camion" },
                { value: "Rez-de-chaussée", label: "Rez-de-chaussée" },
                {
                  value: "Monter",
                  label: "Monter",
                },
                {
                  value: "Ascenseur",
                  label: "Ascenseur",
                },
              ]}
              placeholder={"Accés de dépot..."}
              className="create_reservation_select"
              onSelect={(e) => {
                setInputErrors({ ...Inputerrors, dropAcces: null });
                setNewreservation({
                  ...newreservation,
                  data: {
                    ...newreservation.data,
                    dropAcces: {
                      ...newreservation.data.dropAcces,
                      options: e,
                    },
                  },
                });
                setAccess({ ...access, drop: e });
              }}
            />
            {Inputerrors.dropAcces && (
              <span className="error__message" style={{ color: "red" }}>
                {Inputerrors.dropAcces}
              </span>
            )}
            {access.drop === "Rez-de-chaussée" ? null : (
              <Input
                type="number"
                defaultValue={1}
                className="create_reservation_select_number"
                min={1}
                size="middle"
                onChange={(e) =>
                  setNewreservation({
                    ...newreservation,
                    data: {
                      ...newreservation.data,
                      dropAcces: {
                        ...newreservation.data.dropAcces,
                        floor: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
          </div>
        </div>
      ),
    },

    {
      title: "Ajouter un produit",
      content: (
        <div className="add_reservation_container">
          <span>Article</span>
          <div className="create_reservation_article">
            {selectedArticles.map((el, i) => (
              <div className="articles__wrapper" key={el.id}>
                <Input
                  type="number"
                  defaultValue={1}
                  className="create_reservation_select_number"
                  min={1}
                  onChange={(e) => {
                    setSelectedArticles((prevSelectedArticles) => {
                      const updatedArticles = prevSelectedArticles.map(
                        (item) => {
                          if (item.id === el.id) {
                            return {
                              ...item,
                              quant: e.target.value,
                            };
                          }
                          return item;
                        }
                      );
                      return updatedArticles;
                    });
                  }}
                />
                {selectedArticles.length > 1 && (
                  <Button danger onClick={() => handleDeleteItem(el.id)}>
                    Supprimer
                  </Button>
                )}
              </div>
            ))}

            {!hasFilledItem() && (
              <span style={{ color: "red" }}>{Inputerrors.articles}</span>
            )}
          </div>{" "}
          <Button
            onClick={() => {
              setSelectedArticles((prevSelectedArticles) => [
                ...prevSelectedArticles,
                {
                  item: {
                    name: "",
                    volume: 0,
                    category: null,
                    weight: 0,
                  },
                  quant: null,
                },
              ]);
            }}
          >
            Ajouter
          </Button>
          <div className="create_reservation_details">
            <span>Note</span>
            <Input
              placeholder="votre note ici.."
              onChange={(e) =>
                setNewreservation({
                  ...newreservation,
                  data: {
                    ...newreservation.data,
                    itemsNote: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="create_reservation_details">
            <span>Methode de payemant</span>
            <span>Credit: </span>
            <Switch
              checked={isCreditMode}
              onChange={handleCreditSwitchChange}
            />
            <span>Livraison: </span>
            <Switch
              checked={isLivraisonMode}
              onChange={handleLivraisonSwitchChange}
            />
          </div>
        </div>
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle = {
    width: "100%",
  };

  return (
    <Modal
      type={state.modalType}
      title="Créer une nouvelle Réservation"
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="reservation-modal">
        <form
          className="create_reservation_form"
          onSubmit={handleSubmit(() => onSubmitHandler(newreservation))}
        >
          <Steps current={current} items={items} />
          <div style={contentStyle}>{steps[current]?.content}</div>

          {current < steps.length - 1 && (
            <div className="Horizontal_btn">
              <Button
                size="default"
                type="white"
                key="backk"
                outlined
                onClick={handleCancel}
              >
                Annuler
              </Button>{" "}
              <Button
                className="btn_Suivant"
                size="default"
                type="primary"
                key="submit"
                onClick={() => next()}
              >
                Suivant
              </Button>
            </div>
          )}
          <div className="Horizontal_btn">
            {current > 0 && (
              <>
                <Button
                  style={{ margin: "0 8px" }}
                  onClick={() => prev()}
                  className="btn_Suivant"
                >
                  Retour
                </Button>
              </>
            )}

            {current === steps.length - 1 && (
              <>
                {/* <span style={{ color: "red" }}>Ajoutez au moins un article</span> */}

                {!hasFilledItem() ? (
                  <span style={{ color: "red" }}>
                    Ajoutez au moins un article
                  </span>
                ) : (
                  <button className="btn_ADD" type="submit" key="submit">
                    Enregistré
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
}

CreateReservation.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};
export const InputItem = Styled.div`
  position: relative;
  width: 301px;
`;
const InputDate = Styled.input`
  padding: 10px;
  height: 50px;
  width: 100%;
  border-radius: 10px;
  background-color: rgba(100, 100, 100, 0.1);
  padding-left: 10px;
  border: transparent;
  font-size: 16px;
  @media (max-width: 744px) {
    height: 40px;
  }
`;
export default CreateReservation;
