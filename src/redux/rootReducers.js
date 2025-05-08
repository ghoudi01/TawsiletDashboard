import { combineReducers } from "redux";
import { readMessageReducer } from "./message/reducers";
import { readNotificationReducer } from "./notification/reducers";
import authReducer from "./authentication/reducers";
import ChangeLayoutMode from "./themeLayout/reducers";

import { headerSearchReducer } from "./headerSearch/reducers";

import reservationSlice from "./reservations/reservationSlice";
import userSlice from "./User/userSlice";
import vehiculeSlice from "./vehicule/vehiculeSlice";
 import chartSlice from "./chartContent/chartSlice";
import settingSlice from "./pricing/settingSlice";
import localisationSlice from "./Localisation/localisationSlice";
import notificationSlice from "./notifications/notificationSlice";
import chartContentReducer from "./chartContent/reducers";
import companiesSlice from "./company/companySlice";
import balanceReducer from "./balance/balanceSlice";

import ticketSlice from "./tickets/ticketSlice";

const rootReducers = combineReducers({
  headerSearchData: headerSearchReducer,
  message: readMessageReducer,
  notification: readNotificationReducer,
  auth: authReducer,
  reservations: reservationSlice,
  user: userSlice,
  vehicules: vehiculeSlice,
 
  ChangeLayoutMode,
  charts: chartSlice,
  setting: settingSlice,
  localisation: localisationSlice,
  notification: notificationSlice,
  chartContent: chartContentReducer,
  companies: companiesSlice,
  balance: balanceReducer,
  tickets: ticketSlice
});

export default rootReducers;
