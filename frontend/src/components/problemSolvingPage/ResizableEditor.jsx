import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import Editor from '@monaco-editor/react';
import { Terminal, Play, Maximize2, Minimize2, Sparkles, Check, X } from 'lucide-react';
import { useEditorSizeStore } from '../../store/useEditorSizeStore';

const ResizableEditor = forwardRef(({ 
  code, 
  language, 
  onCodeChange, 
  onRunCode, 
  isExecuting,
  isAICompletionActive,
  onToggleAICompletion,
  completionText,
  onAcceptCompletion,
  onRejectCompletion,
  onRequestCompletion,
  onEditorMount,
  isLoadingCompletion,
}, ref) => {
  const { isFullscreen, toggleFullscreen } = useEditorSizeStore();
  const [editorInstance, setEditorInstance] = useState(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [lastChangeTime, setLastChangeTime] = useState(0);

  const handleEditorDidMount = (editor, monaco) => {
    setEditorInstance(editor);
    if (ref) {
      ref.current = editor;
    }
    
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition(e.position);
    });

    // Add keybinding for accepting suggestions with Tab
    editor.addCommand(monaco.KeyCode.Tab, () => {
      if (showCompletion && completionText) {
        handleAcceptCompletion();
        return;
      }
      editor.trigger('keyboard', 'type', { text: '\t' });
    });

    // Add keybinding for rejecting suggestions with Escape
    editor.addCommand(monaco.KeyCode.Escape, () => {
      if (showCompletion && completionText) {
        handleRejectCompletion();
      }
    });

    if (onEditorMount) {
      onEditorMount(editor, monaco);
    }
  };

  const handleAcceptCompletion = useCallback(() => {
    if (completionText) {
      onAcceptCompletion(completionText);
      setShowCompletion(false);
    }
  }, [completionText, onAcceptCompletion]);

  const handleRejectCompletion = useCallback(() => {
    onRejectCompletion();
    setShowCompletion(false);
  }, [onRejectCompletion]);

  useEffect(() => {
    if (completionText && editorInstance) {
      setShowCompletion(true);
      
      if (cursorPosition) {
        const position = {
          lineNumber: cursorPosition.lineNumber,
          column: cursorPosition.column
        };
        editorInstance.revealPositionInCenter(position);
      }
    }
  }, [completionText, editorInstance, cursorPosition]);

  // Auto-request completions when typing (with debounce)
  useEffect(() => {
    if (!isAICompletionActive || !editorInstance || !cursorPosition) return;

    const debounceTimer = setTimeout(() => {
      if (Date.now() - lastChangeTime > 800 && code) {
        const currentLine = editorInstance.getModel().getLineContent(cursorPosition.lineNumber);
        const prompt = currentLine.substring(0, cursorPosition.column - 1);
        
        if (prompt.trim().length > 2 && onRequestCompletion) {
          onRequestCompletion(code, prompt);
        }
      }
    }, 800);

    return () => clearTimeout(debounceTimer);
  }, [code, cursorPosition, lastChangeTime, isAICompletionActive, editorInstance, onRequestCompletion]);

  return (
    <div className={`card bg-gray-850 shadow-xl ${isFullscreen ? 'fixed inset-0 z-40 mt-30 border border-gray-700' : 'relative border border-gray-700'}`}>
      <div className="card-body p-0 h-full flex flex-col">
        <div className="tabs tabs-boxed bg-gray-800 flex justify-between items-center border-b border-gray-700">
          <button className="tab tab-active gap-2 text-gray-300">
            <Terminal className="w-4 h-4" />
            Code Editor
          </button>
          
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={onToggleAICompletion}
              className={`btn btn-xs gap-1 ${isAICompletionActive ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Toggle AI Code Completion"
              disabled={isLoadingCompletion}
            >
              {isLoadingCompletion ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  <span>AI</span>
                </>
              )}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="btn btn-ghost btn-xs text-gray-400 hover:text-gray-300"
              title={isFullscreen ? "Minimize" : "Maximize"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <Editor
            height="100%"
            width="100%"
            language={language.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(value) => {
              setLastChangeTime(Date.now());
              onCodeChange(value);
            }}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
              suggest: {
                preview: true,
                showStatusBar: true,
              },
              quickSuggestions: isAICompletionActive ? {
                comments: true,
                strings: true,
                other: true,
              } : false,
            }}
          />
          
          {showCompletion && completionText && (
            <div className="absolute bottom-4 left-4 right-4 bg-gray-800 border border-indigo-500 rounded-lg p-3 shadow-lg z-10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-indigo-400">AI Suggestion</span>
                <div className="flex gap-2">
                  <button 
                    onClick={handleAcceptCompletion}
                    className="btn btn-xs btn-success"
                  >
                    <Check className="w-3 h-3" /> Accept (Tab)
                  </button>
                  <button 
                    onClick={handleRejectCompletion}
                    className="btn btn-xs btn-error"
                  >
                    <X className="w-3 h-3" /> Reject (Esc)
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 p-2 rounded font-mono text-sm text-gray-300 whitespace-pre-wrap">
                {completionText}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            <button
              className={`btn btn-sm gap-2 ${isExecuting ? 'bg-purple-600 text-gray-300' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-gray-100 hover:from-indigo-700 hover:to-purple-700'}`}
              onClick={onRunCode}
              disabled={isExecuting || isLoadingCompletion}
            >
              {isExecuting || isLoadingCompletion ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isExecuting ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResizableEditor;