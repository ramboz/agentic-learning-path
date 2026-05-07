import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Agentic Learning Path',
  tagline: 'A curriculum for working with Claude and Claude Code, from prompts to crews.',
  favicon: 'img/favicon.svg',

  url: 'https://ramboz.github.io',
  baseUrl: '/agentic-learning-path/',

  organizationName: 'ramboz',
  projectName: 'agentic-learning-path',
  deploymentBranch: 'gh-pages',
  trailingSlash: true,

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/ramboz/agentic-learning-path/tree/main/',
          admonitions: {
            keywords: ['tldr'],
            extendDefaults: true,
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Agentic Learning Path',
      logo: {
        alt: 'Agentic Learning Path',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'curriculum',
          position: 'left',
          label: 'Curriculum',
        },
        {
          href: 'https://github.com/ramboz/agentic-learning-path',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Curriculum',
          items: [
            {label: 'Introduction', to: '/'},
            {label: 'Tier 1 — Foundations', to: '/tier-1/m1-prompting/'},
          ],
        },
        {
          title: 'Source',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ramboz/agentic-learning-path',
            },
            {
              label: 'PR Assistant Lab',
              href: 'https://github.com/ramboz/pr-assistant-lab',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Julien Ramboz. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
