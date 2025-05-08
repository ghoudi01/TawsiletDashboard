import React, { useState, useEffect } from "react";
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
  Modal,
  Spin,
} from "antd";

import propTypes from "prop-types";
import { Button } from "../../../components/buttons/buttons";

import { CheckboxGroup } from "../../../components/checkbox/checkbox";
import { BasicFormWrapper } from "../../styled";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  getusers,
  updateUser,
} from "../../../redux/User/userSlice";

import {
  createNewReservation,
  getReservations,
  updateReservation,
} from "../../../redux/reservations/reservationSlice.js";
import { AddProductForm } from "../../livreur/style";
import Img from "../../../imageZoom/Img";

function ViewDetails({ visible, onCancel, record }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.getted);
  const [fetchedUser, setFetchedUser] = useState();

  const [form] = Form.useForm();
  useEffect(() => {
    if (record) {
      // Dispatch action to get user by ID
      dispatch(getUserById(record));
    }
  }, [record, dispatch]);

  useEffect(() => {
    // Update fetchedUser when user data changes
    if (user) {
      setFetchedUser(user);
    }
  }, [user]);

  const [state, setState] = useState({
    visible,
    modalType: "primary",
    checked: [],
  });

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      setState({
        visible,
      });
    }

    return () => {
      unmounted = true;
    };
  }, [visible]);

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      type={state.modalType}
      // title={
      //   driverDetails
      //     ? driverDetails?.firstName +
      //       " " +
      //       driverDetails?.lastName
      //     : ""
      // }
      visible={state.visible}
      footer={null}
      onCancel={handleCancel}
    >
      <div className="reservation-modal">
        <h1>
          {fetchedUser?.company_id?.accountOverview[0]
            ?.nameOwner
            ? fetchedUser?.company_id?.accountOverview[0]
                ?.nameOwner
            : "Pas de société"}
        </h1>
        <p className="sectionModal">Information du Chauffeur</p>
        <div className="mainComponentContainers">
          <div className="componentContainer">
            <p className="componentTitle">Nom complet</p>
            <p className="componentContent">
              {fetchedUser ? fetchedUser?.firstName : "Nom"}{" "}
              {fetchedUser
                ? fetchedUser?.lastName
                : "Prénom"}
            </p>
          </div>

          <div className="componentContainer">
            <p className="componentTitle">Numéro de téléphone</p>
            <p className="componentContent">
              {fetchedUser?.phoneNumber
                ? fetchedUser?.phoneNumber
                : "Pas de numéro disponible"}
            </p>
          </div>

          <div className="componentContainer">
            <p className="componentTitle">Adresse e-mail</p>
            <p className="componentContent">{fetchedUser?.email}</p>
          </div>
          <div className="componentContainer">
            <p className="componentTitle">Numéro d'identité</p>
            <p className="componentContent">
              {fetchedUser?.cin
                ? fetchedUser?.cin
                : "Pas de numéro disponible"}
            </p>
          </div>
          <div className="componentContainer">
            <p className="componentTitle">Numéro permis</p>
            <p className="componentContent">
              {fetchedUser?.licenceNumber
                ? fetchedUser?.licenceNumber
                : "Pas de numéro disponible"}
            </p>
          </div>
          <div className="componentContainer">
            <p className="componentTitle">Classe permis</p>
            <p className="componentContent">
              {fetchedUser?.licenceClass
                ? fetchedUser?.licenceClass
                : "Pas de numéro disponible"}
            </p>
          </div>
        </div>
        <p className="sectionModal">Carte Identité</p>
        <AddProductForm>
          <div className="add-product-block ">
            {/* <img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Carte_d%27identit%C3%A9_tunisienne_recto2.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Carte_d%27identit%C3%A9_tunisienne_verso.jpg" /> */}

            <Img
              url={[
                {
                  secure_url:
                    "https://upload.wikimedia.org/wikipedia/commons/e/e2/Carte_d%27identit%C3%A9_tunisienne_recto2.jpg",
                },
                {
                  secure_url:
                    "https://upload.wikimedia.org/wikipedia/commons/a/a4/Carte_d%27identit%C3%A9_tunisienne_verso.jpg",
                },
              ]}
            />
          </div>
        </AddProductForm>
        <p className="sectionModal">Identité Permis</p>
        <AddProductForm>
          <div className="add-product-block ">
            <Img
              url={[
                {
                  secure_url:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWEA9dY2MdbwuLxAko8WO-rp87DvzFFUjXvA&usqp=CAU",
                },
              ]}
            />
            {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWEA9dY2MdbwuLxAko8WO-rp87DvzFFUjXvA&usqp=CAU" /> */}
          </div>
        </AddProductForm>

        <p className="sectionModal">Historique des commandes</p>
      </div>
    </Modal>
  );
}

ViewDetails.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ViewDetails;
