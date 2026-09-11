# Chapter 20: GenAI Security Engineering

Security isn't a prompt. It's the set of enforceable boundaries that still hold when
the model is confused, manipulated, compromised, or simply wrong.

This chapter assumes you already understand direct and indirect prompt injection. See
[Prompt Injection & Guardrails](https://github.com/alexvervloet/prompt-injection-deep-dive)
for the focused treatment. Here the model is one untrusted component inside a larger
system of data, identities, tools, interpreters, networks, build artifacts, budgets,
and operators.

## 20.1 The one big idea

> Treat the model as an untrusted principal, not a security boundary.

A principal proposes an action. A trusted reference monitor decides whether the
authenticated user may perform that exact action in the current tenant and context.
The model may help choose an invoice number; it can't choose the tenant, role,
approval, or policy used to authorize the lookup.

That produces a useful system shape:

```text
untrusted inputs                      trusted control plane

user text ---------\                 authenticated identity
retrieved text -----+-> model proposal -> schema -> authorization -> bounded effect
tool output --------/                       |             |              |
                                       reject/log     approval       validate output
model artifact -> provenance gate          |             |              |
dataset --------> poisoning gate        red-team evidence + incident response
```

The arrows are trust boundaries. Data becomes less trusted when it crosses them, not
more trusted because a capable model summarized it. Every effect is bounded again at
the component that owns it.

## 20.2 A taxonomy is a checklist, not a threat model

The [OWASP Top 10 for LLM and GenAI Applications 2025](https://genai.owasp.org/llm-top-10/)
is a strong review baseline:

| ID | Risk | Boundary emphasized in this course |
|---|---|---|
| LLM01 | Prompt Injection | Model output can't grant authority |
| LLM02 | Sensitive Information Disclosure | Minimize context; inspect every egress path |
| LLM03 | Supply Chain | Pin source, version, bytes, builder, and approval |
| LLM04 | Data and Model Poisoning | Gate records and corpus-level distributions |
| LLM05 | Improper Output Handling | Parse and encode for the exact downstream sink |
| LLM06 | Excessive Agency | Least privilege, bound approval, idempotency, limits |
| LLM07 | System Prompt Leakage | Put no secret or security boundary in a prompt |
| LLM08 | Vector and Embedding Weaknesses | Tenant/ACL/provenance filters before ranking |
| LLM09 | Misinformation | Pinned evidence, uncertainty, evals, human review |
| LLM10 | Unbounded Consumption | Shared request budgets and pre-call reservation |

The list can't know that your highest-impact asset is a signing key, that an internal
index contains acquisition documents, or that a refund tool has a weak rollback path.
Begin with the system:

1. Name assets and accountable owners.
2. Draw data flows and every trust boundary.
3. Identify entry points, identities, privileges, and interpreters.
4. Write abuse cases and consequences.
5. Rank impact and likelihood.
6. Map risks to OWASP, [MITRE ATLAS](https://atlas.mitre.org/), and relevant CWEs for
   shared vocabulary.
7. Name an enforceable mitigation, residual risk, owner, and test.

Never reduce impact because a mitigation exists. A control may reduce likelihood;
compromise can still have the same consequence. Lesson 1 makes that distinction
executable.

## 20.3 Trust boundaries beat instruction hierarchy

System prompts, delimiters, instruction hierarchies, and model-level defenses can
reduce attack success. They're defense in depth. They can't create authorization
because every instruction ultimately passes through the same probabilistic model.

Assume an attacker can influence:

- user input;
- uploaded and retrieved documents;
- web pages and tool responses;
- conversation memory;
- model-generated structured output;
- error messages returned to the model; and
- some portion of training, fine-tuning, or evaluation data.

Then ask the useful question: if the attacker fully controls the next model output,
what can the surrounding application make happen? The answer should be constrained by
identity, policy, validation, isolation, network controls, and budgets outside the
model.

## 20.4 Sensitive data: minimize before detecting

A disclosure filter is a last boundary, not a license to send secrets into context.
Classify fields, declare the task purpose, and include only the minimum necessary data.
Keep credentials in a secret manager behind narrow tools. Don't place them in system
prompts, examples, memory, traces, exception messages, or vector metadata.

There are at least four egress paths to review:

1. model-visible context and provider retention;
2. the response returned to a user;
3. tool calls, URLs, and third-party integrations; and
4. logs, traces, evaluations, support tickets, and incident evidence.

Use exact canaries in tests to make non-negotiable leaks deterministic. Pattern
detection and DLP help with unknown values but have false positives and false
negatives. Log classifications, decisions, and keyed fingerprints rather than raw
sensitive values.

Keyed matters. A plain SHA-256 of a value, truncated or not, is only as private as the
value is unguessable, and the fields this control exists to protect are rarely
unguessable: email addresses, customer identifiers, order numbers, and short codes all
come from spaces an attacker can simply enumerate and hash. Use an HMAC with a pepper
held outside the log, and treat rotating that pepper as the price of the property.

System prompt leakage belongs here too. Treat a prompt as recoverable behavior, not a
vault. If revealing a prompt exposes a credential or bypasses authorization, the
credential or authorization check is in the wrong layer.

## 20.5 Supply-chain integrity includes behavior artifacts

An AI release is a graph, not one application image. Inventory at least:

- model weights and adapters;
- tokenizers and inference runtimes;
- training, fine-tuning, retrieval, and evaluation datasets;
- prompt templates and policy files;
- application packages, base images, and native libraries; and
- the builder, workflow, and identities that approved them.

Pin immutable versions and cryptographic digests. Verify bytes at deployment and
startup, not only when downloading. A checksum detects changed bytes but doesn't say
who approved them; provenance binds artifacts to an expected source and build process.

The course uses HMAC so the approval-versus-checksum distinction works offline. A
production design should use identity-backed signing, protected builders, and
verifiable attestations. [SLSA provenance v1.2](https://slsa.dev/spec/v1.2/provenance)
describes how provenance identifies an artifact, its builder, inputs, and build
process. Verification policy, not the existence of a JSON document, is the
security control.

Reject floating versions such as `latest` and unexpected artifacts. Plan rollback as
carefully as rollout: the previous release and all of its transitive artifacts must be
known-good too.

## 20.6 Poisoning requires record and population controls

Approved origin doesn't make every record benign. Compromised accounts, connectors,
labeling workflows, and public uploads can introduce poisoning after the outer
artifact has valid provenance.

Record-level signals include:

- untrusted or missing source identity;
- duplicated identifiers or content;
- conflicting labels for normalized content;
- known trigger markers and policy-like instructions; and
- unexpected schema, size, language, or timestamp.

Population signals include:

- one source dominating a release;
- sudden distribution or label shifts;
- near-duplicate campaigns;
- unusual influence on held-out behaviors; and
- targeted regressions on protected groups or tasks.

Quarantine with stable IDs and findings. Don't silently clean away the evidence an
investigator needs. Run evaluation suites against the candidate corpus, preserve the
previous approved snapshot, and make rollback cheap.

## 20.7 Model output is a new input boundary

JSON mode proves syntax, not permission or meaning. A valid object can request an
unsupported operation, smuggle an extra field, overflow a downstream system, or carry
SQL/HTML/shell syntax in a string.

For each sink:

1. Parse a small exact schema.
2. Reject unknown and missing fields.
3. Validate types, enums, identifiers, lengths, normalization, and control characters.
4. Authorize the semantic action separately.
5. Keep values separate from interpreter syntax: parameterized SQL, argument arrays,
   and context-appropriate encoding.
6. Bound downstream time and output.
7. Treat downstream exceptions as controlled failures, not new prompt content.

Avoid generic sanitization. SQL, HTML, URLs, shell commands, file paths, and ticket APIs
have different grammars and different security properties. Often the safest design is
to remove a sink entirely: render prose as text and expose a small typed operation
instead of executing model-generated code.

## 20.8 Retrieved content is an input boundary too

The previous section treats model output as untrusted because it crosses into a sink
with a grammar. The prompt is also a document with a grammar, and retrieved passages are
concatenated into it, so the same reasoning applies in the other direction and is
skipped far more often.

A prompt has structure: section headings, evidence markers, citation keys, and a fence
separating instructions from data. If a passage is concatenated verbatim, anything it
contains joins that structure. A support ticket whose body reads `## Approved policy`
produces a heading the application never wrote. A wiki page containing `[doc:policy/7]`
produces a citation key the retriever never issued. The model can't distinguish these
from the real ones, because there's nothing to distinguish: same bytes, same position,
same meaning to a reader.

This isn't the cross-tenant problem. The passage is genuinely the caller's, genuinely
authorized, and correctly retrieved. It's lying about what kind of text it is.

Note what a citation check does and doesn't catch here. Verifying that every key in the
answer exists in the approved set is necessary and insufficient, because a model that
reads a forged policy can attribute it to the *real* key of the passage that carried it.
The citation then validates and the false claim reads as sourced. Pinning the quote to
the source text, as §20.12 requires, is what closes that; key existence alone doesn't.

Two controls, answering different questions:

1. Escape the passage so it can't write the document's grammar. Defuse headings,
   key-shaped tokens, evidence markers, and fence tags. Defuse rather than delete: after
   an incident the first question is what the document actually said, and a control that
   erases the evidence answers it badly.
2. Fence the untrusted region with a nonce generated per request. This is the actual
   boundary. A document written last week can't contain a value invented at request
   time, so forging the fence becomes impossible rather than unlikely. A fixed delimiter
   is one the attacker can simply type.

Count what you defuse and treat it as a signal. A corpus where forged-heading counts are
nonzero and rising is a corpus somebody is writing into.

Neither control stops a passage from arguing. Text that politely asks the model to
confirm an invented policy arrives intact, correctly labelled as data, and whether the
model complies is a question about the model. These controls remove the ability to
impersonate the application; they don't remove the ability to persuade it, and no
string function will. Authority still has to follow the authenticated principal.

## 20.9 Agency: authority follows the authenticated principal

An agent combines a confused-deputy problem with automation. Separate four things:

- **proposal:** the operation and ordinary arguments the model selected;
- **principal:** the authenticated subject and tenant from trusted session state;
- **policy:** the roles, object permissions, risk level, and limits;
- **approval:** a human decision bound to one exact high-risk effect.

Never accept subject, tenant, roles, or approval from model-controlled arguments. Add
trusted identity after authorization. Give every tool a narrow role allowlist, exact
argument schema, timeout, and maximum output. Require idempotency keys for writes.
Irreversible operations should be rare, separately permissioned, and bound to a human
approval containing subject, tenant, tool, object, and operation key.

A role is a statement about capability and says nothing about aim, which is the gap
that stays open when everything above is in place. Separate a third question from the
first two. *Who's asking* is the principal, *on whose installation* is the tenant, and
*about which person* is the request's scope. A support agent legitimately holds "read
customer history"; which customer is an ordinary argument, and the model chose it after
reading a ticket a stranger wrote. Tenancy doesn't help, because both people are
customers of the same merchant, which is the ordinary case rather than an edge one. So
a tool keyed by a person carries the record the request belongs to, read from the case
rather than from the proposal, and answers for that record only. Tools addressed by an
identifier the system minted don't need it, and scoping them anyway would make an
invoice unreadable from the ticket about it.

Refuse a pivot on what it names rather than rewriting it to the scoped subject. The
correction returns exactly the data the caller asked for, so nothing looks wrong at the
call site and nothing in the log says an attempt happened. This is the same argument as
rejecting a model-supplied tenant instead of overwriting it, one level further in, and
it matters more here because a read looks harmless: no approval is owed, no effect is
recorded, and the data still ends up in a conversation with a reply tool on the other
end of it.

Binding isn't freshness, and the distinction is easy to lose because both get called
replay protection. An approval bound to one subject, tenant, tool, and object can't be
*aimed* somewhere else. It can still be presented again at the same target, and an
agent that retries a failed step, resumes after a crash, or loops is a machine for
producing exactly that. Binding answers "is this approval for this operation"; it never
answers "has this approval already been spent". So an approval also needs a challenge:
issued by trusted code from a CSPRNG, valid for a short window, and consumed on use.

Two tokens, two jobs, and this is where systems conflate them:

| | who issues it | what it guarantees | may it be predictable |
|---|---|---|---|
| idempotency key | the caller may choose it | a repeat is *recognised* | yes |
| approval challenge | only the server | a repeat is *refused* | no, never |

An idempotency key isn't a nonce. It makes a duplicate submission converge on one
effect, which is a correctness property. It doesn't stop an attacker producing the
duplicate, which is the security property, and a value the model can see or compute isn't
a challenge at all. If a challenge is derived from the operation's own fields, every
input to it is visible to the thing you're defending against.

Spend the challenge at the authorization decision rather than after the effect
succeeds. A crash between decision and effect then costs one re-approval, while the
other ordering leaves a live single-use token after a failure, which is the state an
attacker is most able to arrange.

The [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
extends the system view to goal hijacking, tool misuse, identity and privilege abuse,
agent communication, memory, cascading failures, and rogue agents. These are reasons
to shrink authority and blast radius, not reasons to ask the model to be more careful.

## 20.10 Conversation state is a credential, and a turn has a subject

Stateful model APIs moved the transcript to the server. The client sends a short handle
and the provider supplies everything said so far, which makes that handle a bearer
reference to accumulated context: whoever presents it gets the material. It's usually
treated as a routing detail and given the care a routing detail gets.

Two failures follow, and the second is the one that survives a careful team.

**An unbound handle is an access-control hole.** Issue handles from a CSPRNG rather than
a counter or a hash of the participants, since a sequential id turns reading another
person's conversation into arithmetic and a derived id turns it into a hash of values
the caller already knows. Then check ownership on every resume, because handles leak
through logs, referrers, support tickets, and shared links. Give a denied resume the
same answer as a missing one; distinguishing them turns the store into a membership
oracle over the handle space. Expire conversations, and compare the handle with a
constant-time comparison, since it's a secret in every sense that matters.

**A bound handle still drifts.** This is the part that has no analogue in the earlier
sections. Context accumulated under one authorization survives into later turns and
nothing re-checks it. An operator working a queue preps one subject at nine and another
at nine fifteen, inside one conversation they own, every turn of which they were
entitled to see. Composing the second answer from the whole transcript puts the first
subject's amounts and dates into it. No permission check fires, because no permission
was exceeded.

Record each turn's subject when the turn happens, from trusted state, and filter the
transcript by it before composing. The subject can't be recovered from the text later:
the question that causes the damage is usually "what about the September obligation?",
which names nobody, and inferring a subject from prose is how one person's obligation
becomes another's. Return the withheld turns alongside the admitted ones rather than
dropping them, because "the model never saw it" and "the model saw it and ignored it"
are different incidents and only one of them is a failure of this control.

Note what kind of failure this is. Every authorization check passes and the answer is
still wrong about whose facts it's stating. Binding the handle answers whether this
caller may read this conversation; it never answers whether this turn belongs in the
answer being composed now. Treating those as one question is the mistake, and the
second one is the one a customer telephones about.

## 20.11 Retrieval: filter before similarity work

Vector databases are authorization systems once they hold multi-tenant or
access-controlled data. Store tenant, ACL, source URI, digest, version, and approval
with every chunk. Derive retrieval identity from the session. Filter candidates by
tenant, effective principals, and source approval before ranking.

Post-filtering is unsafe because unauthorized content may already influence:

- similarity scores and top-k selection;
- model context;
- traces and evaluation artifacts;
- caches; and
- timing or count side channels.

Cache keys must include tenant, effective principals, normalized query, corpus version,
and any policy state that changes visibility. An empty ACL denies at ingestion. Test
cross-tenant, cross-role, revoked-source, stale-cache, and duplicate-ID paths.

## 20.12 Misinformation and evidence

Security includes integrity: confidently wrong output can cause financial, medical,
legal, or operational harm even without a malicious attacker.

Require factual claims to carry source IDs, immutable versions, digests, and exact
evidence spans. Verify that each source is approved and each quote exists in the pinned
content. This detects detached, invented, or stale citations.

It does **not** prove entailment. A real system still needs task-specific factuality and
calibration evaluations, conflict handling, abstention, source-quality policy, and
human review for high-consequence decisions. UI design must not imply that the mere
presence of a link proves a claim.

Measure downstream decision quality, not just fluent similarity to a reference answer.

## 20.13 Egress and SSRF

Any model-selected URL is attacker controlled. Server-side request forgery can reach
cloud metadata, loopback services, private control planes, and credentials embedded in
internal endpoints. [CWE-918](https://cwe.mitre.org/data/definitions/918.html) describes
the underlying failure: the server fetches a resource chosen by an upstream actor
without sufficiently constraining the destination.

Prefer no general network tool. Where egress is necessary:

- allowlist schemes, exact hosts, and ports;
- reject userinfo and ambiguous URLs;
- resolve DNS and reject loopback, private, link-local, multicast, reserved, and other
  non-global addresses;
- reapply policy after every redirect and resolution;
- connect to the exact address that was checked, preventing time-of-check/time-of-use
  DNS rebinding;
- isolate the egress proxy from sensitive networks; and
- bound request bytes, response bytes, redirects, and time.

String matching a URL isn't enough. Lesson 8 uses an injected resolver and makes no
network request so every path stays deterministic.

## 20.14 Generated-code isolation

`eval`, `exec`, subprocess calls, import filters, and Python object tricks don't create
a trustworthy sandbox inside the application process. If generated code is a product
requirement, move it to a real isolation boundary such as a short-lived container,
microVM, or managed runner.

The runtime contract should include:

- a fresh environment per operation;
- an allowlisted program and argument array;
- non-root identity and no privilege escalation;
- read-only root filesystem;
- explicit read-only inputs and one ephemeral writable scratch root;
- mount destinations that can't overlay system paths inside the guest;
- no ambient credentials or unexpected environment variables;
- no network by default;
- CPU, memory, process, file, output, and wall-clock limits;
- kernel isolation and syscall filtering; and
- destruction after use.

The course policy validates a request *to* such a runtime. It's intentionally not
called a sandbox. Symlink handling, mounts, namespaces, kernel configuration, and
resource enforcement must be proven by integration tests against the actual runner.

## 20.15 Unbounded consumption and denial-of-wallet

Per-minute rate limits don't bound one accepted request. A shared request budget must
cover input and output tokens, model calls, tool calls, agent steps, retries, bytes,
wall time, and maximum monetary cost.

Reserve worst-case consumption before starting external work. That creates three
important invariants:

1. concurrent branches can't both spend the last remaining budget;
2. failed reservations mutate no counters; and
3. retries with the same operation key charge once.

Validate the limits themselves before trusting them, and check finiteness before
magnitude. Every guard in a budget is an ordered comparison, and every ordered
comparison against NaN is false, so a NaN limit passes a `< 0` check, passes a `<= 0`
check, and then loses every comparison that would have rejected a charge. The control
doesn't fail; it switches itself off and keeps reporting success. A limit arriving as
NaN or infinity isn't exotic: it comes from a config file, a unit conversion, or a
division that found a zero. This module shipped with exactly that hole until a reader
went looking for it.

Place limits at multiple scopes: request, user, tenant, tool, and provider account.
Use circuit breakers and backpressure for shared dependencies. Return a bounded error
instead of asking the model to repeatedly repair an exhausted operation.

Now read that list of resources again and ask whose each one is. Tokens, calls, steps,
bytes, latency, and cost are all yours. They get bounded early and thoroughly for a
reason that is worth naming rather than admiring: the person writing the limits is the
person who receives the bill. An agent permitted to refund, credit, discount, waive a
fee, or upgrade a plan is moving somebody else's money, and in most systems that number
exists only as a figure on a dashboard. Denial-of-wallet has a second form, and it
empties the wrong wallet.

The shape of the ceiling differs too, which is why copying the request budget doesn't
work. A per-request limit bounds one request, and it bounds a day only if the number of
requests is bounded, which nothing does: a retry, a redelivered queue message, or one
customer opening four tickets each produce a fresh request that is individually well
behaved. So the second scope is the account over a rolling window, and it's the one
that actually caps exposure. Charge it before the payment for the same reason you
reserve tokens before the call, since a ceiling verified afterwards is a report.

Two things this isn't. It isn't an approval gate and doesn't replace one: approval
asks a person about one payment, and this holds whatever the person decides, which
matters precisely because the failure mode is a series of individually reasonable
approvals on a busy afternoon. And it isn't satisfied by a per-order or per-item
sanity check, which answers whether one payment is proportionate to one object and says
nothing about a run that touches four objects once each.

The general rule generalises past money. For every resource an agent can move, ask who
owns it. Reputation, a customer's inbox, a partner's rate limit, and a counterparty's
support queue are all things an agent can spend on somebody else's behalf, and all of
them tend to be measured rather than bounded.

## 20.16 Red-team tests are release tests

An adversarial string collection becomes an engineering control when every probe has:

- a stable ID and risk category;
- a documented entry point and expected outcome;
- a benign counterpart where false positives matter;
- deterministic setup or a recorded stochastic protocol;
- retained result and diagnostic evidence; and
- a threshold that blocks release.

Measure attack success rate and benign pass rate together. "Block everything" isn't a
secure product. Require coverage of the risks named in the threat model. Count harness
exceptions and missing categories as failures; otherwise a broken evaluator produces a
comforting green dashboard.

Test controls at layers:

- unit tests for parsers and policy decisions;
- integration tests for identity, vector-store, egress-proxy, and sandbox boundaries;
- end-to-end attacks against the complete staging system; and
- abuse monitoring and canaries in production.

Version attacks and expected outcomes beside the code. When an incident finds a new
path, add the smallest reproducible probe before recovering service.

## 20.17 Incident response is part of the design

Prepare system-specific containment actions before an incident:

- disable a tool or agent capability;
- revoke credentials and approval keys;
- isolate a tenant, index, corpus, model, or release;
- stop ingestion or outbound egress;
- preserve minimal evidence in restricted durable storage; and
- roll back the complete artifact graph.

Use an explicit lifecycle: detect, preserve, contain, eradicate, pass the regression
and release gates, recover gradually, and close with owned systemic actions. Recovery
before a passing gate recreates the incident.

Hash chaining makes changed audit metadata detectable; it doesn't make storage
immutable. It also has one specific blind spot worth knowing by name: a chain detects
a modified or inserted event, because every later hash depends on it, but it can't
detect a deleted tail. Any prefix of a valid chain is itself a valid chain, so an
attacker who truncates the log leaves a record that verifies cleanly. Anchoring the
head hash somewhere they don't control, a monitoring system, a trusted timestamp, or
a separate append-only store, is what turns truncation back into a detectable event.

Production evidence needs access control, retention, legal/privacy policy, trusted
timestamps, and durable append-only storage. Don't copy raw customer secrets into a
ticket merely to prove a leak occurred.

## 20.18 Secure development lifecycle

[NIST SP 800-218A](https://csrc.nist.gov/pubs/sp/800/218/a/final) augments the Secure
Software Development Framework with practices for generative AI and dual-use
foundation models. The [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
and its Generative AI Profile connect governance, mapping, measurement, and management
across the lifecycle. As of this chapter's August 2026 baseline, NIST notes that AI RMF
1.0 is under revision; record the exact framework version your program uses.

Translate lifecycle guidance into evidence:

- threat model and asset owners;
- approved artifacts and provenance verification;
- data lineage, classification, and poisoning gates;
- test results for success, denial, exceptions, replay, and damaged diagnostics;
- deployment policy and rollback rehearsal;
- monitored budgets and abuse signals;
- incident runbooks and tabletop results; and
- accepted residual risks with accountable owners and review dates.

Compliance language without executable evidence isn't a boundary.

## 20.19 Common failed approaches

**"The system prompt says never reveal secrets."** Prompts are model input. Remove the
secret and enforce disclosure policy at context and output boundaries.

**"The model only calls tools from a schema."** A schema validates shape. Trusted code
must authorize semantics against authenticated identity.

**"The conversation belongs to this user, so its history is safe to use."** Ownership
says they may read it. It says nothing about which subject the current answer is about.
Record a subject per turn and filter before composing.

**"The approval is bound to the operation, so it can't be replayed."** Binding stops it
being aimed elsewhere, not being presented twice at the same target. Add a server-issued
single-use challenge with an expiry.

**"We sanitize all model output."** There's no universal sanitizer. Parse and encode
for each exact sink.

**"The retrieved text is just data."** Only if you escaped it. Concatenated verbatim it
writes your headings and citation keys, and the model has no way to tell those from
yours. Escape the grammar and fence the region with a per-request nonce.

**"We filter vector results after search."** Unauthorized content has already affected
ranking and perhaps caches. Filter first.

**"The URL host is allowlisted."** DNS and redirects can still reach a private address.
Authorize the resolved destination at connection time.

**"The Python wrapper is a sandbox."** It's a policy helper. Isolation belongs to the
runtime and kernel boundary.

**"The budget rejects anything over the limit."** Only if the limit is a number. NaN
loses every ordered comparison, so it passes validation and then bounds nothing. Check
finiteness first.

**"Our attack suite has a 100% block rate."** Check benign utility, suite coverage, and
harness errors before celebrating.

**"A citation means the answer is factual."** Prove source approval and quote presence,
then separately evaluate entailment and decision quality.

## 20.20 Review checklist

Before release, a senior engineer should be able to answer:

- Which assets and trust boundaries exist, and who owns each high risk?
- What can an attacker control if the next model output is arbitrary?
- Which identity authorizes each effect, and can the model influence it?
- Is every high-risk approval single-use and time-bounded, or only bound to a target?
- Are conversation handles unguessable, owner-checked, expiring, and filtered by subject?
- What data is excluded from context, output, logs, and provider retention?
- Which exact behavior artifacts were built and approved by which workflow?
- How are poisoning, cross-tenant retrieval, detached citations, and stale caches tested?
- What stops retrieved text from writing your headings, citation keys, or fence?
- What prevents SSRF, generated-code escape, excessive cost, and replayed writes?
- Do adversarial gates retain benign utility and fail when their harness is damaged?
- What's the fastest tested containment action for every high-impact capability?
- Which claims rely on unit evidence, and which require staging or production proof?

If an answer is "the model should," the boundary is probably still missing.

## 20.21 From lesson to production

The repository is intentionally offline and dependency-free. That makes its invariants
easy to inspect, but it also draws a bright line around what it doesn't prove.

Before production, replace teaching adapters with:

- your identity provider and policy engine;
- artifact signing, transparency, SBOM, and deployment verification;
- real vector-store prefilter and cache integration tests;
- an egress proxy whose resolved-address behavior is tested;
- a hardened code runner tested for escape and exhaustion;
- provider-aware retention, privacy, and regional controls;
- concurrency-safe distributed budgets and idempotency storage;
- staging red-team runs and production abuse monitoring; and
- your incident platform, immutable evidence store, and on-call runbooks.

Keep the same invariants. Change the adapters, not the trust model.

## 20.22 Continue

Run the lessons in order, complete [EXERCISES.md](EXERCISES.md), then execute the
capstone twice. Inspect `security-report.json`: the naive system must fail, the hardened
system must pass, every required category must execute, and the evidence must be
identical across replays.

Then carry the release gate into
[AI in Production](https://github.com/alexvervloet/ai-in-production-deep-dive), where
deployment, observability, and operational ownership become the next boundary.
