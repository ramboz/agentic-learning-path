import { marked } from 'marked';
import { sanitize } from './sanitize.js';

/**
 * Render Markdown to HTML.
 *
 * By default the output is sanitized: any inline HTML in the source is
 * stripped of unsafe tags and attributes before being returned. Pass
 * { allowHtml: true } to skip sanitization. Only do that for trusted input.
 */
export function render(markdown, { allowHtml = false } = {}) {
  const rawHtml = marked.parse(markdown);

  if (allowHtml) {
    return rawHtml;
  }

  return sanitize(rawHtml);
}
