import { observer } from "mobx-react";
import * as React from "react";
import { WorldStore } from "../Store/WordStore";
import styles from "./VehicleStateDisplay.css";

interface Props {
  worldStore: WorldStore;
}

const VehicleStateDisplay = observer(({ worldStore }: Props) => {
  const speedInKmPerHour = worldStore.carState.speedMS * (3600 / 1000);
  return (
    <div className={styles.speed}>
      <div></div>
      <div className={styles.speedValue}>{Math.round(speedInKmPerHour)}</div>
      <div className={styles.speedUnit}>{"km/h"}</div>
    </div>
  );
});

export default VehicleStateDisplay;
