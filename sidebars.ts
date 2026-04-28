import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  curriculum: [
    'intro',
    {
      type: 'category',
      label: 'Tier 1 — Working with a single Claude',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'M1 — Prompting as a design problem',
          items: [
            {type: 'doc', id: 'tier-1/m1-prompting/index', label: 'Concept'},
            {type: 'doc', id: 'tier-1/m1-prompting/lab/index', label: 'Lab'},
          ],
        },
        {
          type: 'category',
          label: 'M2 — Context is the product',
          items: [
            {type: 'doc', id: 'tier-1/m2-context/index', label: 'Concept'},
            {type: 'doc', id: 'tier-1/m2-context/lab/index', label: 'Lab'},
          ],
        },
        {
          type: 'category',
          label: 'M3 — From chat to Claude Code',
          items: [
            {type: 'doc', id: 'tier-1/m3-claude-code/index', label: 'Concept'},
            {type: 'doc', id: 'tier-1/m3-claude-code/lab/index', label: 'Lab'},
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tier 2 — Session management & single-agent discipline',
      collapsed: true,
      items: [
        'tier-2/m4-claude-md/index',
        'tier-2/m5-subagents/index',
        'tier-2/m6-oracle/index',
      ],
    },
    {
      type: 'category',
      label: 'Tier 3 — Orchestration & crews',
      collapsed: true,
      items: [
        'tier-3/m7-headless/index',
        'tier-3/m8-parallel/index',
        'tier-3/m9-teams/index',
        'tier-3/m10-crews/index',
      ],
    },
  ],
};

export default sidebars;
