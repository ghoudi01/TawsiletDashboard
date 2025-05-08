import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./rootReducers";

const persistConfig = {
  key: "root", // This is where your state will be stored in storage.
  storage, // Use the storage type you imported earlier.
  whitelist: [
    "reservations",
    "vehicules",
    "charts",
    "user",
  
    "localisation",
    "chartContent",
    "setting",
    "companies",
    "balance",
    "tickets"
  ], // An array of reducer names you want to persist.
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// (process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
const reduxDevTool =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools(applyMiddleware(thunk.withExtraArgument()))
    : compose(applyMiddleware(thunk.withExtraArgument()));
const store = createStore(persistedReducer, reduxDevTool);

const persistor = persistStore(store);

export { store, persistor };
