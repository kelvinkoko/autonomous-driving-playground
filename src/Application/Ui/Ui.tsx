import * as React from "react";
import { worldStore } from "../Store/WordStore";
import BrakePedal from "./BrakePedal";
import GasPedal from "./GasPedal";
import glassStyles from "./GlassPanels.css";
import SpeedDisplay from "./SpeedDisplay";
import SteeringWheel from "./SteeringWheel";
import styles from "./Ui.css";

const Ui = () => {
  return (
    <React.Fragment>
      <div className={`${glassStyles.grayPanel} ${styles.speedPanel}`}>
        <SpeedDisplay carStore={worldStore.carStore} />
      </div>
      <div className={`${glassStyles.whitePanel} ${styles.steeringPanel}`}>
        <SteeringWheel carStore={worldStore.carStore} />
      </div>
      <div className={`${glassStyles.whitePanel} ${styles.pedalsPanel}`}>
        <BrakePedal />
        <GasPedal />
      </div>
    </React.Fragment>
  );
};

export default Ui;
