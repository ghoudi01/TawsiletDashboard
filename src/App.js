import OneSignal from "react-onesignal";
import notifSound from "./static/audio/notifSound.mp3";

import React, { useEffect, useState, useRef } from "react";
 
import { hot } from "react-hot-loader/root";
import {  useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  
} from "react-router-dom";
import { ConfigProvider } from "antd";
import Admin from "./routes/admin";
import Auth from "./routes/auth";
import "./static/css/style.css";
import config from "./config/config";
import ProtectedRoute from "./components/utilities/protectedRoute";
import "antd/dist/antd.less";
import { getCurrentUser, getusers } from "./redux/User/userSlice";
import { getReservations } from "./redux/reservations/reservationSlice";

import "./static/css/style.css";
import ForgotPassword from "./container/profile/authentication/overview/ForgotPassword";
import axios from "axios";
import {
  getNotification,
  trigerNotificationsReducer,
} from "./redux/notifications/notificationSlice";
import { getPrices } from "./redux/pricing/settingSlice";
import packageJson from "../package.json";
const { theme } = config;

function ProviderConfig() {
  const bustCache = () => {
    const links = document.querySelectorAll(
      'link[rel="stylesheet"], script[src]'
    );
    const timestamp = new Date().getTime();

    links.forEach((link) => {
      const href = link.getAttribute("href") || link.getAttribute("src");
      link.setAttribute("href", `${href}?v=${timestamp}`);
    });
  };

  useEffect(() => {
    // clearCaching();
    let version = localStorage.getItem("version");
    if (version != packageJson.version) {
      bustCache();
      localStorage.clear();
      localStorage.setItem("version", packageJson.version);
    }
  }, []);
  const { rtl, topMenu, darkMode } = useSelector((state) => {
    return {
      darkMode: state.ChangeLayoutMode.data,
      rtl: state.ChangeLayoutMode.rtlData,
      topMenu: state.ChangeLayoutMode.topMenu,
    };
  });
  const isLoggedIn = localStorage.getItem("token");
  const [path, setPath] = useState(window.location.pathname);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const [radar, setRadar] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getNotification({ id: currentUser?.documentId }));
      setRadar(true);
    }
  }, [currentUser?.id]);

  //----------------------onesignale----------------------------------------------

  const [notifTrigger, setNotifTrigger] = useState(false);

  const audioRef = useRef(null);

  const playSound = () => {
    audioRef.current.play();
  };

  // appId: "98d2fea4-c2aa-481f-8c11-052086f72209",
  // safari_web_id: "web.onesignal.auto.98d2fea4-c2aa-481f-8c11-052086f72209",

  useEffect(() => {
    const initializeOneSignal = async () => {
      const OneSignal = window.OneSignal || [];

      // Check if OneSignal is already initialized
      if (OneSignal.initialized) {
        console.warn(
          "OneSignal is already initialized. Skipping initialization."
        );
        return;
      }

      try {
        await OneSignal.init({
          appId: "98d2fea4-c2aa-481f-8c11-052086f72209",
          safari_web_id:
            "web.onesignal.auto.98d2fea4-c2aa-481f-8c11-052086f72209",
          autoResubscribe: true,
          notifyButton: {
            enable: true,
          },
        });

        // Check if the user is already subscribed
        if (OneSignal.length) {
          const isSubscribed = await OneSignal.isPushNotificationsEnabled();

          if (!isSubscribed) {
            try {
              await OneSignal.registerForPushNotifications();
              await OneSignal.login(String(currentUser?.documentId));
            } catch (error) {
              console.error("Error during subscription or login:", error);
            }
          }
        }

        // Show the OneSignal prompt for notifications
        OneSignal.Slidedown?.promptPush();
      } catch (error) {
        console.error("Error initializing OneSignal:", error);
      }

      // Add event listener for notifications
      OneSignal.Notifications?.addEventListener(
        "foregroundWillDisplay",
        (event) => {
          if (currentUser?.documentId) {
            dispatch(getNotification({ id: currentUser?.documentId }));
            playSound();
          }
          setNotifTrigger((prev) => !prev);
          dispatch(trigerNotificationsReducer());
        }
      );
    };

    if (isLoggedIn && typeof window.OneSignal !== "undefined") {
      window.OneSignal.push(() => {
        initializeOneSignal();
      });
    }

    // Cleanup
    return () => {
      if (window.OneSignal?.initialized) {
        // Remove notification event listener
        OneSignal.Notifications?.removeEventListener("foregroundWillDisplay");
      }
    };
  }, [isLoggedIn, dispatch]);

  //-------------------------------------------------------------------------------------

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCurrentUser()).then((result) => {
        window.OneSignal.login(String(result?.payload?.documentId));
      });
      // dispatch(getReservations());
    }
    // dispatch(getPrices());
  }, [isLoggedIn]);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setPath(window.location.pathname);
    }
    // eslint-disable-next-line no-return-assign
    return () => (unmounted = true);
  }, [setPath, isLoggedIn]);

  /*  useEffect(() => {
    dispatch(
      getReservations({ free: true, deepNumber: 2, sortBy: "departDate:asc" })
    );
  }, []); */
  //
  return (
    <ConfigProvider direction={rtl ? "rtl" : "ltr"}>
      <ThemeProvider theme={{ ...theme, rtl, topMenu, darkMode }}>
        <audio style={{ display: "none" }} ref={audioRef} src={notifSound} />
        <Router basename={process.env.PUBLIC_URL}>
          <>
            {!isLoggedIn ? (
              <Route path="/" component={Auth} />
            ) : (
              <ProtectedRoute path="/admin" component={Admin} />
            )}
            {isLoggedIn && 
              (path === process.env.PUBLIC_URL ||
                path === `${process.env.PUBLIC_URL}/`) && (
                <Redirect to="/admin" />
              )}
          </>
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
}

function App() {
  return <ProviderConfig />;
}

export default hot(App);
