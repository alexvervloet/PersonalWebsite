# Exercises

For each lesson, write your prediction before running the example. Then make the
smallest change requested, rerun the relevant test, and explain the observed
decision in terms of policy, stimuli, evidence, units, or state.

## 1. Test portfolios

Run:

```bash
python examples/01_test_portfolio.py
```

Before running, predict the exact missing-evidence reason. Then:

1. Add a green `load` observation without adding it to `required_kinds`. Explain why
   it is extra evidence rather than a release requirement.
2. Add `load` to the policy but remove its observation. Confirm the decision changes.
3. Supply two unit results, one passing and one failing. Explain why choosing either
   one silently would hide flakiness.
4. Name one failure that an eval catches but a unit test usually does not, and one in
   the opposite direction.

## 2. Recorded SDK contracts

Run:

```bash
python examples/02_contract_fixtures.py
```

Predict whether the extra `expected_id_type` field repairs the missing `id`. Then:

1. Put a synthetic `Bearer ` value three levels deep in the fixture and locate the
   path in the violation.
2. Set `allow_unknown_response_fields=False` and observe the forward-compatibility
   tradeoff.
3. Add an optional field to the independent contract, then omit it from the fixture.
4. Design a fixture-refresh review that cannot automatically approve the shape it
   just recorded.

## 3. Property testing

Run:

```bash
python examples/03_property_testing.py
```

Predict the minimal counterexample for the broken lower clamp. Then:

1. Repair `buggy_clamp` and confirm all generated cases pass.
2. Change the invariant so zero itself fails. Trace the already-minimal path.
3. Use a very large failing value and a tiny shrink budget. Confirm the report does
   not claim complete shrinking.
4. Write one property for tenant filtering or context-window packing. State which
   inputs are generated and which requirement stays independent.

## 4. Deterministic doubles

Run:

```bash
python examples/04_deterministic_doubles.py
```

Predict which configured fake fails the fixed product requirement. Then:

1. Add a one-shot error and prove the following call uses reusable behavior.
2. Make five calls with `max_history=2`; compare retained history with total count.
3. Write the circular anti-pattern `expected = fake.generate(input)` and explain why
   `fake.generate(input) == expected` proves nothing useful.
4. Identify a real SDK interface that should use autospeccing in addition to a wire
   fixture.

## 5. Load tests and units

Run:

```bash
python examples/05_load_testing.py
```

Predict whether shifting timestamps by 3,600 seconds changes throughput. Then:

1. Hand-calculate span, throughput, p95 milliseconds, and error ratio.
2. Add exactly enough latency to meet the maximum and confirm equality passes. Add
   one more millisecond and confirm it fails.
3. Replace `span_s` with the absolute maximum finish timestamp temporarily. Show why
   the time-origin metamorphic test catches the mistake.
4. List workload dimensions the synthetic test does not model.

## 6. Faults and idempotency

Run:

```bash
python examples/06_fault_testing.py
```

Predict the side-effect count for each writer. Then:

1. Move the fault before commit and compare both writers.
2. Exhaust all four attempts and verify the delay schedule is 25, 50, then 100 ms.
3. Raise `lost_responses` above the attempt budget. Explain why the idempotent
   writer now fails without ever committing a second effect.
4. Set `max_keys=2`, write keys A, B, C, then retry A. Explain the fourth effect.
5. Choose an idempotency retention duration for a queued job system and justify it
   from actual retry and redelivery horizons.

## 7. Artifact compatibility

Run:

```bash
python examples/07_compatibility.py
```

Predict the index-schema violation. Then:

1. Set model context to exactly prompt input plus headroom, then one token below.
2. Remove the `json` model feature and inspect the independent feature requirement.
3. Try `allowed_models={"model-*"}` and then `{"*"}`. Explain the deliberate wildcard
   semantics.
4. Add an embedding-model revision to both candidate and policy. Write a test where
   dimensions match but the semantic embedding revision does not.

## 8. Dependency locking

Run:

```bash
python examples/08_dependency_locking.py
```

Predict the unhashed artifact violation. Then:

1. Add a SHA-256 fixture value and confirm the teaching audit passes.
2. Add a VCS source with `requested-revision="main"` and a full immutable
   `commit-id`. Explain which value an installer must use.
3. Add two legal marker variants for the same normalized name, then add an exact
   duplicate entry.
4. Explain what the audit cannot prove without downloading bytes and evaluating
   marker expressions.

## 9. CI matrix coverage

Run:

```bash
python examples/09_ci_matrix.py
```

Predict why one green current-runtime job is insufficient. Then:

1. Fail only the Python 3.11 cell and inspect the run-specific reason.
2. Add an optional failing macOS live-provider cell. Explain why it does not alter
   this policy, then decide whether your production policy should require it.
3. Duplicate a required cell with one green and one red observation. Explain why
   the teaching gate refuses to cherry-pick.
4. Find the declared Python minimum in `pyproject.toml` and the matching real workflow
   cell in `.github/workflows/ci.yml`.

## 10. Security scanning

Run:

```bash
python examples/10_security_scanning.py
```

Predict whether a completed scan with a high finding passes. Then:

1. Upgrade `unsafe-parser` beyond the synthetic affected set and rerun the join.
2. Lower the finding to medium without changing policy, then lower the policy bar.
   Identify which is observation and which is requirement.
3. Add a low-severity finding with a blocked license and confirm license policy acts
   independently from severity.
4. Write the narrow claim a clean result supports without saying the application is
   vulnerability-free.

## 11. Staged rollouts

Run:

```bash
python examples/11_staged_rollout.py
```

Predict the decisions at 500 and 1,000 requests. Then:

1. Put every metric exactly on its boundary and confirm promotion.
2. Use ten requests with a severe quality regression. Confirm safety rollback wins
   over the insufficient-volume hold.
3. Mark rollback unverified and observe the blocked state.
4. Add one external side effect in shadow and compare the same observation at canary.
   Explain the deliberate stage asymmetry.

## 12. Evidence lineage and freshness

Run:

```bash
python examples/12_release_evidence.py
```

Predict why prompt v6 unit evidence cannot release prompt v7. Then:

1. Test ages 3,599, 3,600, and 3,601 seconds against a 3,600-second maximum.
2. Put the production time one second in the future and inspect the reason.
3. Reverse record input order and verify deterministic bundle order.
4. Change one decision payload field without updating its record. Recompute its
   digest and explain why a signed production verifier should reject the mismatch.

## 13. Capstone challenge

Run:

```bash
python hands_on/release_candidate.py
python -m unittest tests.test_capstone -v
```

Before reading the tests, predict the full rollout path and evidence count. Then:

1. Trace the load summary from request events through its decision payload, payload
   digest, evidence record, portfolio, and final release flag.
2. Remove the minimum-runtime CI observation. Confirm the current-runtime job stays
   green while the release fails.
3. Change only the index schema. Confirm every evidence record remains bound to the
   newly derived candidate subject while compatibility fails.
4. Change the writer to non-idempotent. Confirm eventual retry success is reported
   but the real side-effect requirement fails.
5. Set canary observations between the passing and failing examples. Find a value
   that holds, one that promotes, and one that rolls back without relying on a tie.
6. Make all decisions pass but age all records beyond policy. Explain why build-time
   success and releasable current evidence are separate claims.
7. Add an `artifact_signature` field and a verifier interface. Keep the course
   offline by using a deterministic teaching signer, and state why it is not a
   production trust root.

## Senior review checklist

Review a real AI delivery pipeline and answer with file paths or workflow links:

- Where are release requirements declared independently from results?
- Which quality claims are evals, and which deterministic code paths have unit tests?
- Which external SDK boundaries have schema contracts and sanitized fixtures?
- Which seeds or replay tokens reproduce generated failures?
- What mutable fake or idempotency state is retained, expired, and bounded?
- Which load metrics name their units and percentile definition?
- Which fault test observes side effects rather than only response status?
- What exact prompt/model/index/SDK/dependency tuple was tested?
- Does CI execute the minimum declared runtime and every supported platform path?
- Which scanners are required, and what narrow claim does a clean result support?
- What production evidence promotes a canary, and what independently tested path
  reverses it?
- Can every release headline be traced to a source observation and subject digest?
