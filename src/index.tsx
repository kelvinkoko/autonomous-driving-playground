import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./Application/App";
import { rootStore } from "./Application/Store/RootStore";
import StoreContext from "./Application/Store/StoreContext";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StoreContext.Provider value={rootStore}>
    <App />
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
