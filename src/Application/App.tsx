import { Allotment } from "allotment";
import "allotment/dist/style.css?global";
import * as React from "react";
import { useEffect, useRef } from "react";
import style from "./App.css";
import { ENABLE_CODE_EDITOR } from "./Config/FeatureFlag";
import { onCanvasResize, start } from "./Simulation";
import AutopilotControlButton from "./Ui/CodeDev/AutopilotControlButton";
import CodeEditor from "./Ui/CodeDev/CodeEditor";
import Console from "./Ui/CodeDev/Console";
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
      defaultSizes={[70, 30]}
      onChange={() => {
        onCanvasResize?.();
      }}
    >
      <div className={style.main}>
        <div className={style.canvas} ref={canvasRef} />
        <OverlayUi />
      </div>
      <Allotment.Pane className={style.codePane} visible={ENABLE_CODE_EDITOR}>
        <CodePane />
      </Allotment.Pane>
    </Allotment>
  );
};

const CodePane = () => {
  return (
    <Allotment vertical defaultSizes={[70, 30]}>
      <Allotment.Pane className={style.editorWithButtonContainer}>
        <CodeEditor />
        <DeployButton />
        <AutopilotControlButton />
      </Allotment.Pane>
      <Console />
    </Allotment>
  );
};

export default App;
