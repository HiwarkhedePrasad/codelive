import { useRef, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView, Decoration } from "@codemirror/view";
import { EditorState, StateField, StateEffect } from "@codemirror/state";

const Editor = ({
  socketRef,
  roomId,
  fileId,
  content,
  onContentChange,
  onCursorChange,
  cursors = [],
}) => {
  // Debugging props
  console.log("Editor props:", {
    socketRef: !!socketRef,
    roomId,
    fileId,
    contentLength: content?.length || 0,
    hasOnContentChange: !!onContentChange,
    hasOnCursorChange: !!onCursorChange,
    cursorsLength: cursors?.length || 0,
  });

  const editorRef = useRef(null);
  const cmRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const localCursorRef = useRef(null);

  // Define effects for cursor updates
  const addCursor = StateEffect.define();
  const removeCursor = StateEffect.define();

  // Cursor tracking state field
  const cursorField = StateField.define({
    create() {
      return Decoration.none;
    },
    update(cursors, tr) {
      cursors = cursors.map(tr.changes);

      for (let effect of tr.effects) {
        if (effect.is(addCursor)) {
          const { pos, dom } = effect.value;
          const widget = Decoration.widget({
            widget: { toDOM: () => dom },
            side: 1,
          });
          cursors = cursors.update({ add: [widget.range(pos)] });
        } else if (effect.is(removeCursor)) {
          cursors = Decoration.none;
        }
      }
      return cursors;
    },
    provide: (field) => EditorView.decorations.from(field),
  });

  // Handle content changes
  const handleChange = (value, viewUpdate) => {
    if (!viewUpdate.docChanged) return;

    const selection = viewUpdate.state.selection.main;
    const cursorPosition = {
      from: selection.from,
      to: selection.to,
      head: selection.head,
      anchor: selection.anchor,
    };

    localCursorRef.current = cursorPosition;

    if (onContentChange && fileId) {
      onContentChange(fileId, value); // Ensure only the string value is sent
    }
  };

  // Handle cursor movement
  const handleCursorActivity = (viewUpdate) => {
    if (!viewUpdate || viewUpdate.docChanged) return;

    const selection = viewUpdate.state.selection.main;
    const cursorPosition = {
      from: selection.from,
      to: selection.to,
      head: selection.head,
      anchor: selection.anchor,
    };

    localCursorRef.current = cursorPosition;

    if (onCursorChange) {
      onCursorChange(cursorPosition);
    }
  };

  // Determine language extension based on file type
  const getLanguageExtension = () => {
    if (!fileId) return [javascript()];

    const fileName = fileId.includes(".") ? fileId.split("/").pop() : "main.js";
    const extension = fileName.split(".").pop().toLowerCase();

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

  // Generate cursor element
  const createCursorElement = (username, color) => {
    const cursorElem = document.createElement("div");
    cursorElem.className = "remote-cursor";
    cursorElem.style.position = "relative";
    cursorElem.style.zIndex = 10;

    const cursorLine = document.createElement("div");
    cursorLine.style.width = "2px";
    cursorLine.style.height = "1.2em";
    cursorLine.style.backgroundColor = color;
    cursorElem.appendChild(cursorLine);

    const label = document.createElement("div");
    label.textContent = username || "User";
    label.style.position = "absolute";
    label.style.top = "-1.4em";
    label.style.backgroundColor = color;
    label.style.color = "#fff";
    label.style.padding = "2px 4px";
    label.style.borderRadius = "3px";
    label.style.whiteSpace = "nowrap";
    cursorElem.appendChild(label);

    return cursorElem;
  };

  // Assign consistent color to each user
  const getRandomColor = (username) => {
    if (!username) return `hsl(200, 70%, 50%)`;
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  // Setup editor with cursor extension
  useEffect(() => {
    if (!editorInstance) return;

    try {
      const currentExtensions = editorInstance.state.facet(
        EditorState.extensions
      );
      if (!currentExtensions.some((ext) => ext === cursorField)) {
        editorInstance.dispatch({
          effects: StateEffect.appendConfig.of([cursorField]),
        });
      }
    } catch (err) {
      console.error("Error setting up editor extensions:", err);
    }
  }, [editorInstance]);

  // Update remote cursors
  useEffect(() => {
    if (!editorInstance) return;

    try {
      editorInstance.dispatch({ effects: removeCursor.of(null) });

      if (!Array.isArray(cursors) || !cursors.length) return;

      const effects = cursors
        .map((cursor, i) => {
          if (!cursor) return null;

          const username = cursor.username || `User ${i + 1}`;
          const cursorId = `cursor-${i}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;

          if (!cursor.position || typeof cursor.position.head !== "number") {
            return null;
          }

          const color = getRandomColor(username);
          const cursorElement = createCursorElement(username, color);
          return addCursor.of({
            id: cursorId,
            pos: cursor.position.head,
            dom: cursorElement,
          });
        })
        .filter(Boolean);

      if (effects.length) {
        editorInstance.dispatch({ effects });
      }

      if (localCursorRef.current) {
        try {
          const { head, anchor } = localCursorRef.current;
          editorInstance.dispatch({ selection: { anchor, head } });
        } catch (err) {
          console.error("Error restoring cursor:", err);
        }
      }
    } catch (err) {
      console.error("Error updating remote cursors:", err);
    }
  }, [editorInstance, cursors]);

  return (
    <div className="h-full w-full overflow-hidden" ref={editorRef}>
      <CodeMirror
        ref={cmRef}
        value={typeof content === "string" ? content : ""}
        theme={vscodeDark}
        height="100%"
        extensions={getLanguageExtension()}
        onChange={handleChange}
        onUpdate={handleCursorActivity}
        onCreateEditor={(view) => setEditorInstance(view)}
        className="text-base"
      />
    </div>
  );
};

export default Editor;
