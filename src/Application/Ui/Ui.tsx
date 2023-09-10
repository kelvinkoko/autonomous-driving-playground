import * as React from "react";
import BrakePedal from "./BrakePedal";
import ForcePedal from "./ForcePedal";
import glassStyles from "./GlassPanels.css";
import SpeedDisplay from "./SpeedDisplay";
import SteeringWheel from "./SteeringWheel";
import styles from "./Ui.css";

const Ui = () => {
  return (
    <React.Fragment>
      <div className={`${glassStyles.grayPanel} ${styles.speedPanel}`}>
        <SpeedDisplay />
      </div>
      <div className={`${glassStyles.whitePanel} ${styles.steeringPanel}`}>
        <SteeringWheel />
      </div>
      <div className={`${glassStyles.whitePanel} ${styles.pedalsPanel}`}>
        <BrakePedal />
        <ForcePedal />
      </div>
    </React.Fragment>
  );
};

export default Ui;
