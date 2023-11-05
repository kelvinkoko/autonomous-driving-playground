import * as React from "react";
import Close from "../Assets/Images/close-circle-icon.svg";
import Keyboard from "../Assets/Images/keyboard-icon.svg";
import Mouse from "../Assets/Images/mouse-icon.svg";
import StoreContext from "../Store/StoreContext";
import glassStyles from "./GlassPanels.css";
import styles from "./ManualInstructionDialog.css";

const ManualInstructionDialog = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const closeDialog = () => {
    appStore.setIsShowingManualInstruction(false);
  };
  return (
    <div className={`${glassStyles.darkPanel} ${styles.dialog}`}>
      <Close className={styles.closeIcon} onClick={closeDialog} />
      <div className={styles.title}>Driving Control</div>
      <div className={styles.row}>
        <Keyboard className={styles.icon} />
        <div>
          <b>WASD</b> for direction, <b>B</b> for brake
        </div>
      </div>
      <br />
      <div className={styles.row}>
        <Mouse className={styles.icon} />
        <div>Drag the steering wheel and pedals</div>
      </div>
      <div className={styles.notice}>
        You can intercept the control even in Autopilot
      </div>
    </div>
  );
};

export default ManualInstructionDialog;
