import { observer } from "mobx-react";
import * as React from "react";
import topViewImage from "../Assets/Images/model3-top-view.png";
import { DetectionObjectType } from "../Car/DetectionObjectType";
import { DetectionResult } from "../Car/DetectionResult";
import StoreContext from "../Store/StoreContext";
import styles from "./SensingDisplay.css";

const SensingDisplay = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;
  const detections = carStore.detectionResult;
  if (detections.length < 8) {
    return <div></div>;
  }
  return (
    <div className={styles.detectedResult}>
      <div className={styles.row}>
        <SensingResult result={detections[7]} />
        <SensingResult result={detections[0]} />
        <SensingResult result={detections[1]} />
      </div>
      <div className={styles.row}>
        <SensingResult result={detections[6]} />
        <img className={styles.topViewImage} src={topViewImage} />
        <SensingResult result={detections[2]} />
      </div>
      <div className={styles.row}>
        <SensingResult result={detections[5]} />
        <SensingResult result={detections[4]} />
        <SensingResult result={detections[3]} />
      </div>
    </div>
  );
});

interface Props {
  result: DetectionResult;
}
const SensingResult = ({ result }: Props) => {
  return (
    <div className={styles.item}>
      {getObjectName(result.object)}
      <br />
      {formatDistance(result.distance)}
    </div>
  );
};

function getObjectName(type: DetectionObjectType | null): string {
  switch (type) {
    case DetectionObjectType.TRACK:
      return "Track";
    case null:
      return "Empty";
  }
}

function formatDistance(distance: number): string {
  return `${(Math.round(distance * 100) / 100).toFixed(2)} m`;
}

export default SensingDisplay;
