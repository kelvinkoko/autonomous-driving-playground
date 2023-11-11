import * as React from "react";
import Reset from "../Assets/Images/reset-icon.svg";
import { reset } from "../Simulation";
import styles from "./SimulationControls.css";

const SimulationControls = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item} onClick={reset}>
        <Reset className={styles.icon} />
        Reset
      </div>
    </div>
  );
};

export default SimulationControls;
