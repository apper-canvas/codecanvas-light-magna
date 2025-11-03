import { useState, useRef } from "react";
import { cn } from "@/utils/cn";

const CodePanel = ({ 
  title, 
  code, 
  onChange, 
  language = "html",
  className,
  readOnly = false
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef(null);

const handleChange = (e) => {
    if (onChange && !readOnly) {
      onChange(e.target.value);
    }
  };

const handleKeyDown = (e) => {
    if (readOnly) return;
    
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      textarea.value = value.substring(0, start) + "  " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      
      if (onChange) {
        onChange(textarea.value);
      }
    }
  };

  return (
    <div className={cn("flex flex-col bg-slate-900 border border-slate-700 rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide">{title}</h3>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="flex-1 relative">
<textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className={`w-full h-full p-4 bg-transparent text-slate-100 font-mono text-sm resize-none outline-none placeholder:text-slate-500 ${
            readOnly ? 'cursor-default' : ''
          }`}
          placeholder={readOnly ? `${language.toUpperCase()} (Read-only)` : `Write your ${language.toUpperCase()} code here...`}
          spellCheck={false}
          style={{ minHeight: "300px" }}
        />
      </div>
    </div>
  );
};

export default CodePanel;