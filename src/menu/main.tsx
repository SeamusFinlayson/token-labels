import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import { addThemeToBody } from "../utils.ts";
import { App } from "./App.tsx";

OBR.onReady(() => {
  // Handle dark and light mode
  addThemeToBody();
  OBR.theme.onChange((theme) => addThemeToBody(theme.mode));

  // Render app
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
