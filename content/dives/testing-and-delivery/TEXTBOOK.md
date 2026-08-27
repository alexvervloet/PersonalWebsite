# Chapter 23: The Evidence a Release Owes

*This is the textbook chapter for the Testing and Delivery deep dive, a bonus that
slots in after Evals (5) and Production (8). The [README](README.md) is the lab
manual; this is the lecture.*

This text explains the engineering models behind the runnable lessons. Read a
chapter, predict the example, run it, then inspect the corresponding module and
tests. The code stays deliberately small so policy, observations, state, units,
and causal evidence remain visible.

## 1. A release is a claim supported by several kinds of evidence

An AI system has conventional software behavior and probabilistic product behavior.
One test family cannot cover both.

| Evidence | Primary question | Typical failure it catches |
| --- | --- | --- |
| Unit | Does one deterministic function obey its contract? | parsing, accounting, boundary, state-transition bug |
| Eval | Does the application meet a quality bar on representative tasks? | prompt, model, retrieval, or policy regression |
| SDK contract | Does an integration still speak the expected wire shape? | removed field, wrong type, incompatible request |
| Property or fuzz | Does an invariant survive generated inputs? | forgotten edge case, malformed Unicode, extreme size |
| Integration | Do real components compose in a representative environment? | configuration, serialization, permissions, network assumptions |
| Load | Does behavior hold at a target traffic shape? | saturation, latency tail, queue growth, rate limiting |
| Fault | Does recovery preserve correctness under partial failure? | duplicate side effect, retry storm, stale fallback |

The portfolio policy is an input owned by the release process. Observed tests do not
get to decide which categories count. This prevents a common vacuous gate:

1. collect whichever checks happened to run;
2. define the expected check names from that collection;
3. report that all expected checks are present.

That loop proves only that the input equals itself. In `portfolio.py`, required
kinds and observations enter separately. Missing, failed, and duplicate required
evidence have distinct reasons.

An eval is not a synonym for a unit test. A deterministic JSON parser should have
unit tests. An assistant's grounded answer quality needs an eval dataset and scorer.
An eval runner itself needs unit tests. A release usually needs both.

### Production extension

Assign each evidence class an owner, a freshness window, an authoritative workflow,
and a failure escalation path. Store policy in reviewed configuration rather than
constructing it from recent workflow results.

## 2. SDK contracts and fixture discipline

A fixture is a captured observation. A contract is a maintained requirement. They
change for different reasons and should live in different objects, preferably with
different owners.

A useful recorded fixture includes:

- a synthetic or redacted request;
- the response body and relevant headers;
- the contract name and version;
- the source SDK or server revision;
- a recording time;
- the redaction method;
- no credential, authorization header, or customer content.

A useful contract specifies:

- required and optional fields;
- JSON types and null behavior;
- whether request and response objects permit unknown fields;
- enumerated values whose expansion is or is not forward compatible;
- error shapes and streaming event order;
- version-negotiation behavior.

The course accepts unknown response fields but rejects unknown request fields. That
asymmetry is deliberate. A tolerant reader can survive a server adding metadata,
while a strict writer catches accidental unsupported request parameters. A different
API may choose differently, but it must state the choice.

Recorded fixtures age. Keep the previous fixture to test backward compatibility,
record a new fixture for the new version, and compare both against an independently
reviewed contract. Never overwrite the only historical evidence without review.

### What this implementation omits

`contracts.py` implements five JSON type categories and object fields. It does not
implement JSON Schema composition, numeric formats, streaming protocols, HTTP
headers, or semantic value constraints. Use a schema validator or generated client
contract suite for those, but preserve the same independence rule.

## 3. Property testing and fuzzing

Example-based tests choose both the input and expected output. Property tests choose
an invariant, then let a generator explore inputs. Fuzzing often emphasizes crashes,
memory safety, parsers, or coverage; property testing emphasizes semantic invariants.
The techniques overlap.

A complete property run records:

- generator and its domain;
- independent invariant;
- random seed or replay token;
- number of cases;
- first failure;
- minimized failure;
- whether minimization completed.

The integer shrinker has three important traces:

1. No failure: run all requested cases and return no counterexample.
2. Partial failure: if `17` violates `x < 10`, examine values from zero toward
   `17`; `10` is the smallest nonnegative failure.
3. Already minimal: if zero violates `x != 0`, zero remains the witness.

The teaching shrinker enumerates up to `abs(value)` candidates, so its worst-case
work is O(abs(value)). `max_candidates` bounds that work. When the bound stops the
search, `shrink_complete` is false. Reporting an unproven minimal value as minimal
would be another self-certifying claim.

Good AI-system properties include:

- a tokenizer or cost estimate never returns a negative count;
- serialization then parsing preserves a tool-call object;
- changing request IDs does not change semantic model input;
- tenant filtering never introduces documents from another tenant;
- a bounded context assembler never exceeds its token budget;
- retrying with one idempotency key creates at most one durable effect.

### Production extension

Use a mature engine for rich data generation, shrinking, example databases, and
stateful rules. Keep failing seeds in CI and convert important failures into named
regression cases. Bound input size and test time so a generator cannot become a
denial of service against the build.

## 4. Deterministic mocks, stubs, and fakes

Terminology varies, but three roles are useful:

- A stub returns controlled data.
- A mock verifies an interaction expectation.
- A fake implements simplified behavior and state.

The course double is a fake with a scripted stub layer. Its inputs configure
behavior: prompt responses, one-shot errors, fallback, and retained-history size.
The product test separately asserts required behavior. Passing the expected answer
into a helper and then asserting the helper returned its own input is not a test.

Determinism often requires controlling more than model output:

- monotonic and wall clocks;
- random seeds;
- generated IDs;
- retry and jitter schedules;
- external service responses;
- filesystem ordering;
- locale and timezone;
- concurrency scheduling when possible.

Interface drift is another risk. A permissive fake may accept arguments the real SDK
rejects. Python's `unittest.mock` `spec`, `spec_set`, and autospeccing can constrain a
double to a real interface. Contract fixtures then cover the serialized wire shape.

The fake retains at most `max_history` calls. Its total call count continues growing
as an integer, but memory use for history is bounded. Reset clears observed history
and the count; consumed scripted faults remain consumed. Replaying them would make
reset mean two unrelated things.

## 5. Load evidence and dimensional analysis

A request event records `started_s`, `finished_s`, and success. These are elapsed
seconds from one monotonic clock. Derived quantities are:

```text
span_s = max(finished_s) - min(started_s)
throughput_rps = number_of_requests / span_s
latency_ms = (finished_s - started_s) * 1000
error_rate = failed_requests / number_of_requests
```

`span_s` is a duration. It is not the absolute final timestamp. Shifting every
timestamp by a constant must not change any derived duration or rate. The test suite
checks that metamorphic relationship with `assertAlmostEqual`, and the example prints
the observed drift, because the relation is invariance rather than bit equality. The
shift perturbs the low-order bits of a float, so a metamorphic assertion over floats
has to state its tolerance. Claiming exact equality while the printed values differ
would be the same self-certifying move this course rejects everywhere else. Counting
ratios such as the error rate are exact and can be compared with `==`.

Nearest-rank percentile selection is:

```text
rank = ceil(percentile * n)       # one-based
value = sorted_values[rank - 1]  # zero-based language index
```

For values `0..19`, `n=20`, p95 has rank 19 and selects value 18. Rank and value are
not interchangeable. The implementation rejects an empty sample rather than
inventing zero latency.

Throughput and latency depend on workload shape: request sizes, input/output tokens,
cache hit rate, concurrency, arrival pattern, warm-up, and test duration. Report
those alongside results. A single average hides tail behavior.

### Production extension

Use a load generator that models open-loop arrivals when that matches production,
avoids coordinated omission, separates client and server latency, and exports raw
events. Monitor queue depth, timeouts, rate limits, GPU or CPU saturation, and token
throughput. Run long enough to expose memory leaks and thermal or cache effects.

## 6. Fault injection, retries, and idempotency

Failures occur at different points:

```text
before commit: no durable effect, caller sees failure
after commit: durable effect exists, caller sees failure
after response: durable effect exists, caller sees success
```

The middle case is the hard one. A retry can duplicate a charge, email, job, or tool
action. An idempotency key lets the server return the first receipt instead of
performing the effect again.

The retry trace includes attempts, planned delay in milliseconds, eventual result,
and the observed side-effect count. A success response alone is insufficient.

A lost response is not a one-time event. The reply carrying the deduplicated
receipt can be lost on exactly the same path as the original, so the course writer
applies an after-commit fault on the deduplicated branch too. The resulting shape is
the point of the chapter: with idempotency the effect count stays flat no matter how
many replies are lost, and without it the count rises once per retry.

The course writer retains a bounded least-recently-used set of keys. This avoids
unbounded memory, but eviction is a correctness boundary: a retry after eviction can
create a new effect. Production storage therefore needs a documented retention time
longer than client retries, queued redelivery, and incident replay windows. It also
needs atomic storage of the key and result.

Retry policy needs:

- retryable versus permanent error classification;
- maximum attempts or elapsed deadline;
- exponential backoff and jitter;
- per-attempt timeout;
- total request deadline;
- idempotency for side effects;
- retry budgets to stop incident amplification.

## 7. Compatibility is a tuple, not a model name

The deployable candidate includes at least:

```text
source revision
prompt version and required features
model identifier, features, and context window
index revision, schema, and embedding dimensions
SDK contract version
dependency lock digest
```

Testing prompt v7 on model A and deploying it on model B is a different candidate.
Testing against a 1,536-dimensional index and deploying an older 3,072-dimensional
index is not a weights-only difference; the application can fail before generation.

Context requirements use tokens consistently:

```text
required_context_tokens = maximum_input_tokens + context_headroom_tokens
```

Equality passes. One token below fails. Headroom covers generated output and runtime
additions such as tool schemas; the teaching policy uses one fixed number, while a
production policy may split those budgets explicitly.

Compatibility matrices should be generated from approved requirements, not from the
cross-product of artifacts found in storage. Artifact discovery cannot define which
combinations the team supports.

## 8. Dependency locking and reproducibility

`pyproject.toml` declares project metadata and acceptable dependency constraints.
`pylock.toml` records a reproducible installation result. In the current PyPA
specification:

- `lock-version = "1.0"` and `created-by` are required;
- `environments` can declare compatible marker domains;
- each package name is normalized;
- wheels, source distributions, and archives carry hashes;
- VCS sources record the exact commit ID;
- multiple entries for one package are legal when markers or source data narrow the
  environment to one entry.

The course has no runtime dependencies, so its root lock has an empty package array.
That is still useful evidence: it fixes the lock format, Python requirement, and
supported environment rather than leaving dependency state implicit.

The teaching audit compares marker strings exactly. It does not solve them. It also
does not verify downloaded bytes against a hash because the offline course downloads
nothing. A production installer must resolve the correct entry for its environment,
obtain the recorded artifact, verify size and digest, and refuse unrecorded inputs.

Locks do not eliminate supply-chain risk. They make the selected inputs reviewable
and repeatable. A locked vulnerable version remains vulnerable until updated.

## 9. CI as executable compatibility evidence

A CI matrix should derive from support policy. If metadata promises Python 3.11+, at
least the minimum and a current supported runtime should execute the real offline
path. OS-specific code, binary dependencies, or shell behavior may justify more
cells.

The matrix decision distinguishes:

- missing required cell;
- failed required cell;
- duplicate ambiguous observations;
- extra experimental cells, which do not affect the required promise.

The repository workflow uses a nonempty discovery assertion. `unittest` can exit
successfully with zero discovered tests, so merely executing the command is not
enough. It also compiles hidden Python paths, runs every numbered example, executes
the capstone twice, and compares the output bytes.

CI should separate fast required checks from optional live-provider tests. Offline
fixtures catch stable contract drift without secrets or network. A smaller scheduled
live contract job can detect provider changes, record a reviewed new fixture, and
never redefine the contract automatically.

### Production extension

Add platform cells required by customers, dependency resolution from the lock,
static type checks, lint, package build and install tests, container scanning,
integration environments, artifact signing, and deployment environment approvals.
Pin third-party actions to reviewed immutable revisions when threat policy requires
it.

## 10. Security gates and their limits

Security scanning is a portfolio too:

- dependency review compares changed dependencies with advisories and license rules;
- static analysis searches source and data flow patterns;
- secret scanning searches committed and generated content;
- artifact scanning inspects built containers or packages;
- SBOM generation records included components;
- provenance links the artifact to a build and inputs.

The policy supplies required scanners, the blocking severity, blocked licenses, and
source revision. A finding supplies identifier, category, severity, package, and
license. It does not supply `expected_block=True`.

Unknown severity fails closed in the teaching gate. Duplicate required scanner
reports are ambiguous, and a report for a different source revision cannot release
the candidate. Findings from extra scanners are still evaluated; optional evidence
must not become a way to hide a known critical issue.

No scanner proves absence of vulnerabilities. Rules have blind spots, advisory feeds
lag disclosure, generated artifacts can differ from source, and runtime configuration
changes exposure. Phrase the evidence narrowly: named scanners completed on a named
revision and found no policy-blocking result at that time.

## 11. Staged rollout and rollback

Build-time evidence cannot predict every production interaction. Staged rollout
limits exposure while collecting runtime evidence.

### Shadow

Copy representative traffic to the candidate, discard its response, and block
external side effects. Compare quality, errors, latency, cost, and downstream calls.
Shadow traffic may still create privacy and capacity risk, so sampling and redaction
policies apply.

### Canary

Route a small real slice to the candidate. Choose allocation and duration before
looking at results. Segment by tenant, geography, request class, and model path so an
aggregate does not hide a harmed cohort.

### Decision ordering

The course orders reasons as error, latency, quality, then shadow side effects. If a
safety metric fails, rollback wins over low volume. If metrics pass but request count
is below the minimum, hold. At each metric boundary, equality passes.

The trace deliberately includes 500 requests between zero and the 1,000-request
requirement. That proves the hold result is not an artifact of comparing only empty
and full samples.

A rollback path must be verified before release. Verification includes artifact
availability, configuration compatibility, data migration direction, cache behavior,
traffic switching, and operator permissions. Some schema or external side effects
cannot be rolled back; design forward fixes and feature disablement for those.

## 12. Evidence lineage, freshness, and provenance

Evidence is reusable only when it remains bound to the release subject. The course
subject includes source revision, prompt/model/index/SDK artifacts, and lock digest.
Canonical JSON then produces a SHA-256 subject digest.

Each record includes:

```text
kind
subject_digest
source_revision
produced_at_s
passed
payload_digest
```

The payload digest is computed from the actual reported decision. Capstone tests
recompute all twelve digests, preventing a headline result from being disconnected
from its source measurement.

Freshness uses seconds:

```text
age_s = now_s - produced_at_s
```

An age just inside or exactly at `max_age_s` passes. One second outside fails. A
negative age means evidence claims to come from the future and fails. Time should be
supplied by a trusted build environment in production.

Hashes detect content changes but do not establish who created the evidence. SLSA
provenance adds a defined subject, build definition, run details, and authenticated
builder identity. Signing and verification policy turn that statement into stronger
supply-chain evidence.

## 13. Reading the capstone as a causal pipeline

`default_scenario()` loads candidate artifacts and raw observations. Fixed module
policies remain outside it. `_run_decisions()` computes twelve real decisions.
`run_release()` then:

1. derives one candidate subject;
2. creates a portfolio result from every actual decision;
3. hashes each actual decision payload into an evidence record;
4. evaluates coverage, pass status, subject, source, and age;
5. emits a deterministic bundle.

The rollout path is derived. The canary decision receives `shadow.next_stage`; it is
not handed a hard-coded canary stage. The final release flag consumes both the
portfolio and evidence decision.

Adversarial tests perturb one real cause at a time. Removing a CI cell, changing an
index schema, deleting a fixture field, duplicating a side effect, injecting an
advisory, or regressing canary telemetry changes the reported decision and final
release flag. A benign candidate takes the same path and passes.

That is the standard to carry into a production delivery system: independently
defined requirements, actual observations, traceable derived values, explicit units
and state bounds, adversarial perturbations, and a tested recovery path.
