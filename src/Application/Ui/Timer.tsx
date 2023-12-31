import { observer } from "mobx-react";
import * as React from "react";
import { useEffect, useState } from "react";
import StoreContext from "../Store/StoreContext";
import styles from "./Timer.css";

const Timer = observer(() => {
  const rootStore = React.useContext(StoreContext);
  const carStore = rootStore.carStore;
  const [milliseconds, setMilliseconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMilliseconds(Date.now() - carStore.lapTimeStartMs);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(2);
  const minuteString = String(minutes).padStart(2, "0");
  const secondString = String(seconds).padStart(5, "0");
  return (
    <div>
      <div className={styles.title}>Lap Time</div>
      <div className={styles.time}>{`${minuteString}:${secondString}`}</div>
    </div>
  );
});

export default Timer;
