import React, { useEffect, useState } from "react";
import { Badge } from "antd";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";
import { useSelector } from "react-redux";
import { AtbdTopDropdwon } from "./auth-info-style";
import { Popover } from "../../popup/popup";
import Heading from "../../heading/heading";
import {
  getNotification,
  isReadNotification,
} from "../../../redux/notifications/notificationSlice";
import { useDispatch } from "react-redux";

function NotificationBox() {
  const dispatch = useDispatch();
  const [radar, setRadar] = useState(false);
  const [ping, setPing] = useState(false);
  const { rtl } = useSelector((state) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });
  const currentUser = useSelector((state) => state?.user?.currentUser);

  const notifications = useSelector(
    (state) => state?.notification?.notifications?.data
  );

  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (notifications) {
      const count = notifications?.filter(
        (el) => el?.isRead === false
      );
      setNotificationCount(count.length);
    }
  }, [notifications]);
  useEffect(() => {
    if (radar) {
      dispatch(getNotification({ id: currentUser?.documentId }));
    } else {
      setRadar(true);
    }
  }, [ping]);

  function calculateTimeAgo(creationDate) {
    const now = new Date();
    const creationDateTime = new Date(creationDate);
    const timeDifferenceInSeconds = Math.floor((now - creationDateTime) / 1000);

    if (timeDifferenceInSeconds < 60) {
      return "Il y a quelques secondes";
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
    }
  }
  function translateStatus(status) {
    switch (status) {
      case "expired": //rouge
        return "expirera dans";
      case "processing":
        return "en cours de traitement";
      case "completed" /* vert */:
        return "terminé la commande Ref:";
      case "created": //vert
        return "créé la commande Ref:";
      case "updated": //oranger
        return "a été modifié Ref:";
      case "canceled": //rouge
        return "annulé la commande Ref:";
      case "dispatched": //blue
        return "vous assigné la commande Ref:";
      default:
        return "Vous avez une notification";
    }
  }
  function icons(status) {
    switch (status) {
      case "expired": //rouge
        return { icon: "alert-circle", color: "red" };
      case "completed" /* vert */:
        return { icon: "check-circle", color: "green" };
      case "created": //vert
        return { icon: "check-circle", color: "green" };
      case "updated": //oranger
        return { icon: "alert-triangle", color: "orange" };
      case "canceled": //rouge
        return { icon: "check-circle", color: "green" };
      case "dispatched": //blue
        return { icon: "info", color: "blue" };
      default:
        return "Vous avez une notification";
    }
  }
  function renderThumb({ style, ...props }) {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: "#F1F2F6",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  }

  const renderTrackVertical = () => {
    const thumbStyle = {
      position: "absolute",
      width: "6px",
      transition: "opacity 200ms ease 0s",
      opacity: 0,
      [rtl ? "left" : "right"]: "2px",
      bottom: "2px",
      top: "2px",
      borderRadius: "3px",
    };
    return <div className="hello" style={thumbStyle} />;
  };

  function renderView({ style, ...props }) {
    const customStyle = {
      marginRight: rtl && "auto",
      [rtl ? "marginLeft" : "marginRight"]: "-17px",
    };
    return <div {...props} style={{ ...style, ...customStyle }} />;
  }

  renderThumb.propTypes = {
    style: PropTypes.shape(PropTypes.object),
  };

  renderView.propTypes = {
    style: PropTypes.shape(PropTypes.object),
  };

  const content = (
    <AtbdTopDropdwon
      className="atbd-top-dropdwon"
      style={{ minHeight: "50vh" }}
    >
      <Heading as="h5" className="atbd-top-dropdwon__title">
        <span className="title-text">Notifications</span>
        <Badge className="badge-success" count={notificationCount} />
      </Heading>
      <Scrollbars
        // autoHeight
        autoHide
        renderThumbVertical={renderThumb}
        renderView={renderView}
        renderTrackVertical={renderTrackVertical}
        style={{ minHeight: "50vh", maxHeight: "50vh" }}
      >
        <ul className="atbd-top-dropdwon__nav notification-list">
          {notifications?.map((el) => (
            <li
              onClick={() =>
                dispatch(isReadNotification(el?.documentId)).then(() => setPing(!ping))
              }
            >
              <Link to={`/admin/details/${el?.command?.documentId}`}>
                <div className="atbd-top-dropdwon__content notifications">
                  <div className="notification-icon">
                    <FeatherIcon
                      icon={icons(el?.notification_type).icon}
                      stroke={icons(el?.notification_type).color}
                    />
                  </div>
                  <div className="notification-content d-flex">
                    <div className="notification-text">
                      {translateStatus(el?.notification_type) ===
                      "expirera dans" ? (
                        <span className="notification_text_message">
                          <span>{el?.sendFrom?.name} </span>{" "}
                          {el?.sendFrom?.type}{" "}
                          {translateStatus(el?.notification_type)}{" "}
                          {el?.sendFrom?.expiredIn} jours
                        </span>
                      ) : (
                        <span className="notification_text_message">
                          {el?.description}{" "}
                        </span>
                      )}

                      <p>{calculateTimeAgo(el?.createdAt)}</p>
                    </div>
                    <div className="notification-status">
                      {!el?.isRead && <Badge dot />}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Scrollbars>
    </AtbdTopDropdwon>
  );

  return (
    <div className="notification">
      <Popover placement="bottomLeft" content={content} action="click">
        <Badge dot offset={[-8, -5]}>
          <Link to="#" className="head-example">
            <FeatherIcon icon="bell" size={20} />
          </Link>
        </Badge>
      </Popover>
    </div>
  );
}

export default NotificationBox;
