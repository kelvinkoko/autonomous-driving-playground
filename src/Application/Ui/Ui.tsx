import * as React from "react";
import { worldStore } from "../Store/WordStore";
import styles from "./Ui.css";
import VehicleStateDisplay from "./VehicleStateDisplay";

const Ui = () => {
  return (
    <div className={styles.ui}>
      <VehicleStateDisplay worldStore={worldStore} />
    </div>
  );
};

export default Ui;
