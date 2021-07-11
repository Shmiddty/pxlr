export default function classnames(...args) {
  return args.filter(Boolean).map(cn => 
    typeof cn === "string" ? cn:
      Object
        .entries(cn)
        .filter(([,v]) => v)
        .map(([k]) => k)
        .join(' ')
  ).join(' ')
}
