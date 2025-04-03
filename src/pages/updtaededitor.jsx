import { useRef, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { ACTIONS } from "../assets/Actions";

const Editor = ({ socketRef, roomId, fileId, content, onContentChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // No need to set up SYNC_CODE event handlers here
    // File content changes are now managed by the parent component
  }, [socketRef, roomId, fileId]);

  const handleChange = (value) => {
    // Update the parent component with the new content
    onContentChange(value);
  };

  // Determine language extension based on file extension
  const getLanguageExtension = () => {
    // If no file is selected, default to JavaScript
    if (!fileId) return [javascript()];

    // Find the current file to get its name
    const fileName = fileId.includes(".") ? fileId : "main.js";
    const extension = fileName.split(".").pop().toLowerCase();

    // Return appropriate language extension
    switch (extension) {
      case "js":
      case "jsx":
        return [javascript({ jsx: true })];
      case "md":
        return [markdown()];
      case "html":
        return [html()];
      case "css":
        return [css()];
      case "json":
        return [json()];
      default:
        return [javascript()];
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <CodeMirror
        value={content}
        theme={vscodeDark}
        height="100%"
        extensions={getLanguageExtension()}
        onChange={handleChange}
        className="text-base"
      />
    </div>
  );
};

export default Editor;
