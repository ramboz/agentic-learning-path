import { readFileSync, writeFileSync } from 'node:fs';
import { Command } from 'commander';
import { render } from './render.js';

export function run(argv) {
  const program = new Command();

  program
    .name('md2html')
    .description('Convert Markdown to HTML.')
    .argument('[input]', 'Path to a Markdown file. Reads from stdin if omitted.')
    .option('-o, --output <file>', 'Write HTML to a file instead of stdout.')
    .option('--allow-html', 'Pass inline HTML through unchanged. Off by default.', false);

  program.action((input, options) => {
    const markdown = input
      ? readFileSync(input, 'utf8')
      : readFileSync(0, 'utf8');

    const html = render(markdown, { allowHtml: options.allowHtml });

    if (options.output) {
      writeFileSync(options.output, html);
    } else {
      process.stdout.write(html);
    }
  });

  program.parse(argv);
}
