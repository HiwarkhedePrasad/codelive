import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const Terminal = ({ output }) => {
  const terminalContainerRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const previousOutputRef = useRef("");

  // Initialize xterm terminal
  useEffect(() => {
    // Create new terminal and fit addon
    xtermRef.current = new XTerm({
      cursorBlink: true,
      fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
      fontSize: 14,
      theme: {
        background: "#1a1a1a",
        foreground: "#f8f8f8",
        black: "#000000",
        red: "#ff5555",
        green: "#50fa7b",
        yellow: "#f1fa8c",
        blue: "#bd93f9",
        magenta: "#ff79c6",
        cyan: "#8be9fd",
        white: "#bfbfbf",
        brightBlack: "#4d4d4d",
        brightRed: "#ff6e6e",
        brightGreen: "#69ff94",
        brightYellow: "#ffffa5",
        brightBlue: "#d6acff",
        brightMagenta: "#ff92df",
        brightCyan: "#a4ffff",
        brightWhite: "#e6e6e6",
      },
    });

    fitAddonRef.current = new FitAddon();
    xtermRef.current.loadAddon(fitAddonRef.current);

    // Open terminal in the container
    xtermRef.current.open(terminalContainerRef.current);

    // Initial resize
    setTimeout(() => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    }, 0);

    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener("resize", handleResize);

    // Write initial message
    xtermRef.current.writeln("Terminal ready. Run a file to see output.");

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  // Process and write new output to terminal
  useEffect(() => {
    if (!xtermRef.current || output === previousOutputRef.current) return;

    // Check if this is new output to append
    if (
      output &&
      output.startsWith(previousOutputRef.current) &&
      previousOutputRef.current
    ) {
      // Only write the new part
      const newPart = output.substring(previousOutputRef.current.length);
      processAndWriteOutput(newPart);
    } else if (output !== previousOutputRef.current) {
      // Clear and write full output
      xtermRef.current.clear();
      if (output) {
        processAndWriteOutput(output);
      } else {
        xtermRef.current.writeln("Terminal ready. Run a file to see output.");
      }
    }

    previousOutputRef.current = output;
  }, [output]);

  // Process output and apply ANSI colors
  const processAndWriteOutput = (text) => {
    if (!text) return;

    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Apply ANSI color codes based on content
      if (
        line.includes("error:") ||
        line.includes("Error:") ||
        line.includes("exception") ||
        line.includes("Exception") ||
        line.includes("failed")
      ) {
        // Red text for errors
        xtermRef.current.write("\x1b[31m" + line + "\x1b[0m");
      } else if (line.includes("warning:") || line.includes("Warning:")) {
        // Yellow text for warnings
        xtermRef.current.write("\x1b[33m" + line + "\x1b[0m");
      } else if (line.includes("> Running")) {
        // Green text for execution start
        xtermRef.current.write("\x1b[32m" + line + "\x1b[0m");
      } else if (line.includes("[") && line.includes("]")) {
        // Cyan for user indicators
        const parts = line.split(/(\[.*?\])/g);
        for (let j = 0; j < parts.length; j++) {
          if (parts[j].startsWith("[") && parts[j].endsWith("]")) {
            xtermRef.current.write("\x1b[36m" + parts[j] + "\x1b[0m");
          } else {
            xtermRef.current.write(parts[j]);
          }
        }
      } else {
        // Normal text
        xtermRef.current.write(line);
      }

      // Add newline if not the last line
      if (i < lines.length - 1) {
        xtermRef.current.write("\r\n");
      }
    }
  };

  return (
    <div
      ref={terminalContainerRef}
      className="flex-1 overflow-hidden"
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default Terminal;
