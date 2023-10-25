import { observer } from "mobx-react";
import * as React from "react";
import { InitState } from "../Store/ApplicationStore";
import StoreContext from "../Store/StoreContext";
import BrakePedal from "./CarControl/BrakePedal";
import ForcePedal from "./CarControl/ForcePedal";
import SteeringWheel from "./CarControl/SteeringWheel";
import glassStyles from "./GlassPanels.css";
import ModelSelection from "./ModelSelection";
import styles from "./OverlayUi.css";
import SensingDisplay from "./SensingDisplay";
import SpeedDisplay from "./SpeedDisplay";

const OverlayUi = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  switch (appStore.initState) {
    case InitState.MODEL_SELECTION:
      return <ModelSelection />;
    case InitState.LOADING:
      return <Loading />;
    case InitState.READY:
      return <Content />;
  }
});

const Loading = () => {
  return (
    <React.Fragment>
      <div className={`${glassStyles.grayPanel} ${styles.loadingPanel}`}>
        Loading Car...
      </div>
    </React.Fragment>
  );
};

const Content = () => {
  return (
    <React.Fragment>
      <div className={`${glassStyles.grayPanel} ${styles.speedPanel}`}>
        <SpeedDisplay />
      </div>
      <div className={`${glassStyles.darkPanel} ${styles.sensingPanel}`}>
        <SensingDisplay />
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

export default OverlayUi;
