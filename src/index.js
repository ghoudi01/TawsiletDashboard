/* eslint-disable import/no-unresolved */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./Loading";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </ApolloProvider>
  </Provider>
);

 
reportWebVitals();
