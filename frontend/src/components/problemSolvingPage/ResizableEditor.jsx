// components/ResizableEditor.jsx
import React from 'react';
import Editor from '@monaco-editor/react';
import { Terminal, Play, Maximize2, Minimize2 } from 'lucide-react';
import { useEditorSizeStore } from '../../store/useEditorSizeStore';

const ResizableEditor = ({ 
  code, 
  language, 
  onCodeChange, 
  onRunCode, 
  isExecuting 
}) => {
  const { isFullscreen, toggleFullscreen } = useEditorSizeStore();

  return (
    <div className={`card bg-base-100 shadow-xl ${isFullscreen ? 'fixed inset-0 z-50 mt-21' : 'relative'}`}>
      <div className="card-body p-0 h-full flex flex-col">
        <div className="tabs tabs-bordered flex justify-between items-center">
          <button className="tab tab-active gap-2">
            <Terminal className="w-4 h-4" />
            Code Editor
          </button>
          <button
            onClick={toggleFullscreen}
            className="btn btn-ghost btn-sm mr-2"
            title={isFullscreen ? "Minimize" : "Maximize"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        <div className="flex-1">
          <Editor
            height="100%"
            width="100%"
            language={language.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={onCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>
        <div className="p-4 border-t border-base-300 bg-base-200">
          <div className="flex justify-between items-center">
            <button
              className={`btn btn-primary gap-2 ${
                isExecuting ? "loading" : ""
              }`}
              onClick={onRunCode}
              disabled={isExecuting}
            >
              {!isExecuting && <Play className="w-4 h-4" />}
              Run Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizableEditor; 