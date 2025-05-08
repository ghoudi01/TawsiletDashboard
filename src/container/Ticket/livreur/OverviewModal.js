import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import ListModal from "./ListModal";

const OverviewModal = ({ open, setOpen, modalId }) => {
  const dispatch = useDispatch();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        title="                    "
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        className="clientViewModal"
      >
        <h1>
          {modalId
            ? ` ${modalId?.firstName}  ${modalId?.lastName}`
            : "user name"}
        </h1>
        <p className="sectionModal">Information du ticket</p>
        <div className="mainComponentContainers">
          <div className="componentContainer">
            <p className="componentTitle">Nom complet</p>
            <p className="componentContent">
              {modalId ? modalId?.firstName : "Nom"}
              {modalId ? modalId?.lastName : "Prénom"}
            </p>
          </div>

          <div className="componentContainer">
            <p className="componentTitle">Numéro de téléphone</p>
            <p className="componentContent">
              {modalId?.phoneNumber
                ? modalId?.phoneNumber
                : "Pas de numéro disponible"}
            </p>
          </div>

          <div className="componentContainer">
            <p className="componentTitle">Adresse e-mail</p>
            <p className="componentContent">{modalId?.email}</p>
          </div>

          
        </div>

        <p className="sectionModal">Historique des commandes</p>
        <h1>...</h1>
        {/* <ListModal user={modalId} /> */}
      </Modal>
    </>
  );
};

export default OverviewModal;
