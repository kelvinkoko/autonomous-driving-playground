import { observer } from "mobx-react";
import * as React from "react";
import StoreContext from "../Store/StoreContext";
import styles from "./SpeedDisplay.css";

const SpeedDisplay = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const speedInKmPerHour = rootStore.carStore.speedMS * (3600 / 1000);
  return (
    <div className={styles.speed}>
      <div></div>
      <div className={styles.speedValue}>{Math.round(speedInKmPerHour)}</div>
      <div className={styles.speedUnit}>{"km/h"}</div>
    </div>
  );
});

export default SpeedDisplay;
