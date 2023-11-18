import { observer } from "mobx-react";
import * as React from "react";
import StoreContext from "../Store/StoreContext";
import styles from "./RaceMap.css";

const RaceMap = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;
  const x = carStore.position.x;
  const y = carStore.position.y;
  const width = 200;
  const height = 100;
  // Calculate the scaled x, y coordinates based on the div size
  const scaledX = (x / 60) * width; // Adjust the scaling factor as needed
  const scaledY = (y / 30) * height; // Adjust the scaling factor as needed

  // Create a style object to position the point
  const pointStyle = {
    left: `${scaledX}px`,
    top: `${scaledY}px`
  };

  return (
    <div
      className={styles.mapContainer}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div style={pointStyle} className={styles.point}></div>
    </div>
  );
});

export default RaceMap;
