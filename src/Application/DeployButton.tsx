import * as React from "react";
import style from "./DeployButton.css";
import StoreContext from "./Store/StoreContext";

export const DeployButton = () => {
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
