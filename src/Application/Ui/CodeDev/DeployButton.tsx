import * as React from "react";
import StoreContext from "../../Store/StoreContext";
import style from "./DeployButton.css";

const DeployButton = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const deployCode = () => {
    appStore.setDriveCode(appStore.editorCode);
  };
  return (
    <div onClick={deployCode} className={style.deployButton}>
      Deploy
    </div>
  );
};

export default DeployButton;
