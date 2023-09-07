import * as React from "react";
import { worldStore } from "../Store/WordStore";
import styles from "./Ui.css";
import VehicleControls from "./VehicleControls";
import VehicleStateDisplay from "./VehicleStateDisplay";

const Ui = () => {
  return (
    <div className={styles.ui}>
      <VehicleStateDisplay worldStore={worldStore} />
      <VehicleControls carStore={worldStore.carStore} />
    </div>
  );
};

export default Ui;
