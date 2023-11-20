import { observer } from "mobx-react";
import * as React from "react";
import { ENABLE_TIMER } from "../Config/FeatureFlag";
import { InitState } from "../Store/ApplicationStore";
import StoreContext from "../Store/StoreContext";
import BrakePedal from "./CarControl/BrakePedal";
import ForcePedal from "./CarControl/ForcePedal";
import SteeringWheel from "./CarControl/SteeringWheel";
import glassStyles from "./GlassPanels.css";
import ManualInstructionDialog from "./ManualInstructionDialog";
import ModelSelection from "./ModelSelection";
import styles from "./OverlayUi.css";
import SensingDisplay from "./SensingDisplay";
import SimulationControls from "./SimulationControls";
import SpeedDisplay from "./SpeedDisplay";
import Timer from "./Timer";

const OverlayUi = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  switch (appStore.initState) {
    case InitState.MODEL_SELECTION:
      return <ModelSelection />;
    case InitState.LOADING:
      return <Loading />;
    case InitState.READY:
      return <Content showManual={appStore.isShowingManualInstruction} />;
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

interface ContentProps {
  showManual: boolean;
}

const Content = ({ showManual }: ContentProps) => {
  return (
    <React.Fragment>
      <div className={`${glassStyles.darkPanel} ${styles.simulationControls}`}>
        <SimulationControls />
      </div>
      <div className={`${glassStyles.grayPanel} ${styles.speedPanel}`}>
        <SpeedDisplay />
      </div>
      {ENABLE_TIMER ? (
        <div className={styles.timerPanel}>
          <Timer />
        </div>
      ) : null}
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
      {showManual ? <ManualInstructionDialog /> : <></>}
    </React.Fragment>
  );
};

export default OverlayUi;
