function upsertMeta(attr, key, content) {
  if (typeof document === 'undefined' || !content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function setSeo({ title, description }) {
  if (typeof document === 'undefined') return
  if (title) document.title = title
  if (description) upsertMeta('name', 'description', description)
}

export function setMetaRobots(content) {
  upsertMeta('name', 'robots', content)
}
