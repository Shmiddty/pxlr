import React from 'react';
import bindings from '../store/keyboard/bindings';
import keys from '../store/keyboard/keys';

function codeToLabel(code) {
  code = code.replace(/Digit|Key/, '');
  switch (code) {
    case "Backquote": return '`';
    case "Minus": return '-';
    case "Equal": return '=';
    case "BracketLeft": return '[';
    case "BracketRight": return ']';
    case "Backslash": return '\\';
    case "Semicolon": return ';';
    case "Quote": return "'";
    case "Slash": return "/";
    case "Period": return '.';
    case "Comma": return ',';
    default: return code;
  }
}

export default function Keys() {
  return  keys.filter(key => !bindings[key]).map((key, i) => (
    <button 
      key={key} 
      className="key" 
      data-key={key}
    >
      <span>{codeToLabel(key)}</span>
    </button>
  ));
}
