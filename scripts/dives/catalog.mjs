// The deep-dive series, as the site presents it.
//
// This is the single source of truth for slugs, titles, and ordering. The sync
// script uses `dir` to find the source markdown; the generator uses `slug` to
// build routes; the link rewriter uses both to turn repo-relative links into
// site routes or GitHub URLs.

export const GITHUB_USER = 'alexvervloet'
export const SITE_ORIGIN = 'https://www.alexvervloet.com'

// Where the DeepDives checkout lives, relative to the site repo root.
export const SOURCE_ROOT = '../../AI/DeepDives'

// Docs pulled from each dive, in the order they appear in a dive's nav.
export const DIVE_DOCS = [
  { file: 'README.md', page: '', label: 'Overview' },
  { file: 'TEXTBOOK.md', page: 'textbook', label: 'Textbook' },
  { file: 'EXERCISES.md', page: 'exercises', label: 'Exercises' },
  { file: 'WALKTHROUGH.md', page: 'walkthrough', label: 'Walkthrough' },
  { file: 'LESSONS.md', page: 'lessons', label: 'Lessons' },
]

export const DIVES = [
  // ── The core path, in order ──
  {
    slug: 'openai-api',
    dir: 'openai-api-deep-dive',
    title: 'OpenAI API',
    track: 'core',
    n: 1,
    idea: 'You send a list of messages. You get back a message. Everything else is detail on that request.',
  },
  {
    slug: 'claude-api',
    dir: 'claude-api-deep-dive',
    title: 'Claude API',
    track: 'core',
    n: 2,
    idea: 'The same idea, the Anthropic way: content blocks, tool use, and extended thinking.',
  },
  {
    slug: 'prompt-engineering',
    dir: 'prompt-engineering-deep-dive',
    title: 'Prompt Engineering',
    track: 'core',
    n: 3,
    idea: 'Shape what the model does with how you ask: zero/few-shot, chain-of-thought, roles, structure.',
  },
  {
    slug: 'rag',
    dir: 'rag-deep-dive',
    title: 'RAG',
    track: 'core',
    n: 4,
    idea: 'A model can only answer from what is in its context window. RAG is the discipline of putting the right text there.',
  },
  {
    slug: 'evals',
    dir: 'evals-deep-dive',
    title: 'Evals',
    track: 'core',
    n: 5,
    idea: 'If you cannot measure it, you cannot improve it: turn quality into a number you can rerun.',
  },
  {
    slug: 'agents',
    dir: 'agents-deep-dive',
    title: 'Agents',
    track: 'core',
    n: 6,
    idea: 'An agent is a loop: the model picks a tool, you run it, you feed the result back, until it is done.',
  },
  {
    slug: 'prompt-injection',
    dir: 'prompt-injection-deep-dive',
    title: 'Prompt Injection & Guardrails',
    track: 'core',
    n: 7,
    idea: 'Treat everything the model reads and writes as untrusted: contain the blast radius.',
  },
  {
    slug: 'ai-in-production',
    dir: 'ai-in-production-deep-dive',
    title: 'Production',
    track: 'core',
    n: 8,
    idea: 'The model call is one line. Production is the dozen lines around it that make it safe, cheap, observable, and reliable.',
  },

  // ── Bonus dives ──
  {
    slug: 'agent-harness',
    dir: 'agent-harness-deep-dive',
    title: 'Agent Harnesses',
    track: 'bonus',
    after: 'Agents (6)',
    idea: 'Once you have hand-written the loop, most agent work is building on a harness: hooks, permission policies, sandboxing, subagents, and headless runs.',
  },
  {
    slug: 'context-engineering',
    dir: 'context-engineering-deep-dive',
    title: 'Context Engineering',
    track: 'bonus',
    after: 'Agents (6), pairs with RAG (4)',
    idea: 'The model only knows what is in its context window, so manage it: conversation memory, compaction, long-term recall, and what to drop when it will not all fit.',
  },
  {
    slug: 'multimodal',
    dir: 'multimodal-deep-dive',
    title: 'Multimodal',
    track: 'bonus',
    after: 'the API dives (1-2), pairs with RAG (4)',
    idea: 'A multimodal model takes more than text: images and audio. Put the right modality in the right slot, and mind the token cost.',
  },
  {
    slug: 'realtime-voice',
    dir: 'realtime-voice-deep-dive',
    title: 'Realtime Voice',
    track: 'bonus',
    after: 'Multimodal, the API dives (1-2)',
    idea: 'Conversational voice is a low-latency, full-duplex loop: stream audio both ways, handle interruption, and choose a pipeline vs a speech-to-speech model.',
  },
  {
    slug: 'fine-tuning',
    dir: 'fine-tuning-deep-dive',
    title: 'Fine-tuning',
    track: 'bonus',
    after: 'RAG (4) + Evals (5)',
    idea: 'Fine-tuning changes how a model behaves, not what it knows: teach behavior by example, then prove it beat your baseline.',
  },
  {
    slug: 'mcp',
    dir: 'mcp-deep-dive',
    title: 'MCP',
    track: 'bonus',
    after: 'Agents (6)',
    idea: 'The Model Context Protocol: hand an LLM tools, data, and prompts from a separate process. Write the server once, any client can use it.',
  },
  {
    slug: 'local-models',
    dir: 'local-models-deep-dive',
    title: 'Local Models',
    track: 'bonus',
    after: 'the API dives (1-2), pairs with Fine-tuning',
    idea: 'An open-weight model on your machine speaks the same OpenAI API, so local is mostly an ops choice: privacy, cost, control.',
  },
  {
    slug: 'observability',
    dir: 'observability-deep-dive',
    title: 'Observability',
    track: 'bonus',
    after: 'Production (8), pairs with Evals (5)',
    idea: 'A prototype is judged once; a production system is judged continuously. Watch quality as a trend: drift, silent regressions, and alerting that does not cry wolf.',
  },
  {
    slug: 'professional-tools',
    dir: 'professional-tools-deep-dive',
    title: 'Professional Tools',
    track: 'bonus',
    after: 'everything (you need the primitives first)',
    idea: 'Volume 2: rebuild each from-scratch primitive with the tool professionals actually reach for, and measure both on the same eval.',
  },

  // ── Capstone ──
  {
    slug: 'capstone',
    dir: 'deep-dive-capstone',
    title: 'Capstone: askrepo',
    track: 'capstone',
    idea: 'One codebase Q&A tool built across eight eval-gated stages, from a first retrieval pass to a hardened, observable app.',
  },
]

// Series-level docs that live at the root of the DeepDives repo. README.md is
// excluded on purpose: the index page replaces it.
export const REFERENCE = [
  {
    slug: 'how-llms-work',
    file: 'HOW-LLMS-WORK.md',
    title: 'How LLMs Work',
    blurb: 'Next-token prediction, training, why models hallucinate, the context window. No math.',
  },
  {
    slug: 'choosing',
    file: 'CHOOSING.md',
    title: 'Choosing a Technique',
    blurb: 'Which of prompting, RAG, tools, or fine-tuning to reach for, and in what order.',
  },
  {
    slug: 'models',
    file: 'MODELS.md',
    title: 'Models & Pricing',
    blurb: 'What the current models cost and which one to default to.',
  },
  {
    slug: 'glossary',
    file: 'GLOSSARY.md',
    title: 'Glossary',
    blurb: 'The vocabulary, defined in plain terms and cross-linked to the dive that teaches it.',
  },
  {
    slug: 'textbook',
    file: 'TEXTBOOK.md',
    title: 'The Textbook',
    blurb: 'The series read as one book: the lecture chapter from every dive, in sequence.',
  },
  {
    slug: 'capstone-brief',
    file: 'CAPSTONE.md',
    title: 'Capstone Brief',
    blurb: 'What the capstone builds, stage by stage, and the eval gate on each one.',
  },
  {
    slug: 'careers',
    file: 'CAREERS.md',
    title: 'Careers',
    blurb: 'What each dive is called on a job description, and what interviewers ask about it.',
  },
  {
    slug: 'safety',
    file: 'SAFETY.md',
    title: 'Safety',
    blurb: 'The cross-cutting safety view: what can go wrong across every dive at once.',
  },
  {
    slug: 'responsibility',
    file: 'RESPONSIBILITY.md',
    title: 'Responsibility',
    blurb: 'Building this stuff responsibly, beyond the safety mechanics.',
  },
  {
    slug: 'secrets',
    file: 'SECRETS.md',
    title: 'Secrets',
    blurb: 'Where your API keys go, which is not .env.',
  },
  {
    slug: 'authoring-lessons',
    file: 'AUTHORING-LESSONS.md',
    title: 'Authoring Lessons',
    blurb: 'What writing the series taught me about teaching a technical subject honestly.',
  },
]

export const DIVE_BY_DIR = new Map(DIVES.map((d) => [d.dir, d]))
export const REFERENCE_BY_FILE = new Map(REFERENCE.map((r) => [r.file, r]))

export function repoUrl(dive) {
  return `https://github.com/${GITHUB_USER}/${dive.dir}`
}
