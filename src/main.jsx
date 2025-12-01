import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import App from "@/App";
import React from "react";

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)