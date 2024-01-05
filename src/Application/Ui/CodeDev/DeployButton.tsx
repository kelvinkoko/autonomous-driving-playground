import * as React from "react";
import { ENABLE_DEPLOY } from "../../Config/FeatureFlag";
import { applyDriveCode } from "../../Simulation/Simulation";
import StoreContext from "../../Store/StoreContext";
import { Tab } from "../../Tab";
import style from "./DeployButton.css";
import { runWasm } from "./Wasm";

const DeployButton = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const deployCode = () => {
    switch (appStore.codeTab) {
      case Tab.JS:
        applyDriveCode(appStore.editorCode);
        break;
      case Tab.WASM:
        runWasm(appStore.wasmModule);
        break;
    }
  };
  return (
    <div
      title={
        ENABLE_DEPLOY
          ? "Deploy drive logic"
          : "WIP: To be support deploy custom code soon"
      }
      onClick={deployCode}
      className={`${style.deployButton} ${ENABLE_DEPLOY ? "" : style.disable}`}
    >
      Deploy
    </div>
  );
};

export default DeployButton;
