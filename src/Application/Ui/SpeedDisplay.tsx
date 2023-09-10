import { observer } from "mobx-react";
import * as React from "react";
import styles from "./SpeedDisplay.css";
import { CarStore } from "../Store/CarStore";

interface Props {
  carStore: CarStore;
}

const SpeedDisplay = observer(({ carStore }: Props) => {
  const speedInKmPerHour = carStore.speedMS * (3600 / 1000);
  return (
    <div className={styles.speed}>
      <div></div>
      <div className={styles.speedValue}>{Math.round(speedInKmPerHour)}</div>
      <div className={styles.speedUnit}>{"km/h"}</div>
    </div>
  );
});

export default SpeedDisplay;
