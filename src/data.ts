export const DATA = {
  name: 'Alexander Vervloet',
  role: 'Senior Frontend Engineer',
  location: 'Taichung, Taiwan',
  tz: 'UTC+8',
  status: 'Open to remote roles',
  github: 'alexvervloet',
  emailEncoded: 'alex.vervloet [at] gmail [dot] com',
  linkedin: 'alexander-vervloet',
  skills: [
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
    {
      group: 'workflow',
      items: [
        'Agile · Scrum · Jira',
        'Independent execution',
        'Remote-native (since 2017)',
        'Async-first',
      ],
    },
  ],
  experience: [
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
