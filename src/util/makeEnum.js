export default function makeEnum(items) {
  return items.reduce((o, item) => {
    o[item] = Symbol(item);
    return o;
  }, {});
}
