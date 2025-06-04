import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Terminal,
  Play,
  Maximize2,
  Minimize2,
  Save,
  Zap,
  Moon,
  Sun,
  Type,
  Indent,
  AlignLeft,
  History,
  Settings,
  Wand2,
  Loader,
} from "lucide-react";
import { useEditorSizeStore } from "../../store/useEditorSizeStore";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const ResizableEditor = ({
  code,
  language,
  onCodeChange,
  onRunCode,
  isExecuting,
  aiSuggestions,
  isAiLoading,
  isAiEnabled,
  onToggleAi,
  onAcceptSuggestion,
  onKeyDown,
  editorRef,
  monacoRef,
}) => {
  const { id: problemId } = useParams();
  const { isFullscreen, toggleFullscreen } = useEditorSizeStore();
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState("off");
  const [autoSave, setAutoSave] = useState(false);
  const [editorHistory, setEditorHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editorInstance, setEditorInstance] = useState(null);
  const [debouncedCode] = useDebounce(code, 1500);
  const decorationsRef = useRef([]);

  const getStorageKey = () =>
    `problem_${problemId}_${language.toLowerCase()}_code`;

  useEffect(() => {
    const savedCode = localStorage.getItem(getStorageKey());
    if (savedCode) {
      onCodeChange(savedCode);
      setEditorHistory([savedCode]);
      setHistoryIndex(0);
      toast.success("Loaded your last saved code", { autoClose: 1500 });
    } else {
      setEditorHistory([code]);
      setHistoryIndex(0);
    }
  }, [problemId, language]);

  useEffect(() => {
    if (
      autoSave &&
      debouncedCode &&
      editorHistory[historyIndex] !== debouncedCode
    ) {
      handleAddToHistory(debouncedCode);
      saveToLocalStorage(debouncedCode);
      toast.success("Auto-saved your code", {
        autoClose: 1000,
        description: "Your code has been automatically saved",
        action: {
          label: "Turn off",
          onClick: () => setAutoSave(false),
        },
      });
    }
  }, [debouncedCode]);

  const saveToLocalStorage = (codeToSave) => {
    try {
      localStorage.setItem(getStorageKey(), codeToSave);
    } catch (error) {
      console.error("Failed to save code to localStorage:", error);
      toast.error("Failed to save code locally. Storage might be full.");
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem(getStorageKey());
    toast.info("Cleared local saved code", { autoClose: 1000 });
  };

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    monacoRef.current = monaco;
    editorRef.current = editor;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleManualSave();
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        formatCode();
      }
    );

    editor.onKeyDown(onKeyDown);
  };

  useEffect(() => {
    if (!editorInstance || !monacoRef.current || !aiSuggestions) {
      return;
    }

    const position = editorInstance.getPosition();
    const newDecorations = [
      {
        range: new monacoRef.current.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: "ai-suggestion-highlight",
          after: {
            content: aiSuggestions,
            inlineClassName: "ai-suggestion-text",
            cursorStops: monacoRef.current.editor?.InjectedTextCursorStops?.Right ?? 2,
          },
          hoverMessage: {
            value: "Press Ctrl+Shift to accept suggestion",
          },
        },
      },
    ];

    decorationsRef.current = editorInstance.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );

    return () => {
      if (editorInstance && decorationsRef.current.length > 0) {
        editorInstance.deltaDecorations(decorationsRef.current, []);
      }
    };
  }, [aiSuggestions, editorInstance]);

  const handleManualSave = () => {
    if (editorInstance) {
      const currentCode = editorInstance.getValue();
      handleAddToHistory(currentCode);
      saveToLocalStorage(currentCode);
      toast.success("Code saved successfully", {
        autoClose: 1000,
        description: "Your code has been manually saved",
      });
    }
  };

  const handleAddToHistory = (newCode) => {
    const newHistory = [...editorHistory.slice(0, historyIndex + 1), newCode];
    setEditorHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onCodeChange(editorHistory[newIndex]);
      toast.info("Undo", { autoClose: 800 });
    }
  };

  const redo = () => {
    if (historyIndex < editorHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onCodeChange(editorHistory[newIndex]);
      toast.info("Redo", { autoClose: 800 });
    }
  };

  const formatCode = () => {
    if (editorInstance) {
      editorInstance.getAction("editor.action.formatDocument").run();
      toast.success("Code formatted", { autoClose: 1000 });
    }
  };

  const toggleTheme = () => {
    setEditorTheme(editorTheme === "vs-dark" ? "light" : "vs-dark");
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 1, 24));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 1, 10));
  };

  const toggleWordWrap = () => {
    setWordWrap(wordWrap === "off" ? "on" : "off");
  };

  const toggleAutoSave = () => {
    const newAutoSave = !autoSave;
    setAutoSave(newAutoSave);
    toast(newAutoSave ? "Auto-save enabled" : "Auto-save disabled", {
      autoClose: 1000,
      description: newAutoSave
        ? "Your code will be saved automatically"
        : "Remember to save your code manually",
    });
  };

  const commonSnippets = {
    javascript: [
      { name: "Console Log", value: "console.log($1);$0" },
      { name: "Function", value: "function ${1:name}($2) {\n  $0\n}" },
      {
        name: "Arrow Function",
        value: "const ${1:name} = ($2) => {\n  $0\n};",
      },
    ],
    python: [
      { name: "Print", value: "print($1)$0" },
      { name: "Function", value: "def ${1:name}($2):\n  $0" },
      { name: "For Loop", value: "for ${1:item} in ${2:iterable}:\n  $0" },
    ],
    java: [
      {
        name: "Main Method",
        value: "public static void main(String[] args) {\n  $0\n}",
      },
      { name: "Print", value: "System.out.println($1);$0" },
      { name: "Class", value: "public class ${1:Name} {\n  $0\n}" },
    ],
  };

  return (
    <div
      className={`card bg-gray-800 shadow-xl ${
        isFullscreen
          ? "fixed inset-0 z-40 mt-30 border border-gray-700"
          : "relative border border-gray-700"
      }`}
    >
      <div className="card-body p-0 h-full flex flex-col">
        <div className="tabs tabs-boxed bg-gray-800 flex justify-between items-center border-b border-gray-700 px-2">
          <div className="flex items-center gap-1">
            <button className="tab tab-active gap-2 text-gray-300 hover:text-gray-200">
              <Terminal className="w-4 h-4" />
              Code Editor
            </button>

            <span className="badge badge-sm bg-gray-700 text-gray-300 ml-2">
              {language}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleAi}
              className={`btn btn-ghost btn-sm ${
                isAiEnabled
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
              }`}
              title={`AI Autocomplete (Ctrl+Shift)
                `}
            >
              {isAiLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 size={16} />
              )}
            </button>

            <div className="dropdown dropdown-end">
              <button
                className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                title="Snippets"
              >
                <Zap size={16} />
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-52 border border-gray-700">
                <li className="menu-title text-gray-400">Snippets</li>
                {(commonSnippets[language.toLowerCase()] || []).map(
                  (snippet, index) => (
                    <li key={index}>
                      <button onClick={() => {}}>{snippet.name}</button>
                    </li>
                  )
                )}
              </ul>
            </div>

            <button
              onClick={toggleWordWrap}
              className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
              title={`Word Wrap: ${wordWrap === "on" ? "ON" : "OFF"}`}
            >
              <AlignLeft size={16} />
            </button>

            <button
              onClick={formatCode}
              className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
              title="Format Code (Ctrl+Shift+F)"
            >
              <Indent size={16} />
            </button>

            <div className="dropdown dropdown-end">
              <button
                className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                title="Editor Settings"
              >
                <Settings size={16} />
              </button>
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-gray-800 rounded-box w-64 border border-gray-700">
                <li className="menu-title text-gray-400">Editor Settings</li>
                <li>
                  <button onClick={toggleTheme}>
                    <span className="flex items-center gap-2">
                      {editorTheme === "vs-dark" ? (
                        <Sun size={14} />
                      ) : (
                        <Moon size={14} />
                      )}
                      Theme: {editorTheme === "vs-dark" ? "Dark" : "Light"}
                    </span>
                  </button>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Type size={14} />
                      Font Size: {fontSize}px
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={decreaseFontSize}
                        className="btn btn-xs btn-ghost"
                        disabled={fontSize <= 10}
                      >
                        -
                      </button>
                      <button
                        onClick={increaseFontSize}
                        className="btn btn-xs btn-ghost"
                        disabled={fontSize >= 24}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <span>Auto Save</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-xs"
                      checked={autoSave}
                      onChange={toggleAutoSave}
                    />
                  </div>
                </li>
                <li>
                  <button onClick={clearLocalStorage}>
                    <span className="text-red-400">Clear Saved Code</span>
                  </button>
                </li>
              </ul>
            </div>

            <button
              onClick={toggleFullscreen}
              className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
              title={isFullscreen ? "Minimize" : "Maximize"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            width="100%"
            language={language.toLowerCase()}
            theme={editorTheme}
            value={code}
            onChange={(value) => {
              onCodeChange(value);
              if (!autoSave) {
                handleAddToHistory(value);
              }
            }}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: fontSize,
              wordWrap: wordWrap,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              renderWhitespace: "selection",
              renderControlCharacters: true,
              folding: true,
              showFoldingControls: "mouseover",
              matchBrackets: "always",
              scrollbar: {
                vertical: "auto",
                horizontal: "auto",
                useShadows: true,
              },
            }}
          />
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                title="Undo (Ctrl+Z)"
              >
                <History size={16} />
              </button>

              <button
                onClick={redo}
                disabled={historyIndex >= editorHistory.length - 1}
                className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                title="Redo (Ctrl+Y)"
              >
                <History className="transform rotate-180" size={16} />
              </button>

              {!autoSave && (
                <button
                  onClick={handleManualSave}
                  className="btn btn-ghost btn-sm text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                  title="Save (Ctrl+S)"
                >
                  <Save size={16} />
                </button>
              )}
            </div>

            <button
              className={`btn gap-2 ${
                isExecuting
                  ? "bg-purple-600 text-gray-300"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-gray-100 hover:from-blue-600 hover:to-purple-700"
              }`}
              onClick={onRunCode}
              disabled={isExecuting}
            >
              {!isExecuting && <Play className="w-4 h-4" />}
              {isExecuting ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizableEditor;
