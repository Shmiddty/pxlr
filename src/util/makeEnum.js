export default function makeEnum(items) {
  return items.reduce((o, item) => {
    const s = Symbol(item);
    o[item] = s;
    o[s] = item
    return o;
  }, {});
}
