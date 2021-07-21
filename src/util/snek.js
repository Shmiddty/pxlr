// converts camelCase to snake-case
export default function snek(str) {
  let o = '';
  for (let i = 0, len = str.length; i < len; i++) {
    const c = str[i].toLowerCase();
    if (c === str[i]) o += c;
    else o += '-' + c;
  }
  return o;
}

// converts camelCase to Title Case
export function srs(str) {
  let o = str[0].toUpperCase();
  for (let i = 1, len = str.length; i < len; i++) {
    const c = str[i].toLowerCase();
    if (c === str[i]) o += c;
    else o += ' ' + str[i];
  }
  return o;

}
