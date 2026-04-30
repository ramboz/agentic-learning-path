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
      label: 'Tier 2 — Persistence, decomposition, and quality signal',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'M4 — Writing a CLAUDE.md that earns its keep',
          items: [
            {type: 'doc', id: 'tier-2/m4-claude-md/index', label: 'Concept'},
            {type: 'doc', id: 'tier-2/m4-claude-md/lab/index', label: 'Lab'},
          ],
        },
        'tier-2/m5-rules/index',
        'tier-2/m6-subagents-skills/index',
        'tier-2/m7-oracle/index',
      ],
    },
    {
      type: 'category',
      label: 'Tier 3 — Orchestration & crews',
      collapsed: true,
      items: [
        'tier-3/m8-headless/index',
        'tier-3/m9-hooks/index',
        'tier-3/m10-parallel/index',
        'tier-3/m11-teams/index',
        'tier-3/m12-crews/index',
      ],
    },
  ],
};

export default sidebars;
