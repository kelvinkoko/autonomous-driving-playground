import * as React from "react";
import styles from "./Ui.css";
import VehicleStateDisplay from "./VehicleStateDisplay";

const Ui = () => {
  return (
    <div className={styles.ui}>
      <VehicleStateDisplay speedMS={0} />
    </div>
  );
};

export default Ui;
