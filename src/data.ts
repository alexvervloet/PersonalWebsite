export const DATA = {
  name: 'Alexander Vervloet',
  role: 'AI Engineer',
  location: 'Taichung, Taiwan',
  tz: 'UTC+8',
  status: 'Open to remote roles',
  github: 'alexvervloet',
  emailEncoded: 'alex.vervloet [at] gmail [dot] com',
  linkedin: 'alexander-vervloet',
  skills: [
    {
      group: 'ai',
      items: [
        'LLM apps · RAG · agents',
        'Evals · LLM-as-judge',
        'Prompt engineering · guardrails',
        'Python · FastAPI',
        'OpenAI · Anthropic · local models',
        'Vector search · MCP',
      ],
    },
    {
      group: 'core',
      items: [
        'JavaScript / TypeScript',
        'React · React Native',
        'Node.js · NestJS',
        'REST · GraphQL',
      ],
    },
    {
      group: 'domain',
      items: [
        'Web3 / Blockchain',
        'Payment systems',
        'Unit / E2E testing',
        'UI / UX feedback',
      ],
    },
    {
      group: 'strengths',
      items: [
        'Technical communication',
        'Cross-team collaboration',
        'Product-minded thinking',
        'Explaining complexity simply',
      ],
    },
  ],
  experience: [
    {
      co: 'Independent',
      parent: undefined,
      role: 'AI Engineer',
      period: '2025 — Present',
      place: 'Remote',
      bullets: [
        'Building AI-engineering systems from scratch (no frameworks) to understand the primitives, not just the libraries — RAG pipelines, tool-using agents, eval harnesses, and prompt-injection defenses, each a runnable project with measured results.',
        'Shipped a codebase-Q&A capstone (askrepo) across eight eval-gated stages, from the first API call to a hardened, cached production app that answers questions about its own source with (path:line) citations.',
        'Publishing the work as an open, teachable series spanning RAG, agents, evals, guardrails, MCP, multimodal, fine-tuning, and local models.',
      ],
      meta: 'Every claim is backed by runnable code and measured results — including an 8B local model that edged GPT-4o-mini on answer correctness for $0.',
    },
    {
      co: 'VeVe',
      parent: 'Orbis Blockchain Technologies',
      role: 'Lead Frontend & Mobile Engineer',
      period: '2019 — 2025',
      place: 'Remote',
      bullets: [
        'Built the complete new-user onboarding flow for the mobile app launch — a 10-step guided experience that drove tens of thousands of signups in the first weeks and millions in early revenue.',
        'Owned the web payment flow for in-app currency purchases end-to-end. Millions of dollars processed. Zero critical payment bugs shipped.',
        'Built the web storefront, auction bidding system, and direct-purchase flows from scratch — the primary revenue surface for hundreds of thousands of transactions.',
        'Served as the technical translator between engineering and product. Brought into executive meetings specifically to explain complex system behavior in plain terms.',
        'Most active contributor in every planning session across six years. Highest rate of feedback adopted. Regularly the only person asking: should we actually build this?',
      ],
      meta: 'Salary 45K → 90K over 6 years, without ever requesting a formal review. Survived two company-wide layoff rounds.',
    },
    {
      co: 'Influenxio',
      parent: undefined,
      role: 'Lead Frontend Engineer',
      period: '2018 — 2019',
      place: 'Taipei, TW',
      bullets: [
        'Led frontend in a small agile team building a React platform matching brands with influencers — shipping weekly through constantly changing specs.',
        'Drove a 500% improvement in measured customer satisfaction through targeted testing, tooling improvements, and systematic refactoring.',
      ],
      meta: undefined,
    },
    {
      co: 'Inspection Advisor',
      parent: undefined,
      role: 'Frontend Specialist',
      period: '2017 — 2018',
      place: 'Remote',
      bullets: [
        'Built and maintained frontend features using React, React Native, and D3.js in a fully remote agile team, coordinating across time zones from day one.',
      ],
      meta: undefined,
    },
  ],
  projects: [
    {
      name: 'deep-dive-capstone',
      url: 'https://github.com/alexvervloet/deep-dive-capstone',
      desc: 'askrepo — a codebase Q&A tool that answers in plain English with (path:line) citations, built from scratch across eight eval-gated stages (RAG → agents → hardening → production). Its default corpus is the AI-engineering series I built it alongside, so the course answers questions about its own source.',
      tags: ['RAG', 'Agents', 'Evals', 'Python'],
    },
    {
      name: 'good-news-briefing',
      url: 'https://github.com/alexvervloet/good-news-briefing',
      desc: 'A self-hosted pipeline that runs entirely on my own GPU: a local LLM (LM Studio) scores RSS stories against a tunable editorial rubric, collapses duplicate coverage with local embeddings, and writes a warm, grouped briefing — emailed nightly by cron. Eval-gated, including an agentic optimism scorer, with a running LEARNINGS log of measured model-behavior fixes: ordering the JSON schema so the model reasons before it scores, hard rubric caps that beat soft nudges, and opaque link markers that stop the model hallucinating dead URLs.',
      tags: ['Local LLM', 'Prompt Engineering', 'Evals', 'Python'],
    },
    {
      name: 'hanzi.repeat',
      url: 'https://github.com/alexvervloet/hanzi.repeat',
      desc: 'Spaced-repetition Mandarin trainer. Built from the learning side of my brain, not the commercial side — tuned to how I actually pick up characters living in Taiwan.',
      tags: ['React', 'SRS', 'Personal'],
    },
    {
      name: 'how-i-work',
      url: 'https://github.com/alexvervloet/how-i-work',
      desc: 'A living document of how I approach engineering, communication, and collaboration. The short version of what a year of working with me feels like.',
      tags: ['README', 'Process'],
    },
  ],
} as const
