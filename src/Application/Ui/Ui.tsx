import { observer } from "mobx-react";
import * as React from "react";
import { InitState } from "../Store/ApplicationStore";
import StoreContext from "../Store/StoreContext";
import BrakePedal from "./BrakePedal";
import ForcePedal from "./ForcePedal";
import glassStyles from "./GlassPanels.css";
import ModelSelection from "./ModelSelection";
import SpeedDisplay from "./SpeedDisplay";
import SteeringWheel from "./SteeringWheel";
import styles from "./Ui.css";

const Ui = observer(() => {
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
