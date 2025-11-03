import { useState, useEffect, useRef } from "react";
import CodePanel from "@/components/molecules/CodePanel";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const CodeEditor = ({ pen, onSave, onTitleChange }) => {
  const [html, setHtml] = useState(pen?.html || "");
  const [css, setCss] = useState(pen?.css || "");
  const [javascript, setJavascript] = useState(pen?.javascript || "");
  const [title, setTitle] = useState(pen?.title || "Untitled Pen");
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [showConsole, setShowConsole] = useState(true);
  const iframeRef = useRef(null);
  const consoleEndRef = useRef(null);

  // Console message capture system
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'null') return; // Only accept messages from our iframe
      
      const { type, data } = event.data;
      if (type === 'console') {
        const timestamp = new Date().toLocaleTimeString();
        const newMessage = {
          id: Date.now() + Math.random(),
          type: data.level || 'log',
          message: data.message,
          timestamp
        };
        
        setConsoleMessages(prev => [...prev, newMessage]);
      } else if (type === 'error') {
        const timestamp = new Date().toLocaleTimeString();
        const errorMessage = {
          id: Date.now() + Math.random(),
          type: 'error',
          message: `Runtime Error: ${data.message}`,
          timestamp
        };
        
        setConsoleMessages(prev => [...prev, errorMessage]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Auto-scroll console to bottom
  useEffect(() => {
    if (consoleEndRef.current && showConsole) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleMessages, showConsole]);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (html || css || javascript) {
        const penData = {
          title,
          html,
          css,
          javascript
        };
        if (onSave) {
          onSave(penData);
        }
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [html, css, javascript, title, onSave]);

  const handleSave = () => {
    const penData = {
      title,
      html,
      css,
      javascript
    };
    if (onSave) {
      onSave(penData);
      toast.success("Pen saved successfully!");
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (onTitleChange) {
      onTitleChange(newTitle);
    }
  };
const [layoutMode, setLayoutMode] = useState('horizontal'); // 'horizontal' or 'vertical'

  // Clear console messages
  const handleClearConsole = () => {
    setConsoleMessages([]);
  };

  // Clear console on code change
  useEffect(() => {
    setConsoleMessages([]);
  }, [html, css, javascript]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-xl font-semibold bg-transparent text-slate-200 border-none outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
            placeholder="Enter pen title..."
          />
        </div>
<div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowConsole(!showConsole)}
            variant="ghost"
            className="flex items-center gap-2"
            title={showConsole ? 'Hide Console' : 'Show Console'}
          >
            <ApperIcon name="Terminal" className="w-4 h-4" />
            Console
          </Button>
          <div className="w-px h-6 bg-slate-600 mx-1"></div>
          <Button 
            onClick={() => setLayoutMode(layoutMode === 'horizontal' ? 'vertical' : 'horizontal')}
            variant="ghost"
            className="flex items-center gap-2"
            title={`Switch to ${layoutMode === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
          >
            <ApperIcon 
              name={layoutMode === 'horizontal' ? 'SplitSquareVertical' : 'SplitSquareHorizontal'} 
              className="w-4 h-4" 
            />
            {layoutMode === 'horizontal' ? 'Vertical' : 'Horizontal'}
          </Button>
          <div className="w-px h-6 bg-slate-600 mx-1"></div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <ApperIcon name="Save" className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Split-Screen Layout */}
<div className={`flex-1 flex ${layoutMode === 'horizontal' ? 'flex-col' : 'flex-row'} overflow-hidden`}>
        {/* Code Editors Section */}
        <div className={`${showConsole ? (layoutMode === 'horizontal' ? 'h-1/3' : 'w-1/2') : (layoutMode === 'horizontal' ? 'h-1/2' : 'w-1/2')} flex flex-col border-b ${layoutMode === 'horizontal' ? 'border-slate-700' : 'border-r border-slate-700'}`}>
          {/* Editor Tabs */}
          <div className="flex border-b border-slate-700 bg-surface/50">
            <div className="flex items-center px-4 py-2 bg-slate-800 border-r border-slate-700">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Code</span>
            </div>
            <div className="flex">
              <div className="px-4 py-2 bg-slate-900 border-r border-slate-700">
                <span className="text-sm font-medium text-orange-400">HTML</span>
              </div>
              <div className="px-4 py-2 bg-slate-900 border-r border-slate-700">
                <span className="text-sm font-medium text-blue-400">CSS</span>
              </div>
              <div className="px-4 py-2 bg-slate-900">
                <span className="text-sm font-medium text-yellow-400">JS</span>
              </div>
            </div>
          </div>

          {/* Three Side-by-Side Editor Panels */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 border-r border-slate-700">
              <CodePanel
                title=""
                code={html}
                onChange={setHtml}
                language="html"
                className="h-full border-0 rounded-none"
              />
            </div>
            <div className="flex-1 border-r border-slate-700">
              <CodePanel
                title=""
                code={css}
                onChange={setCss}
                language="css"
                className="h-full border-0 rounded-none"
              />
            </div>
            <div className="flex-1">
              <CodePanel
                title=""
                code={javascript}
                onChange={setJavascript}
                language="javascript"
                className="h-full border-0 rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Preview Section */}
{/* Console Panel */}
        {showConsole && (
          <div className={`${layoutMode === 'horizontal' ? 'h-1/3' : 'w-1/2'} flex flex-col bg-slate-900 border-b ${layoutMode === 'horizontal' ? 'border-slate-700' : 'border-r border-slate-700'}`}>
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <ApperIcon name="Terminal" className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Console</span>
                <span className="text-xs text-slate-500">({consoleMessages.length} messages)</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={handleClearConsole}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-7 px-2 text-xs"
                  title="Clear Console"
                >
                  <ApperIcon name="Trash2" className="w-3 h-3" />
                  Clear
                </Button>
                <Button
                  onClick={() => setShowConsole(false)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 h-7 px-2 text-xs ml-1"
                  title="Hide Console"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
              {consoleMessages.length === 0 ? (
                <div className="text-slate-500 text-center py-4">
                  Console output will appear here...
                </div>
              ) : (
                <div className="space-y-1">
                  {consoleMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2 py-1">
                      <span className="text-xs text-slate-500 whitespace-nowrap mt-0.5">
                        {msg.timestamp}
                      </span>
                      <div className={`flex-1 ${
                        msg.type === 'error' ? 'text-red-400' :
                        msg.type === 'warn' ? 'text-yellow-400' :
                        msg.type === 'info' ? 'text-blue-400' :
                        'text-slate-300'
                      }`}>
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 mt-1.5 ${
                          msg.type === 'error' ? 'bg-red-400' :
                          msg.type === 'warn' ? 'bg-yellow-400' :
                          msg.type === 'info' ? 'bg-blue-400' :
                          'bg-slate-400'
                        }`}></span>
                        <span className="break-words">{msg.message}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className={`${showConsole ? (layoutMode === 'horizontal' ? 'h-1/3' : 'w-1/2') : (layoutMode === 'horizontal' ? 'h-1/2' : 'w-1/2')} flex flex-col bg-slate-900`}>
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">Result</h3>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <iframe
title="Code Preview"
            ref={iframeRef}
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>${css}</style>
                </head>
                <body>
                  ${html}
                  <script>
                    // Console override to capture messages
                    (function() {
                      const originalLog = console.log;
                      const originalError = console.error;
                      const originalWarn = console.warn;
                      const originalInfo = console.info;
                      
                      console.log = function(...args) {
                        window.parent.postMessage({
                          type: 'console',
                          data: { level: 'log', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') }
                        }, '*');
                        originalLog.apply(console, args);
                      };
                      
                      console.error = function(...args) {
                        window.parent.postMessage({
                          type: 'console',
                          data: { level: 'error', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') }
                        }, '*');
                        originalError.apply(console, args);
                      };
                      
                      console.warn = function(...args) {
                        window.parent.postMessage({
                          type: 'console',
                          data: { level: 'warn', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') }
                        }, '*');
                        originalWarn.apply(console, args);
                      };
                      
                      console.info = function(...args) {
                        window.parent.postMessage({
                          type: 'console',
                          data: { level: 'info', message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ') }
                        }, '*');
                        originalInfo.apply(console, args);
                      };
                      
                      // Capture runtime errors
                      window.addEventListener('error', function(e) {
                        window.parent.postMessage({
                          type: 'error',
                          data: { message: e.message + ' (Line: ' + e.lineno + ')' }
                        }, '*');
                      });
                    })();
                    
                    ${javascript}
                  </script>
                </body>
              </html>
            `}
            className="flex-1 w-full bg-white"
            frameBorder="0"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;