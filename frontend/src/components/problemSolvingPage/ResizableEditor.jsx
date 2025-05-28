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
    <div className={`card bg-gray-800 shadow-xl ${isFullscreen ? 'fixed inset-0 z-40 mt-30 border border-gray-700' : 'relative border border-gray-700'}`}>
      <div className="card-body p-0 h-full flex flex-col">
        <div className="tabs tabs-boxed bg-gray-800 flex justify-between items-center border-b border-gray-700">
          <button className="tab tab-active gap-2 text-gray-300 hover:text-gray-200">
            <Terminal className="w-4 h-4" />
            Code Editor
          </button>
          <button
            onClick={toggleFullscreen}
            className="btn btn-ghost btn-sm mr-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700"
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
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex justify-between items-center">
            <button
              className={`btn gap-2 ${isExecuting ? 'bg-purple-600 text-gray-300' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-gray-100 hover:from-blue-600 hover:to-purple-700'}`}
              onClick={onRunCode}
              disabled={isExecuting}
            >
              {!isExecuting && <Play className="w-4 h-4" />}
              {isExecuting ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResizableEditor;