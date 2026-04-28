import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cli = './bin/md2html.js';

test('reads a file argument and writes to stdout', () => {
  const tmp = join(tmpdir(), 'in.md');
  writeFileSync(tmp, '# Hello');
  const stdout = execFileSync('node', [cli, tmp], { encoding: 'utf8' });
  assert.match(stdout, /<h1[^>]*>Hello<\/h1>/);
  unlinkSync(tmp);
});

test('writes to a file with -o', () => {
  const inp = join(tmpdir(), 'in.md');
  const out = join(tmpdir(), 'out.html');
  writeFileSync(inp, '# Hi');
  execFileSync('node', [cli, inp, '-o', out]);
  const content = readFileSync(out, 'utf8');
  assert.match(content, /<h1[^>]*>Hi<\/h1>/);
  unlinkSync(inp);
  unlinkSync(out);
});
