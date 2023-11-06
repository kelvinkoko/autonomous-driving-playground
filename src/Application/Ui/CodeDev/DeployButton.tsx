import * as React from "react";
import { ENABLE_DEPLOY } from "../../Config/FeatureFlag";
import StoreContext from "../../Store/StoreContext";
import style from "./DeployButton.css";

const DeployButton = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const deployCode = () => {
    appStore.setDriveCode(appStore.editorCode);
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
