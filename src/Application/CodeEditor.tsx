import { javascript } from "@codemirror/lang-javascript";
import { EditorView, basicSetup } from "codemirror";
import * as React from "react";
import { useEffect, useRef } from "react";
import { dracula } from "thememirror";

const CodeEditor = () => {
  const codeEditorRef = useRef(null);
  useEffect(() => {
    if (codeEditorRef.current) {
      const view = new EditorView({
        extensions: [basicSetup, javascript(), dracula],
        parent: codeEditorRef.current
      });
    }
  }, []);
  return <div ref={codeEditorRef} />;
};

export default CodeEditor;
