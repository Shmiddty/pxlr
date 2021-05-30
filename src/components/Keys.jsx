import React from 'react';
import bindings from '../store/keyboard/bindings';
import keys from '../store/keyboard/keys';

export default function Keys() {
  return  keys.filter(key => !bindings[key]).map((key, i) => (
    <button 
      key={key} 
      className="key" 
      data-key={key}
      tabIndex="-1"
    >
      <span>{key}</span>
    </button>
  ));
}
