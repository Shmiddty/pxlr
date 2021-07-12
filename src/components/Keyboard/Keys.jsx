import React from 'react';
import keys from '../../store/keyboard/keys';
import cfg from './config';

const used = cfg.map(k => k.props.code).flat();
const unused = keys.filter(k => !used.includes(k));

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
  return  unused.map((key, i) => (
    <label 
      key={key} 
      className="key" 
      data-key={key}
    >
      <span>{codeToLabel(key)}</span>
    </label>
  ));
}
