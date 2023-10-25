import { Allotment } from "allotment";
import "allotment/dist/style.css?global";
import * as React from "react";
import { useEffect, useRef } from "react";
import style from "./App.css";
import { ENABLE_CODE_EDITOR } from "./Config/FeatureFlag";
import { onCanvasResize, start } from "./Simulation";
import CodeEditor from "./Ui/CodeDev/CodeEditor";
import DeployButton from "./Ui/CodeDev/DeployButton";
import OverlayUi from "./Ui/OverlayUi";

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
        <OverlayUi />
      </div>
      <Allotment.Pane className={style.codePane} visible={ENABLE_CODE_EDITOR}>
        <CodeEditor />
        <DeployButton />
      </Allotment.Pane>
    </Allotment>
  );
};

export default App;
