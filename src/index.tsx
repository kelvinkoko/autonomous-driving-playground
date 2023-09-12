import * as React from "react";
import { createRoot } from "react-dom/client";
import { start } from "./Application/Application";
import { rootStore } from "./Application/Store/RootStore";
import StoreContext from "./Application/Store/StoreContext";
import Ui from "./Application/Ui/Ui";

start();

const root = createRoot(document.getElementById("overlay-ui")!);
root.render(
  <StoreContext.Provider value={rootStore}>
    <Ui />
  </StoreContext.Provider>
);

// Avoid the page being scrolled when touch and drag
document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);
