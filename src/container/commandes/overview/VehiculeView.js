import React, { useState, useEffect } from "react";
import { Form, message, Modal } from "antd";
import propTypes from "prop-types";

import styled from "styled-components";
import VehiculeOne from "../../../static/img/Vehicule2.png";

import { Cards } from "../../../components/cards/frame/cards-frame";

import VehiculeTwo from "../../../static/img/Vehicule4.png";

import grayCardOne from "../../../static/img/logo1.png";
import grayCardTwo from "../../../static/img/logo2.png";
import AssuranceCard from "../../../static/img/logo3.png";
import Green from "../../../static/img/activ.png";
import Join from "../../../static/img/link-variant.png";
import SelectGm from "../../../selectGm/SelectGm";
import { useDispatch } from "react-redux";
import {
  getVehicule,
  updateVehicule,
} from "../../../redux/vehicule/vehiculeSlice";
import { AddProductForm } from "../../livreur/style";
import Img from "../../../imageZoom/Img";

function ViewVehicule({ visible, onCancel, record }) {



  const [form] = Form.useForm();

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

  const handleOk = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel(false);
  };

  //// validation //////////////
  const dispatch = useDispatch();
  const [selectOptions, setSelectOptions] = useState([
    { value: "valid", label: "Valider" },
    { value: "invalid", label: "Réfuser" },
  ]);
  const [refusText, setRefusText] = useState("");

  //--------------------//////

  return (
    <Modal
      type={state.modalType}
      title={<h3></h3>}
      visible={state.visible}
      width={800}
      footer={[<div key="1" className="project-modal-footer"></div>]}
      onCancel={handleCancel}
    >
      <div className="Informations_vehicule  ">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="top">
            {" "}
            <h1>
              Biffco Enterprises Ltd. <img src={Green} alt="" />
            </h1>
            <h3>Informations du véhicule</h3>
          </div>
        
        </div>

        <div className="details">
          <div className="Vehicule_details">
            <h3>Marque.véhicule</h3>
            <h5>{record.mark}</h5>
          </div>
          <div className="Vehicule_details">
            <h3>Modèle.véhicule</h3>
            <h5>{record.model}</h5>
          </div>
          <div className="Vehicule_details">
            <h3>Année</h3>
            <h5>{record.year}</h5>
          </div>
          <div className="Vehicule_details">
            <h3>Couleur</h3>
            <h5>{record.color}</h5>
          </div>
        </div>
        <div className="more">
          <div className="Vehicule_details">
            <h3>Immatriculation</h3>
            <h5>{record.matriculation}</h5>
          </div>
          <div className="Vehicule_details">
            <h3>Date d'assurance</h3>
            <h5>{record.assuranceDate}</h5>
          </div>
        </div>

        <div className="imgdriver">
          <p className="sectionModal">photos du véhicule </p>
          <AddProductForm>
            <div className="add-product-block ">
              <Img
                url={[
                  {
                    secure_url: VehiculeOne,
                  },
                  {
                    secure_url: VehiculeTwo,
                  },
                  {
                    secure_url: VehiculeOne,
                  },
                  {
                    secure_url: VehiculeTwo,
                  },
                ]}
              />
            </div>
          </AddProductForm>
         
        </div>

       

        <p className="sectionModal">Carte Grise </p>
        <AddProductForm>
          <div className="add-product-block ">
            <Img
              url={[
                {
                  secure_url: grayCardOne,
                },
                {
                  secure_url: grayCardTwo,
                },
              ]}
            />
          </div>
        </AddProductForm>
       

        <p className="sectionModal">Assurances</p>
        <AddProductForm>
          <div className="add-product-block ">
            <Img
              url={[
                {
                  secure_url: AssuranceCard,
                },
              ]}
            />
          </div>
        </AddProductForm>
      
      </div>
    </Modal>
  );
}

ViewVehicule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ViewVehicule;
export const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  text-align: left;
`;
