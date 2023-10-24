import { javascript } from "@codemirror/lang-javascript";
import { Allotment } from "allotment";
import "allotment/dist/style.css?global";
import { EditorView, basicSetup } from "codemirror";
import * as React from "react";
import { useEffect, useRef } from "react";
import { dracula } from "thememirror";
import style from "./App.css";
import { onCanvasResize, start } from "./Simulation";
import Ui from "./Ui/Ui";

const App = () => {
  const canvasRef = useRef(null);
  const codeEditorRef = useRef(null);
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      start(canvasElement);
    }
    if (codeEditorRef.current) {
      const view = new EditorView({
        extensions: [basicSetup, javascript(), dracula],
        parent: codeEditorRef.current
      });
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
        <div ref={codeEditorRef} />
      </div>
    </Allotment>
  );
};

export default App;
