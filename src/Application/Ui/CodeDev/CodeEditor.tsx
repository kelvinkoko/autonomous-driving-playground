import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import * as React from "react";
import { useEffect, useRef } from "react";
import { dracula } from "thememirror";
import StoreContext from "../../Store/StoreContext";
import style from "./CodeEditor.css";

const CodeEditor = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const codeEditorRef = useRef(null);
  const defaultLogic = `drive = (detectionResult) => {
  const diff = detectionResult[1].distance - detectionResult[7].distance;
  const steering = Math.max(-0.7, Math.min(diff, 0.7));
  return {
    force: 0.4,
    brake: 0,
    steering
  };
}`;
  useEffect(() => {
    if (codeEditorRef.current) {
      const onUpdate = EditorView.updateListener.of(update => {
        appStore.setEditorCode(update.state.doc.toString());
      });

      const state = EditorState.create({
        doc: defaultLogic,
        extensions: [
          basicSetup,
          javascript(),
          dracula,
          EditorView.lineWrapping,
          onUpdate
        ]
      });
      const view = new EditorView({
        state: state,
        parent: codeEditorRef.current
      });
    }
  }, []);
  return <div className={style.container} ref={codeEditorRef} />;
};

export default CodeEditor;
