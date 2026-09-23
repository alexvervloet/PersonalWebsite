export const DATA = {
  name: 'Alexander Vervloet',
  role: 'Technical Product Manager · Engineer',
  location: 'Taichung, Taiwan',
  tz: 'UTC+8',
  status: 'Open to remote roles',
  github: 'alexvervloet',
  emailEncoded: 'alex.vervloet [at] gmail [dot] com',
  linkedin: 'alexander-vervloet',
  skills: [
    {
      group: 'product',
      items: [
        'Customer research · surveys',
        'Prioritization · scope tradeoffs',
        'PRD contributions · requirements',
        'A/B tests · feature flags',
        'Scrum facilitation',
        'Amplitude · Datadog · SQL',
      ],
    },
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
      group: 'engineering',
      items: [
        'TypeScript · React · React Native',
        'Next.js · Vite · Tailwind',
        'Node.js · NestJS',
        'GraphQL · REST · SSE',
        'PostgreSQL · Elasticsearch · Kafka',
        'Payments · Web3',
        'Docker · AWS · CI · testing',
      ],
    },
    {
      group: 'strengths',
      items: [
        'Technical-to-business translation',
        'Cross-team collaboration',
        'Stakeholder communication',
        'Developer training',
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
        'Shipped four distinct flagship projects that span building, running, and orchestrating LLM systems: askrepo, a codebase-Q&A app answering with (path:line) citations across eight eval-gated stages; a self-hosted local-LLM news pipeline with its own eval suite and guardrails; a harness that stress-tests the spec-driven-development workflow with gated phases and deterministic traceability checks; and Knowledge Desk, a deployed multi-tenant assistant whose permission boundary is enforced three independent times.',
        'Publishing the work as an open, teachable series spanning RAG, agents, evals, guardrails, MCP, multimodal, fine-tuning, and local models.',
      ],
      meta: 'Every claim is backed by runnable code and measured results — including an 8B local model that edged GPT-4o-mini on answer correctness for $0.',
    },
    {
      co: 'VeVe',
      parent: 'Orbis Blockchain Technologies',
      role: 'Lead Engineer',
      period: '2019 — 2025',
      place: 'Remote',
      bullets: [
        'Ran feature-specific customer surveys with the Lead Data Engineer, shipped the recommendations behind feature flags for A/B testing, then re-surveyed to check whether they had landed. Overall customer satisfaction rose nine percentage points.',
        'Helped lead feature and bug-fix prioritization inside a domain team for three years, frequently as Scrum Master, rebalancing the queue each week against results, customer needs, and company objectives.',
        'Won leadership support for folding Crafting into the existing store rather than building it as a separate section. Compared the two workflows, presented the delivery and maintenance tradeoffs, and saved an estimated three to four weeks of frontend work. That slack is what absorbed the late scope changes without moving the launch date.',
        'Contributed feature context and technical specs to PRDs, and argued for QA checkpoints during development instead of at the end by putting the risk in delivery-date terms. That feature shipped early with fewer bugs than anything else we shipped that quarter.',
        'Owned the web payment flow for in-app currency end to end, from React frontend through the GraphQL API on NestJS to Kafka event publishing. Millions of dollars processed. Zero critical payment bugs shipped.',
        'Led the migration of platform search to Elasticsearch on Node.js and NestJS, raising measured search satisfaction from 41% to 90%, then built a carousel backend service on the same infrastructure.',
        'Led the rebuild of the web platform from a base React app to Next.js, and ran the org-wide education session that cut team adoption from months to weeks. Also migrated the platform messaging layer from RabbitMQ to Kafka.',
        'Built the web storefront, auction bidding system, and direct-purchase flows from scratch, against the GraphQL API that every client on the platform read from. These became the primary revenue surface for hundreds of thousands of transactions.',
        'Built the 10-step mobile onboarding flow for the app launch, which drove tens of thousands of signups in the first weeks, and the web wallet frontend with ethers.js and web3.js.',
        'Built out Amplitude event tracking and Datadog observability across the apps, so questions about product behavior had data behind them instead of opinions.',
        'Served as the technical translator between engineering and product, brought into executive meetings specifically to explain complex system behavior in plain terms. Most active contributor in every planning session across six years, and regularly the only person asking whether we should build the thing at all.',
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
  caseStudiesUrl:
    'https://github.com/alexvervloet/how-i-work/tree/main/case-studies',
  caseStudies: [
    {
      title: 'Reframing Crafting from a new section to an integration',
      url: 'https://github.com/alexvervloet/how-i-work/blob/main/case-studies/crafting-scope.md',
      kind: 'Scope decision',
      year: '2023',
      standfirst:
        'The spec called for Crafting to be its own section of the app. Mapped against the store we\'d already shipped, the overlap was almost total, and the genuinely new surface came down to two things. I took the architectural argument to leadership as a business one.',
      outcome:
        'Shipped ahead of schedule. Three to four weeks of frontend work saved, and the slack is what absorbed late scope changes without moving the launch date.',
    },
    {
      title: 'Closing the Next.js knowledge gap before it cost us months',
      url: 'https://github.com/alexvervloet/how-i-work/blob/main/case-studies/nextjs-knowledge-gap.md',
      kind: 'Platform adoption',
      year: '2024',
      standfirst:
        'Leadership assumed the team was ready for the App Router. One-on-one, most engineers admitted they weren\'t, and we were days from kickoff. Nobody asked me to fix it. I taught the whole team, PMs and leadership included, because the architecture had product consequences they\'d need for scoping.',
      outcome:
        'Building productively within days instead of weeks. PMs used the terminology correctly in tickets from the start. The deck became the onboarding reference.',
    },
    {
      title: 'Building a communication standard across a 100-person org',
      url: 'https://github.com/alexvervloet/how-i-work/blob/main/case-studies/communication-standard.md',
      kind: 'Change management',
      year: '2022 — 2023',
      standfirst:
        'You could predict how well a team delivered from its communication habits. Nobody owned the problem. I watched quietly for weeks first, then ran working groups picked for willingness to be critical, so the teams felt they\'d written it themselves.',
      outcome:
        'Became the de facto standard, part of new-hire onboarding, and cited in scope arguments. Still in active use two years after I left.',
    },
    {
      title: 'Making token swapping safe for people who had never used a wallet',
      url: 'https://github.com/alexvervloet/how-i-work/blob/main/case-studies/veve-wallet.md',
      kind: 'Designing for irreversible actions',
      year: '2021 — 2022',
      standfirst:
        'Most wallets are built by crypto people for crypto people. Our users arrived for the collectibles and ended up holding a token, so I couldn\'t assume they knew what a pending state, a rejection or a chain mismatch was. The price of misreading a screen was their own money, permanently.',
      outcome:
        'Still in production four years later, with no engineer pulled back to it. Getting the failure states right up front is what bought the silence.',
    },
    {
      title: 'Making the case for my own retention',
      url: 'https://github.com/alexvervloet/how-i-work/blob/main/case-studies/retention-letter.md',
      kind: 'Stakeholder communication',
      year: '2025',
      standfirst:
        'I found out my role was on a layoff list that was already final. The letter had to do two jobs: argue on the merits that the proposed engineering cuts went further than the strategy required, and make an evidence-based case for six years of my own contributions. Either one alone fails.',
      outcome:
        'Leadership reversed the decision. A later round in November 2025 took the role anyway, which is the honest ending.',
    },
  ],
  recommendations: [
    {
      quote:
        'His instincts around product delivery and team health would make him a strong asset in any Product Manager role.',
      who: 'Former Engineering Manager at VeVe',
      detail:
        'Managed me for 18 months. Now a Senior Engineering Manager at Atlassian.',
    },
    {
      quote:
        'He always took the time to explain technical things in business language, so everyone could understand and contribute better to discussions.',
      who: 'Lead PM at VeVe',
      detail: 'Recommendation published on LinkedIn.',
    },
  ],
  projects: [
    {
      name: 'deskhand',
      url: 'https://github.com/alexvervloet/deskhand',
      desc: 'A durable agent runtime for support operations, where the agent is allowed to do irreversible things: refund money, email a customer, cancel an order. It exists for one sentence, which is "step 7 of 12 fails after step 6 already sent the email." Five invariants, each attacked by a test that tries to break it: a worker is killed after it has already refunded a customer and a second one resumes without paying twice; a $19.00 approval is rewritten to $48.00 mid-flight and the runtime refuses rather than executing something nobody saw. 25 trajectory evals gate every merge, and they assert on the path rather than the answer. Deleting the approval check fails 14 of them; deleting the fence around untrusted content fails only 3, which is the uncomfortable half of defence in depth and is written up rather than hidden. Live at deskhand.fly.dev, where a seeded ticket carries a forged "SYSTEM:" block ordering an unapproved refund and the gate holds anyway. I then ported the runtime onto Trigger.dev to find out how much of it was essential: 204 lines deleted, and the idempotency ledger and consent binding both stayed.',
      tags: ['Agents', 'Durable execution', 'Trigger.dev', 'Live demo'],
    },
    {
      name: 'knowledge-desk',
      url: 'https://github.com/alexvervloet/knowledge-desk',
      desc: 'A multi-tenant knowledge assistant where a question can only ever reach the documents the asker is allowed to see — enforced three independent times, so no single missed filter leaks data: an org_id stamp on every query, an ACL filter inside the ranking SQL so forbidden rows are never scored, and Postgres row-level security denying by default underneath. Live at knowledge-desk.fly.dev, where two seeded tenants ask the same question and get different answers, and the tenant with no matching documents gets a refusal rather than the model\'s general knowledge. The retrieval core is 126 of its 3,169 lines; the other 96% is the operational layer — async ingestion, per-tenant and platform spend ceilings, audit, and evals that gate merges.',
      tags: ['Multi-tenant', 'RAG', 'Postgres RLS', 'Live demo'],
    },
    {
      name: 'deep-dive-capstone',
      url: 'https://github.com/alexvervloet/deep-dive-capstone',
      desc: 'askrepo — a codebase Q&A tool that answers in plain English with (path:line) citations, built from scratch across eight eval-gated stages (RAG → agents → hardening → production). Its default corpus is the AI-engineering series I built it alongside, so the course answers questions about its own source.',
      tags: ['RAG', 'Agents', 'Evals', 'Python'],
    },
    {
      name: 'good-news-briefing',
      url: 'https://github.com/alexvervloet/good-news-briefing',
      desc: 'A self-hosted pipeline that runs entirely on my own GPU: a local LLM (LM Studio) scores RSS stories against a tunable editorial rubric, collapses duplicate coverage with local embeddings, and writes a warm, grouped briefing — emailed nightly by cron. Eval-gated, including a reference-graded optimism scorer, with a running LEARNINGS log of measured model-behavior fixes: ordering the JSON schema so the model reasons before it scores, hard rubric caps that beat soft nudges, and opaque link markers that stop the model hallucinating dead URLs.',
      tags: ['Local LLM', 'Prompt Engineering', 'Evals', 'Python'],
    },
    {
      name: 'spec-harness',
      url: 'https://github.com/alexvervloet/spec-harness',
      desc: 'An instrumented lab for the specify → plan → tasks → analyze workflow companies are racing to adopt. A binding constitution gates every phase — a plan halts, citing the exact article, the moment a requirement needs the network — while a deterministic FR→plan→task traceability checker catches coverage gaps mechanically. The real deliverable is a friction journal that shows where the ceremony earns its keep and where it is overkill. Built on Claude Code phase commands and an adversarial validator subagent, backed by a typed TypeScript toolchain (12 tests).',
      tags: ['Spec-Driven Dev', 'Claude Code', 'AI Agents', 'TypeScript'],
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
  series: {
    href: '/dives/',
    title: 'AI Engineering: Deep Dives',
    standfirst:
      'A hands-on series on building with LLMs, written from scratch and readable here in full. Eight core dives that build on each other, nine bonus dives, a capstone, and the reference docs that tie them together. Every concept is a small runnable script; every claim is backed by something you can run.',
    meta: 'Series - 18 deep dives - 2025 to 2026',
    core: [
      'OpenAI API',
      'Claude API',
      'Prompt Engineering',
      'RAG',
      'Evals',
      'Agents',
      'Prompt Injection & Guardrails',
      'Production',
    ],
  },
  writing: [
    {
      title: 'I Ported a Durable Agent Runtime to Trigger.dev. The Code That Survived Is the Interesting Part.',
      href: '/writing/porting-a-durable-agent-runtime/',
      standfirst:
        'Deskhand hand-rolls durable execution on Postgres. I took the mechanism out, put a platform underneath it, and counted what was left. 204 lines went. The two mechanisms I most expected to delete stayed, and one of them got more load-bearing, not less.',
      meta: 'Engineering · 2026',
    },
    {
      title: 'I Was an AI Skeptic. Then I Realized It Was the Same Problem I Had as a Teacher.',
      href: '/writing/i-was-an-ai-skeptic/',
      standfirst:
        'I lost my job of six years, then my mother had a stroke, and AI was gutting my industry. So I stopped mocking it, learned it, and found the same problem I used to face in a classroom.',
      meta: 'Essay · 2026',
    },
  ],
} as const
