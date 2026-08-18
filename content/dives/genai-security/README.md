# GenAI Security: A Guided Deep Dive

Prompt injection is one attack. A production generative-AI system also has data,
models, dependencies, retrieval indexes, tools, identities, interpreters, networks,
budgets, logs, and operators. Every one is part of its security boundary.

This course builds a small security control plane around a deterministic, offline AI
application. It begins with a threat model and ends with a release review that attacks
the same naive and hardened system and emits evidence an engineer can inspect.

The one big idea:

> **Treat the model as an untrusted principal, not a security boundary.**

Model output is untrusted input. Model intent never grants authority. Enforceable
boundaries live in ordinary code: trusted identity, least privilege, validated sinks,
network policy, isolation, provenance, budgets, audit records, and tested recovery.

This is Chapter 20 of the AI Engineering Deep Dives. It follows
[Prompt Injection & Guardrails](https://github.com/alexvervloet/prompt-injection-deep-dive)
and [AI Data Engineering](https://github.com/alexvervloet/ai-data-engineering-deep-dive),
then feeds into
[AI in Production](https://github.com/alexvervloet/ai-in-production-deep-dive).
Prompt injection remains the focused treatment of instruction/data confusion; this
repository covers the larger system that must remain safe when a model is wrong or
compromised.

## What you will build

By the end, you will be able to:

- turn assets, trust boundaries, entry points, and consequences into a threat model;
- cover the complete OWASP LLM Top 10 2025 surface without mistaking a list for your
  system's threat model;
- keep restricted data out of context, output, logs, and incident evidence;
- verify exact models, prompts, datasets, and dependencies before deployment;
- quarantine named poisoning signals without deleting investigative evidence;
- validate model output for JSON, SQL, and HTML sinks;
- authorize tools from authenticated identity with least privilege, bound approval,
  idempotency, timeouts, and output limits;
- enforce tenant, ACL, provenance, citation, cache, egress, and runtime boundaries;
- bound denial-of-wallet across a complete request rather than one API call;
- gate releases on attack resistance, benign utility, coverage, and evaluator health;
  and
- rehearse containment, evidence preservation, eradication, recovery, and learning.

## Why it runs offline

The complete course uses only Python's standard library. It makes no model call, needs
no API key, and contacts no external service. This is deliberate: authorization,
provenance, parsing, isolation requirements, budgets, and incident state must be
testable independently of whichever model happens to sit inside them.

The examples simulate model proposals. They do not claim that deterministic strings
measure a production model. Replace those adapters with staging integrations while
retaining the same invariants and failure tests.

## Setup

Python 3.11 or newer is required.

```bash
git clone https://github.com/alexvervloet/genai-security-deep-dive.git
cd genai-security-deep-dive
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
python -m pip install -r requirements.txt
python check_setup.py
```

Expected final lines:

```text
package: genai_security import OK
capstone: deterministic control suite OK

All lessons are ready. No credentials or external services are required.
```

The editable install in `requirements.txt` matters more than it looks. Running
`python examples/01_threat_model.py` puts `examples/` on Python's import path, not the
repository root, so `import genai_security` resolves only once the package itself is
installed. Install first, then run the labs.

## Learning path

Run the lessons in order. Each file begins with the prediction to make before running,
the command, the invariant to inspect, and a pointer to what comes next.

| # | Lesson | Core boundary | Primary risk |
|---|---|---|---|
| 1 | Threat modelling | Assets, owners, flows, entry points | All |
| 2 | Sensitive data | Context minimization and output inspection | LLM02, LLM07 |
| 3 | Supply chain | Immutable versions, digests, approval | LLM03 |
| 4 | Poisoning | Record and population gates | LLM04 |
| 5 | Output handling | Exact schemas and sink encoding | LLM05 |
| 6 | Agency and identity | Trusted principal and bound approval | LLM01, LLM06 |
| 7 | Vector isolation | Prefilter, cache scope, pinned evidence | LLM08, LLM09 |
| 8 | Egress and SSRF | Scheme/host/port/address/redirect policy | CWE-918 |
| 9 | Sandboxing | Contract for a real isolated runner | Code execution |
| 10 | Resource controls | Shared, atomic pre-call reservations | LLM10 |
| 11 | Red-team gate | Attacks, utility, coverage, evaluator health | Verification |
| 12 | Incident response | Contain before tested recovery | Operations |

The `LLM01`-`LLM10` codes are the
[OWASP Top 10 for LLM and GenAI Applications 2025](https://genai.owasp.org/llm-top-10/),
a shared vocabulary for naming these failures in a review. Section 20.2 of the textbook
lists all ten against the boundary each one needs, and explains why a numbered list is a
checklist rather than a threat model.

Read [TEXTBOOK.md](TEXTBOOK.md) with the labs for the complete Chapter 20 lecture.
Use [EXERCISES.md](EXERCISES.md) to extend every invariant rather than merely observing
the demonstration.

### 1. Threat modelling

```bash
python examples/01_threat_model.py
```

Observe that assigning `LLM01` does not close the risk. The first model reports an
uncontrolled boundary and an open score-20 risk; findings clear only when a concrete
authorization boundary and mitigation are present. In a real review, retain residual
risk rather than treating mitigation as elimination.

### 2. Sensitive data and prompt leakage

```bash
python examples/02_sensitive_data.py
```

The internal order status enters context, while the restricted token is excluded and
represented only by a keyed fingerprint, because an unsalted digest of a guessable value
is one dictionary away from the value. An ordinary email is redacted at output, and an
exact secret canary blocks the response. Search context, output, logs, traces, and
exceptions, not just the user-visible answer.

### 3. Supply-chain provenance

```bash
python examples/03_supply_chain.py
```

The approved prompt and model pass source, version, signature, and payload checks. A
changed prompt produces `digest mismatch: support-prompt`. The course HMAC is a
teaching signature; production needs protected identity-backed signing and verifiable
provenance such as Sigstore/SLSA.

### 4. Data and model poisoning

```bash
python examples/04_poisoning.py
```

The gate identifies an untrusted source, blocked marker, and conflicting labels. Both
sides of the label conflict are quarantined because the detector cannot safely guess
truth. Extend this with near-duplicate, distribution, influence, and held-out behavior
tests for a real corpus.

### 5. Improper output handling

```bash
python examples/05_output_handling.py
```

Valid JSON becomes an exact typed action, SQL values stay in parameters, an unexpected
`admin` field rejects the whole proposal, and model prose is HTML-escaped. Repeat the
pattern for every downstream grammar; there is no universal output sanitizer.

### 6. Excessive agency and identity

```bash
python examples/06_agency_and_identity.py
```

A model-supplied tenant is rejected rather than silently overwritten. An irreversible
operation fails without approval and passes only with approval bound to subject,
tenant, tool, and idempotency key. The effective tenant and requester come from the
trusted session.

### 7. Vector, cache, and claim isolation

```bash
python examples/07_vector_isolation.py
```

The other tenant's semantically stronger secret never becomes a ranking candidate.
The cache key is bound to tenant, principals, query, and corpus version. A factual
claim then retains an approved source version, digest, and exact quote. Structural
evidence does not by itself prove semantic entailment; keep a separate factuality
evaluation.

### 8. Egress and SSRF

```bash
python examples/08_egress_and_ssrf.py
```

Three identical URLs with three different DNS answers. The allowlisted name passes with
a global address and fails when the same name resolves to loopback or to the cloud
metadata address, which no check on the URL string could catch. A plaintext metadata URL
fails earlier, at the scheme, before any lookup. A redirect to an unapproved host fails
too. The lesson opens no socket. A production client must connect to the exact checked
address so a second DNS lookup cannot rebind it.

### 9. Generated-code isolation

```bash
python examples/09_sandbox_boundaries.py
```

The request is denied for network, root identity, secret environment, and a writable
mount outside scratch. The example then lists guarantees only the real container,
microVM, or managed runner can enforce. No generated code executes on the host, and
the Python function is intentionally not described as a sandbox.

### 10. Unbounded consumption

```bash
python examples/10_resource_controls.py
```

One reservation charges once across replay. An oversized recursive branch is rejected
before work and leaves all counters unchanged. Real distributed agents need the same
atomic reservation invariant in a concurrency-safe shared store.

### 11. Red-team release gates

```bash
python examples/11_redteam_gate.py
```

Allow-all fails with 100% attack success. Block-all also fails because benign utility
falls to zero. The third system passes everything and proves nothing: it answers from
the probe list itself, which is what a suite satisfied without controls is worth. The
capstone wires the same gate to real boundaries. Missing categories and evaluation
exceptions are also failures in the tested gate.

### 12. Incident response

```bash
python examples/12_incident_response.py
```

Recovery directly after detection is rejected. The exercised path preserves a digest,
contains, records root cause and regression, passes the gate, recovers, and closes with
an owner. Hash chaining detects changed metadata but not a deleted tail: the run shows a
truncated log verifying cleanly until it is checked against an anchored head. Production
still needs restricted, durable, append-only evidence storage.

## Hands-on capstone

Run the complete release review twice:

```bash
python hands_on/security_review.py
python hands_on/security_review.py
```

Expected output on each run:

```text
GENAI SECURITY RELEASE REVIEW
  naive gate passed: False
  hardened gate passed: True
  evidence: security-report.json
  release ready: True
```

The command attacks the same allow-all and hardened boundary across benign utility,
all ten OWASP 2025 categories, SSRF, and generated-code isolation. It exits nonzero
unless the naive implementation fails and the hardened implementation passes. It
writes deterministic `security-report.json`, which is ignored by Git so release
systems can archive it separately.

Inspect the report:

```bash
python -m json.tool security-report.json
```

Each result carries a `control` field naming the boundary that decided it. Read those
before trusting a pass: a probe can block for a reason unrelated to the risk it is named
after, and an outcome alone cannot show you that. The naive system records no controls,
which is the point of it.

Then extend it with a risk from your own threat model. A top-ten-only capstone is not a
complete security review.

## Verification

Run the entire offline suite:

```bash
python -m unittest discover -v
```

The tests cover successful decisions, actual security denials, malformed input,
exceptions, replay/idempotency, atomic failures, cross-tenant access, changed
provenance, damaged audit chains, benign utility, and broken evaluation coverage.

To reproduce CI locally after activating the environment:

```bash
python check_setup.py
python -m compileall -q genai_security examples hands_on tests check_setup.py
python -m unittest discover -v
for example in examples/[0-9][0-9]_*.py; do python "$example"; done
python hands_on/security_review.py
python hands_on/security_review.py
```

CI runs this matrix on the minimum supported Python (3.11) and a current Python (3.13)
and verifies that test discovery finds a nonzero number of tests.

## Repository map

```text
genai_security/                 executable security controls
  threats.py                   assets, flows, ranked risks, OWASP taxonomy
  data.py                      context minimization and disclosure inspection
  provenance.py                artifact manifests, digest and approval checks
  poisoning.py                 record and corpus quarantine findings
  sinks.py                     strict JSON, parameterized SQL, escaped HTML
  capabilities.py              identity, roles, approval, idempotency, limits
  vectors.py                   tenant/ACL/provenance prefilter and cache keys
  claims.py                    pinned structural evidence for factual claims
  network.py                   SSRF-resistant egress planning
  isolation.py                 pre-execution contract for a real runner
  resources.py                 request-wide atomic reservations
  redteam.py                   adversarial evaluation and release policy
  incidents.py                 stateful response and tamper-evident audit metadata
examples/                      twelve narrated, executable lessons
hands_on/security_review.py    deterministic naive-vs-hardened capstone
tests/                         offline security-invariant test suite
check_setup.py                 environment and capstone readiness check
TEXTBOOK.md                    full Chapter 20 lecture
EXERCISES.md                   progressive engineering exercises
LESSONS.md                     surprises learned while building the course
```

## What this course proves, and what it does not

The offline suite proves the behavior of these teaching policies. It does not prove:

- that your identity provider supplies the correct tenant and roles;
- that a vector database applies prefilters before its actual similarity engine;
- that an HTTP client connects to the same address your policy resolved;
- that a container or microVM resists escape and resource exhaustion;
- that artifact builders and signing identities are protected;
- that provider retention and regional settings match privacy policy;
- that distributed budget and idempotency stores are atomic under concurrency; or
- that a production model resists your task-specific attacks while retaining utility.

Those claims need integration and end-to-end tests against the real infrastructure.
Keep the invariants from this repository and replace the adapters.

## Standards baseline

This August 2026 course uses dated primary baselines so future readers can identify
drift:

- [OWASP Top 10 for LLM and GenAI Applications 2025](https://genai.owasp.org/llm-top-10/)
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [NIST SP 800-218A: Secure Software Development Practices for Generative AI](https://csrc.nist.gov/pubs/sp/800/218/a/final)
- [NIST AI Risk Management Framework and Generative AI Profile](https://www.nist.gov/itl/ai-risk-management-framework)
- [SLSA provenance v1.2](https://slsa.dev/spec/v1.2/provenance)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [CWE-918: Server-Side Request Forgery](https://cwe.mitre.org/data/definitions/918.html)

Frameworks change. Re-check current versions during a real review and record the exact
version your evidence targets.

## Troubleshooting

**`ModuleNotFoundError: genai_security`**

Activate the environment and run `python -m pip install -r requirements.txt`. For a
temporary pre-install development check only, use `PYTHONPATH=. python ...`.

**Setup reports Python older than 3.11**

Create the virtual environment with a newer interpreter, such as `python3.11 -m venv
.venv`, then reinstall.

**The capstone exits nonzero**

Open `security-report.json`. Check `hardened.gate_failures` and any result whose
`passed` value is false. An evaluator exception appears as `actual: null` and must be
fixed rather than waived as a pass.

**A test passes only when network or credentials are available**

That test does not belong in the default offline gate. Inject a deterministic adapter
for the course, and add the live behavior as a clearly separated integration suite.

## Continue

Complete [EXERCISES.md](EXERCISES.md), add a system-specific capstone risk, and carry
the resulting release evidence into
[AI in Production](https://github.com/alexvervloet/ai-in-production-deep-dive).
