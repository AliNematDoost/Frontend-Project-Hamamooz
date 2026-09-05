import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

import App from "./App";

import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/app">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 9,
            colorText: "#172033",
            colorTextSecondary: "#728096",
            colorBgLayout: "#f4f7fb",
          },
          components: {
            Button: {
              controlHeight: 40,
            },
            Card: {
              borderRadiusLG: 16,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
