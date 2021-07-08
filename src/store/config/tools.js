export const palette = [
  ...'1234567890'.split('').map((k, i) => ({ name: k, key: k, index: i }))
];

export const brushes = [
  { name: "square", icon: "mdi mdi-square-outline" },
  { name: "circle", icon: "mdi mdi-circle-outline" }
];
export const BRUSH = brushes.reduce((o, { name }, i) => {
  o[name.toUpperCase()] = i;
  return o;
}, {});

export const modes = [
  { name: 'pencil', key:'q', icon: 'mdi mdi-pencil'  }, 
  { name: 'bucket', key:'w', icon: 'mdi mdi-format-color-fill' }, 
  { name: 'eraser', key:'e', icon: 'mdi mdi-eraser-variant' }, 
  { name: 'darken', key:'a', icon: 'mdi mdi-brightness-6 mdi-flip-h' }, 
  { name: 'lighten', key:'s', icon: 'mdi mdi-brightness-6' }, 
  { name: 'dropper', key:'d', icon: 'mdi mdi-eyedropper' }
];

export const MODE = modes.reduce((o, { name }, i) => {
  o[name.toUpperCase()] = i;
  return o;
}, {});

export const MIRROR = {
  NONE: 0,
  VERTICAL: 2**0,
  HORIZONTAL: 2**1,
  BOTH: 2**0 + 2**1
};

export const symmetries = [0, 30, 45, 60, 90, 120, 180];

export const toggles = [
  { 
    name: 'mirror-vertically', 
    key: 'z', 
    value: MIRROR.VERTICAL,
    icon: 'mdi mdi-reflect-vertical'
  },
  { 
    name: 'mirror-horizontally', 
    key: 'x', 
    value: MIRROR.HORIZONTAL,
    icon: 'mdi mdi-reflect-horizontal'
  }
];

export const tools = [
  { 
    name: 'flip-vertically', 
    key: 'f',
    icon: 'mdi mdi-flip-vertical'
  },
  { 
    name: 'flip-horizontally', 
    key: 'g',
    icon: 'mdi mdi-flip-horizontal'
  },
  { 
    name: 'previous-color',
    key: '-',
    icon: 'mdi mdi-arrow-left-bold'
  },
  { 
    name: 'next-color',
    key: '=',
    icon: 'mdi mdi-arrow-right-bold'
  },
  { 
    name: 'rotate-counter-clockwise', 
    key: 'r', 
    icon: 'mdi mdi-format-rotate-90'
  },
  { 
    name: 'rotate-clockwise', 
    key: 't',
    icon: 'mdi mdi-format-rotate-90 mdi-flip-h' 
  },
  { 
    name: 'decrease-dimensions', 
    key: '[',
    icon: 'mdi mdi-image-size-select-small'
  },
  { 
    name: 'increase-dimensions', 
    key: ']',
    icon: 'mdi mdi-image-size-select-large'
  },
  { 
    name: 'clear', 
    key: 'Backspace',
    icon: 'mdi mdi-trash-can'
  },
  {
    name: 'undo',
    key: 'u',
    icon: 'mdi mdi-undo'
  },
  { 
    name: 'redo',
    key: 'i',
    icon: 'mdi mdi-redo'
  },
  { 
    name: 'decrease-brush-size',
    key: ';',
    icon: 'mdi mdi-minus-thick'
  },
  {
    name: 'increase-brush-size',
    key: "'",
    icon: 'mdi mdi-plus-thick'
  }
];
