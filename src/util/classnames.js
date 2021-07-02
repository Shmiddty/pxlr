export default function classnames(obj) {
  return Object
    .entries(obj)
    .filter(([,v]) => v)
    .map(([k]) => k)
    .join(' ');
}
