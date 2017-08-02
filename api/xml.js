'use strict'

module.exports = {
  escapeValue: escapeValue,
  mapObject: mapObject,
  tag: XMLTag
}

function XMLTag(name, value, opts = {}) {
  const options = Object.assign({
    attributes: {},
    escapeValue: true,
    if: true,
  }, opts)

  if (!options.if || (typeof options.if === "function" && !options.if())) {
    return ""
  }

  const attrs = options.attributes

  const nameXML = escapeString(name).replace(/(.)/, (_, first) => first.toUpperCase())
  const valueXML = (options.escapeValue ? escapeValue(value) : value)
  const attrsXML = Object.keys(attrs).map((attrName) => {
    return ` ${escapeString(attrName)}="${escapeString(attrs[attrName])}"`
  }).join("")

  if (valueXML === null) {
    return `<${nameXML} xsi:nil="true"/>`
  } else {
    return `<${nameXML}${attrsXML}>${valueXML}</${nameXML}>`
  }
}

function escapeString(str) {
  return String(str).replace(/(["'&<>])/g, (_, match) => {
    switch (match.charCodeAt(0)) {
      case 34: return '&quot;' // "
      case 38: return '&amp;'  // &
      case 39: return '&#39;'  // '
      case 60: return '&lt;'   // <
      case 62: return '&gt;'   // >
      default: return match
    }
  })
}

function escapeValue(value) {
  switch (true) {
    case (typeof value === "boolean"): return (value ? "true" : "false")
    case (typeof value === "number"):  return value
    case (typeof value === "object"):
      if (value === null)          { return null }
      if (value instanceof Date)   { return value.toISOString() }
      if (value instanceof Array)  { return value.join("") }
      if (value instanceof String) { return escapeString(value) }
      return XMLTag(value.name, value.value, value)
    default:
      return escapeString(value)
  }
}

function mapObject(obj) {
  return Object.keys(obj).map((key) => XMLTag(key, obj[key]))
}
