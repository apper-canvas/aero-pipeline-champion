import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import App from "@/App";
import React from "react";

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a <div id="root"></div> in your index.html file.'
  );
}

createRoot(rootElement).render(
  <Provider store={store}>
    <App />
  </Provider>
)