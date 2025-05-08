import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Spin } from "antd";
import Revalidate from "./Revalidate";
import { useDispatch } from "react-redux";
import { logout } from "../redux/User/userSlice";

function ValidationOverlay({validation}) {
  const dispatch = useDispatch();
  const message = useSelector(
    (state) => state.user.currentUser?.companies?.[0]?.validation?.description
  );

  // const validation = useSelector(
  //   (state) => state.user?.currentUser?.companies?.[0]?.confirmed
  // );
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {}, [validation]);

  return (
    <>
      {validation === null ? (
        <Spin size="large" />
      ) : validation === "waiting" ? (
        <>
          <div className="validate_alert_message">
            <Alert
              description={
                message ? message : "Votre compte est en cours de validation."
              }
              type="warning"
              showIcon
            />
          </div>

          <h1>
            Votre compte est en cours de validation par un administrateur!
          </h1>

          <div className="validation_image_">
            <img src="../../images/notValidUser.png" alt="" />
          </div>
          <Button
            size="default"
            type="primary"
            onClick={() => dispatch(logout())}
          >
            Retourner à la page d'accueil.
          </Button>
        </>
      ) : (
        <>
          <div className="validate_alert_message">
            <Alert
              description={
                message
                  ? message
                  : "Votre compte est invalide, merci de contacter un admin pour plus de détails."
                  // Vous pouvez changer vos informations à partir du formulaire ci-dessous.
              }
              type="error"
              showIcon
            />
          </div>

          <Revalidate />
        </>
      )}
    </>
  );
}

export default ValidationOverlay;
