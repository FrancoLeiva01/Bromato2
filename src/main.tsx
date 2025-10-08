import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TanStackProvider } from "../src/plugins/TanStackProvider.tsx";
// import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TanStackProvider>
        <App />
        {/* <ToastContainer /> */}
    </TanStackProvider>
  </React.StrictMode>,
);

