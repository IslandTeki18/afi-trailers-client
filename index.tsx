import * as React from "react";
import { App } from "./src/App";
import { createRoot } from "react-dom/client";
import { AppProviders } from "./src/providers";
import "./src/index.css";

const container = document.getElementById("root") as Element;
const root = createRoot(container);
root.render(
  <AppProviders>
    <App />
  </AppProviders>
);
