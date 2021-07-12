const qwerty = [
  ...[].map.call('1234567890', d => 'Digit' + d),
  ...[].map.call('qwertyuiopasdfghjklzxcvbnm', c => 'Key' + c.toUpperCase()),
  'Minus',
  'Equal',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'Semicolon',
  'Quote',
  'Comma',
  'Period',
  'Slash',
  'Backquote',
  'Backspace',
  'Tab',
  'Caps',
  'Enter',
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'AltLeft',
  'AltRight',
  'Space'
];

export default qwerty;
