import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getReservationById } from "../../redux/reservations/reservationSlice";
import FeatherIcon from "feather-icons-react";
import { CloseOutlined, PhoneOutlined } from "@ant-design/icons";
import { Dropdown } from "../dropdown/dropdown";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { getusers } from "../../redux/User/userSlice";
import AssigneDriver from "../../container/commandes/overview/AssigneDriver";
import ChangeDriverInfo from "../../container/commandes/overview/ChangeDriverInfo";
import ViewDetails from "../../container/commandes/overview/ViewDetails";
import ViewVehicule from "../../container/commandes/overview/VehiculeView";

import avatar from "../../static/img/avatarVehicule.png";
function ModalDash({ record, open, setOpen, setSelectedId, ping, setPing }) {
  const dispatch = useDispatch();

  const [driverId, setDriverId] = useState();

  const [changeModal, setChangeModal] = useState({
    changeDriver: false,
    changeInfo: false,
    viewInfo: false,
    viewVehicule: false,
  });
  const [details, setDetails] = useState({
    company_name: "",
    adresse_ramassage: "",
    adresse_depot: "",
    date: "",
    distance: "",
    duration: "",
    price: "",
    payType: "",
    firstname: "",
    lastname: "",
    driverPhone: "",
    driverEmail: "",
    items: null,
    company_details: {
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
    },
    vehicule_details: {
      mark: "",
      model: "",
      year: "",
      matriculation: "",
   
      color: "",
      assuranceDate: "",
    },
    driver_details: {
      id: "",
      email: "",
      confirmed: null,
      blocked: null,
      phoneNumber: "",
      user_role: "",
      firstName: "",
      lastName: "",
      cin: "",
      licenceNumber: "",
      licenceClass: "",
    },
    client_details: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      profile_picture: "",
    },
  });

  const [newRecord, setNewRecord] = useState(record);

  useEffect(() => {
   
    if (open) {
      dispatch(getReservationById(record?.id)).then((res) => {
        setNewRecord(res?.payload?.data);
        let result = res?.payload?.data;

        // setDriverId(newRecord?.driver_id?.id);
      });
    }
  }, [ping, open]);

  useEffect(() => {
    setDetails({
      driverId: newRecord?.driver_id?.id,
      company_name: newRecord?.company_id?.name,
      adresse_ramassage: newRecord?.pickUpAddress?.Address,
      SpecificNote: newRecord?.SpecificNote,
      adresse_depot: newRecord?.dropOfAddress?.Address,
      date: newRecord?.departDate,
      heure: newRecord?.deparTime,
      distance: newRecord?.distance,
      duration: newRecord?.duration,
      price: newRecord?.totalPrice,
      payType: newRecord?.payType,
      firstname: newRecord?.driver_id?.firstName,
      lastname: newRecord?.driver_id?.lastName,
      driverPhone: newRecord?.driver_id?.phoneNumber,
      driverEmail: newRecord?.driver_id?.email,
      items: newRecord?.items,
      company_details: {
        name: newRecord?.company_id?.attributes?.name,
        address: newRecord?.company_id?.attributes?.address,
        phoneNumber: newRecord?.company_id?.phoneNumber,
        email: newRecord?.company_id?.email,
      },
      vehicule_details: {
        mark: newRecord?.vehicule_id?.mark,
        model: newRecord?.vehicule_id?.model,
        year: newRecord?.vehicule_id?.year,
        matriculation: newRecord?.vehicule_id?.matriculation,
     
        color: newRecord?.vehicule_id?.color,
        assuranceDate: newRecord?.vehicule_id?.assuranceDate,
      },
      driver_details: {
        id: newRecord?.driver_id?.id,
        email: newRecord?.driver_id?.email,
        confirmed: newRecord?.driver_id?.confirmed,
        blocked: newRecord?.driver_id?.blocked,
        phoneNumber: newRecord?.driver_id?.phoneNumber,
        user_role: newRecord?.driver_id?.user_role,
        firstName: newRecord?.driver_id?.firstName,
        lastName: newRecord?.driver_id?.lastName,
        cin: newRecord?.driver_id?.cin,
        licenceNumber: newRecord?.driver_id?.licenceNumber,
        licenceClass: newRecord?.driver_id?.licenceClass,
      },
      client_details: {
        firstName: newRecord?.client_id?.firstName,
        lastName: newRecord?.client_id?.lastName,
        phoneNumber: newRecord?.client_id?.phoneNumber,
        email: newRecord?.client_id?.email,
        profile_picture: newRecord?.client_id?.profilePicture?.url,
      },
    });
  }, [newRecord]);

  const handleCancelChange = () => {
    setChangeModal({
      ...changeModal,
      changeDriver: false,
      changeInfo: false,
      viewInfo: false,
      viewVehicule: false,
    });
  };
  const handleCancel = () => {
    setOpen(false);
    setSelectedId(null);
  };

  return (
    <>
      <Modal
        open={open}
        onOk={handleCancel}
        onCancel={handleCancel}
        closable={false}
        cancelText="Fermer"
      >
        <div className="modal__header">
          <div className="modal__header__left">
            <h3 className="modaldash_title">
              Réservation N:{record?.refNumber}
            </h3>
          </div>
          <div className="modal__header__right">
            <CloseOutlined
            
              className="modal_close_btn"
              onClick={() => handleCancel()}
            />
          </div>
        </div>{" "}
        <div className="modal__body">
          <>
            {record?.company_id && <h1>{record?.company_id?.name}</h1>}

            <div className="modal__adresse_details">
              <div className="modal__adresse_details_ramassage">
                <div>
                  {" "}
                  <h3 className="modal_content_title">Adresse de départ:</h3>
                  <h3>{record?.pickUpAddress?.Address}</h3>
                </div>
                <div>
                  {" "}
                  <h3 className="modal_content_title">Date:</h3>
                  <h3>{record?.departDate}</h3>
                </div>

                <div>
                  {" "}
                  <h3 className="modal_content_title">
                    Distance de la course:
                  </h3>
                  <h3>{record?.distance / 1000} Km</h3>
                </div>

                <div>
                  {" "}
                  <h3 className="modal_content_title">Prix:</h3>
                  <h3>
                    {record?.totalPrice === null ? "--" : record?.totalPrice} TND
                  </h3>
                </div>
              </div>
              <div className="modal__adresse_details_depot">
                <div>
                  {" "}
                  <h3 className="modal_content_title">Adresse de dépot:</h3>
                  <h3>{record?.dropOfAddress?.Address}</h3>
                </div>
                <div>
                  {" "}
                  <h3 className="modal_content_title">Heure:</h3>
                  <h3>{record?.deparTime?.slice(0, 5)}</h3>
                </div>
                <div>
                  {" "}
                  <h3 className="modal_content_title">Durée de la course:</h3>
                  <h3>
                    {record?.duration === null ? "--" : record?.duration} min
                  </h3>
                </div>
                <div>
                  {" "}
                  <h3 className="modal_content_title">Mode de paiement :</h3>
                  <h3>{record?.payType === null ? "--" : record?.payType}</h3>
                </div>
              </div>
            </div>
            {record?.client_id && (
              <>
                <h3>Client</h3>
                <div className="modal__info_driver border_style">
                  <div className="modal_info_items">
                    {record?.client_id?.profilePicture ? (
                      <img
                        src={`${record?.client_id?.profilePicture.url}`}
                        alt="Client Profile"
                      />
                    ) : (
                      <img src={avatar} alt="Client Profile" />
                    )}
                  </div>
                  <div className="modal_info_items with-padding">
                    <p>
                      {record.client_id.firstName} {record.client_id.lastName}
                    </p>
                    <p>{record.client_id.email}</p>
                  </div>
                  {record.client_id.phoneNumber && (
                    <div className="modal_info_items">
                      <h3>Numéro de téléphone</h3>
                      <p>{record.client_id.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {record?.driver_id?.firstName && record?.driver_id?.lastName && (
              <>
                <h3>Chauffeurs</h3>
                <div className="modal__info_driver border_style">
                  <div className="modal_info_items">
                    <img src="../../images/Avatar.svg" alt="" />
                  </div>
                  <div className="modal_info_items with-padding">
                    <p>
                      {record?.driver_id?.firstName}{" "}
                      {record?.driver_id?.lastName}
                    </p>
                    <p style={{ color: "green" }}>Active</p>
                  </div>
                  {record?.driver_id?.phoneNumber && (
                    <div className="modal_info_items">
                      <h3>Numéro de téléphone</h3>
                      <p>{record?.driver_id?.phoneNumber}</p>
                    </div>
                  )}
                  {record?.driver_id?.email && (
                    <div className="modal_info_items">
                      <h3>Adresse e-mail</h3>
                      <p>{record?.driver_id?.email.substring(0, 10) + "..."}</p>
                    </div>
                  )}
                  <div className="modal_info_items">
                    <PhoneOutlined />
                  </div>
                  <Dropdown
                    className="wide-dropdwon"
                    content={
                      <>
                        <Link
                          to="#"
                          onClick={() => {
                            setChangeModal({
                              ...changeModal,
                              changeDriver: true,
                            });
                          }}
                        >
                          {" "}
                          Changer Chauffeur{" "}
                        </Link>
                        {/* <Link
                          to="#"
                          onClick={() => {
                            setChangeModal({
                              ...changeModal,
                              changeInfo: true,
                            });
                            setDriverId(details?.driver_id);
                          }}
                        >
                          {" "}
                          Mettre à jour Coordonnées{" "}
                        </Link> */}
                        <Link
                          to="#"
                          onClick={() => {
                            setChangeModal({
                              ...changeModal,
                              viewInfo: true,
                            });
                          }}
                        >
                          Afficher
                        </Link>
                      </>
                    }
                  >
                    <Link to="#">
                      <FeatherIcon icon="more-horizontal" size={18} />
                    </Link>
                  </Dropdown>
                </div>
              </>
            )}
            {details?.vehicule_details?.mark && (
              <>
                <h3>Véhicule</h3>
                <div className="modal__info_driver border_style">
                  <div className="modal_info_items">
                    <img src="../../images/Brand-Logo.png" alt="" />
                  </div>
                  <div className="modal_info_items">
                    <h3>
                      {details?.vehicule_details?.mark}{" "}
                      {details?.vehicule_details?.model}{" "}
                      {details?.vehicule_details?.year}
                    </h3>
                    <p style={{ color: "green" }}>Active</p>
                  </div>
                  {details?.company_details?.address && (
                    <div className="modal_info_items">
                      <h3>Immatriculation</h3>
                      <p>{details?.vehicule_details?.matriculation}</p>
                    </div>
                  )}

                 
                  <Dropdown
                    className="wide-dropdwon"
                    content={
                      <>
                        <Link
                          to="#"
                          onClick={() => {
                            setChangeModal({
                              ...changeModal,
                              viewVehicule: true,
                            });
                          }}
                        >
                          Afficher
                        </Link>
                      </>
                    }
                  >
                    <Link to="#">
                      <FeatherIcon icon="more-horizontal" size={18} />
                    </Link>
                  </Dropdown>
                </div>
              </>
            )}
            {details?.company_details?.name && (
              <>
                <h3>Societé</h3>
                <div className="modal__info_driver border_style">
                  <div className="modal_info_items">
                    <img src="../../images/Brand-Logo.svg" alt="" />
                  </div>
                  <div className="modal_info_items">
                    <h3>{details?.company_details?.name}</h3>
                    <p style={{ color: "green" }}>Active</p>
                  </div>
                  {details?.company_details?.address && (
                    <div className="modal_info_items">
                      <h3>Adresse</h3>
                      <p>{details?.company_details?.address}</p>
                    </div>
                  )}

                  {details.company_details.phoneNumber && (
                    <div className="modal_info_items">
                      <h3>Numéro de téléphone</h3>
                      <p>{details?.company_details?.phoneNumber}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {details?.items && details?.items.length > 0 && (
              <>
                <h3>Information des commandes</h3>
                <div className="details_product_list">
                  <h3>Produits</h3>
                  <div className="products_list">
                    {details?.items?.map((item, index) => (
                      <div className="products_list_item" key={index}>
                        <h3 className="item_text">{item?.item?.name}</h3>
                        <h3 className="item_count">x{item?.quant}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {details?.items && details?.items.length === 0 && (
              <div className="note_reservation">
                <h3>Aucune commande trouvée.</h3>
              </div>
            )}

            <h3>Note</h3>
            <div className="note_reservation">
              <p>
                {details.SpecificNote
                  ? details.SpecificNote
                  : "Faites attention lorsque vous déplacez ces articles."}
              </p>
            </div>
          </>
        </div>
      </Modal>

      <>
        <AssigneDriver
          record={newRecord}
          visible={changeModal.changeDriver}
          onCancel={handleCancelChange}
          setPing={setPing}
          ping={ping}
        />
        {/* <ChangeDriverInfo
          record={driverId}
          visible={changeModal.changeInfo}
          onCancel={handleCancelChange}
        /> */}
        <ViewDetails
          record={details.driver_details.id}
          visible={changeModal.viewInfo}
          onCancel={handleCancelChange}
        />
        <ViewVehicule
          record={details.vehicule_details}
          visible={changeModal.viewVehicule}
          onCancel={handleCancelChange}
        />
      </>
    </>
  );
}

export default ModalDash;
