import * as React from "react";
import styles from "./VehicleStateDisplay.css";

interface Props {
  speedMS: number;
}

const VehicleStateDisplay = ({ speedMS }: Props) => {
  return (
    <div className={styles.speed}>
      <div></div>
      <div className={styles.speedValue}>{speedMS}</div>
      <div className={styles.speedUnit}>{"km/h"}</div>
    </div>
  );
};

export default VehicleStateDisplay;
