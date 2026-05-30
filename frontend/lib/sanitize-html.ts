const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'span',
]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'target', 'rel']),
};
const SAFE_URL_RE = /^(https?:|mailto:|\/|#)/i;

/**
 * Sanitize tiptap-style HTML for safe rendering.
 *
 * Drops disallowed tags, strips all event handlers, and rejects URLs that
 * aren't http(s)/mailto/relative — i.e. blocks `javascript:` payloads. Used
 * because the backend stores `editor.getHTML()` verbatim, so an untrusted
 * client could otherwise inject script.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof document === 'undefined') return '';
  const tpl = document.createElement('template');
  tpl.innerHTML = dirty;
  walk(tpl.content);
  return tpl.innerHTML;
}

function walk(node: Node): void {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      const tag = el.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        while (el.firstChild) el.parentNode?.insertBefore(el.firstChild, el);
        el.remove();
        continue;
      }
      const allowed = ALLOWED_ATTRS[tag] ?? new Set<string>();
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        if (!allowed.has(name)) {
          el.removeAttribute(attr.name);
          continue;
        }
        if (name === 'href' && !SAFE_URL_RE.test(attr.value.trim())) {
          el.removeAttribute(attr.name);
        }
      }
      if (tag === 'a') {
        el.setAttribute('rel', 'noopener noreferrer nofollow');
        el.setAttribute('target', '_blank');
      }
      walk(el);
    }
  }
}
