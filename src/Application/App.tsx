import * as React from "react";
import { useEffect, useRef } from "react";
import style from "./App.css";
import { start } from "./Application";
import Ui from "./Ui/Ui";

const App = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      start(canvasElement);
    }
  }, []);

  return (
    <div className={style.container}>
      <div className={style.main}>
        <div className={style.canvas} ref={canvasRef} />
        <Ui />
      </div>
      <div className={style.menu} />
    </div>
  );
};

export default App;
