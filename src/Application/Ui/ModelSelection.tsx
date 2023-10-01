import * as React from "react";
import highResImage from "../Assets/Images/model3-high-res.png";
import lowResImage from "../Assets/Images/model3-low-res.png";
import glassStyles from "./GlassPanels.css";
import styles from "./ModelSelection.css";

const ModelSelection = () => {
  return (
    <React.Fragment>
      <div className={`${glassStyles.darkPanel} ${styles.modelSelectionPanel}`}>
        <div className={styles.title}>Display Option</div>
        <div className={styles.column}>
          <div className={styles.option}>
            <img src={lowResImage} />
            <div>Fast Loading</div>
          </div>
          <div className={styles.option}>
            <img src={highResImage} />
            <div>High Quality</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModelSelection;
