# md2html

A small CLI that converts Markdown to HTML.

This is a sample codebase used in the *Working with Claude* curriculum. It's
deliberately small. Module 3 uses it as the working repo for learning Claude
Code mechanics. From Module 4 onward, the curriculum's anchor project (PR
Assistant) reviews code in this repo as its target.

## Install

Requires Node.js 18 or later.

```
npm install
```

## Use

Convert a Markdown file:

```
node bin/md2html.js README.md
```

Or pipe from stdin:

```
echo "# Hello" | node bin/md2html.js
```

Write to a file:

```
node bin/md2html.js README.md -o output.html
```

By default, inline HTML in the source is sanitized: dangerous tags
(`<script>`, event handlers, `javascript:` URLs) are stripped. Pass
`--allow-html` to disable sanitization. Only do that for trusted input.

## Run tests

```
npm test
```

Tests use Node's built-in test runner (no extra dependency needed).

## License

MIT.
