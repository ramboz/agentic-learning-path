import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render } from '../lib/render.js';

test('renders a heading as <h1>', () => {
  const html = render('# Hello');
  assert.match(html, /<h1[^>]*>Hello<\/h1>/);
});

test('renders a paragraph', () => {
  const html = render('This is a paragraph.');
  assert.match(html, /<p>This is a paragraph\.<\/p>/);
});

test('renders emphasis', () => {
  const html = render('*emphasis*');
  assert.match(html, /<em>emphasis<\/em>/);
});

test('strips <script> tags by default', () => {
  const html = render('Hello <script>alert(1)</script>');
  assert.doesNotMatch(html, /<script>/);
});

test('passes inline HTML through with allowHtml: true', () => {
  const html = render('<div class="note">raw</div>', { allowHtml: true });
  assert.match(html, /<div class="note">raw<\/div>/);
});

test('adds rel="noopener noreferrer" to anchor tags', () => {
  const html = render('[link](https://example.com)');
  assert.match(html, /rel="noopener noreferrer"/);
});
