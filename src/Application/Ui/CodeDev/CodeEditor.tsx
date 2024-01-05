import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import * as React from "react";
import { useEffect, useRef } from "react";
import { dracula } from "thememirror";
import StoreContext from "../../Store/StoreContext";

const CodeEditor = () => {
  const rootStore = React.useContext(StoreContext);
  const appStore = rootStore.applicationStore;
  const codeEditorRef = useRef(null);

  useEffect(() => {
    if (codeEditorRef.current) {
      const onUpdate = EditorView.updateListener.of(update => {
        appStore.setEditorCode(update.state.doc.toString());
      });

      const state = EditorState.create({
        doc: appStore.editorCode,
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
  return <div ref={codeEditorRef} />;
};

export default CodeEditor;
