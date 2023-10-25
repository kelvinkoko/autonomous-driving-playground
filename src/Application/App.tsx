import { Allotment } from "allotment";
import "allotment/dist/style.css?global";
import * as React from "react";
import { useEffect, useRef } from "react";
import style from "./App.css";
import CodeEditor from "./CodeEditor";
import { DeployButton } from "./DeployButton";
import { onCanvasResize, start } from "./Simulation";
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
    <Allotment
      className={style.container}
      defaultSizes={[80, 20]}
      onChange={() => {
        onCanvasResize?.();
      }}
    >
      <div className={style.main}>
        <div className={style.canvas} ref={canvasRef} />
        <Ui />
      </div>
      <div className={style.codePane}>
        <CodeEditor />
        <DeployButton />
      </div>
    </Allotment>
  );
};

export default App;
