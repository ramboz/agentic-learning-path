import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'img']);

const ALLOWED_ATTRIBUTES = {
  ...sanitizeHtml.defaults.allowedAttributes,
  a: ['href', 'name', 'target', 'rel'],
  img: ['src', 'alt', 'title']
};

/**
 * Strip unsafe HTML tags and attributes from a string.
 */
export function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    transformTags: {
      'a': addRelNoopener
    }
  });
}

function addRelNoopener(tagName, attribs) {
  return {
    tagName,
    attribs: {
      ...attribs,
      rel: 'noopener noreferrer'
    }
  };
}
