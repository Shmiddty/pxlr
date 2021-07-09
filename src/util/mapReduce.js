export default function mapReduce(obj, cb = I=>I) {
  return Object.entries(obj).reduce((o, [k,v], i) => {
    o[i] = cb(v, k, i);
    return o;
  }, []);
}
