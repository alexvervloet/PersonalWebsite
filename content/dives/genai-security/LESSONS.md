# Lessons learned

## Direct example execution assumes the editable install

- **Expected:** Running `python3 examples/01_threat_model.py` from the repository
  root would import the local `genai_security` package during development.
- **Actual:** Python placed `examples/`, not the repository root, first on the import
  path and raised `ModuleNotFoundError` before the documented editable install.
- **Next time:** Create and install the course environment before exercising direct
  script paths. For pre-install development checks, set `PYTHONPATH=.` explicitly;
  keep CI responsible for proving the documented installed workflow.

## Public publication needs destination-specific approval

- **Expected:** The request to move to the next P1 repository, together with the
  global instruction to push green chunks, would authorize creating its public GitHub
  repository after verification.
- **Actual:** Publication was correctly held because exporting a new local payload to
  an exact public destination requires explicit confirmation of that repository and
  visibility.
- **Next time:** Resolve the repository name and public/private visibility explicitly
  before the publication step. Scan the tracked payload for credential patterns before
  requesting that confirmation.

## A gate cannot grade a suite it derives its requirements from

- **Expected:** The capstone's release gate required coverage of every risk category,
  so deleting a probe would fail the release. The unit tests proved the gate rejects a
  missing category, and CI was green.
- **Actual:** The capstone built the required set from the probe list itself, so the
  requirement disappeared along with any probe removed. Dropping the entire poisoning
  category still reported `release ready: True`. The mechanism worked; only the wiring
  was circular, and nothing in the suite could see it.
- **Next time:** Write the requirement as a constant, separately from the evidence
  offered against it, and test the gate by removing a probe rather than by adding one.
  Any check whose expectation is computed from its input is measuring nothing.

## An outcome is not evidence of which control produced it

- **Expected:** A probe named for cloud-metadata SSRF, passing against the hardened
  system, showed that the resolved-address policy blocked the request.
- **Actual:** The probe used an `http://` URL, so it was rejected by the scheme
  allowlist several checks earlier. The resolver was never called and the address
  policy never ran. Deleting that policy entirely would not have failed the suite.
  The report recorded `expected=block actual=block`, which cannot show this.
- **Next time:** Have the system under test return the deciding control alongside the
  outcome, persist it in the evidence, and assert on it. A probe that passes for the
  wrong reason is worse than a missing one, because it reads as coverage.

## Fingerprints in audit logs have to be keyed

- **Expected:** Logging a truncated SHA-256 instead of a sensitive value made the
  record non-reversible, as the chapter claimed.
- **Actual:** The fields this control protects are mostly low-entropy: email
  addresses, customer identifiers, order numbers. Anyone holding the log can hash
  candidates and match them, so the digest recovers the value it replaced.
- **Next time:** Use an HMAC with a pepper stored outside the log. Reserve the phrase
  "non-reversible" for constructions that are, and say what the cost is: rotating the
  pepper invalidates every existing fingerprint.

## A grammar detector that knows one dialect reports the corpus clean

- **Expected:** `_CITATION` in `context.py` would match citation keys, and the shape
  `system:kind/identifier` was what "citation key" meant.
- **Actual:** the pattern required a path segment, so `[doc:policy/7]` matched and
  `[ticket:9812]` did not. A test using both spellings failed on the second. Had the
  fixture used only the first, the pattern would have shipped defusing one dialect and
  silently passing the other, while `assemble_context` reported no findings and the
  corpus looked clean.
- **Next time:** a detector for "text shaped like our grammar" is only as good as the
  range of shapes in its fixtures, and its failure mode is silence rather than an error.
  Write the fixtures from at least two real citation schemes before writing the pattern,
  and treat "no findings" as a claim requiring a positive control rather than as good
  news.

## A control that switches itself off instead of failing

- **Expected:** `RequestBudget` validated its limits, since it checks `< 0` and `<= 0`
  before accepting them.
- **Actual:** every guard in the class is an ordered comparison and every ordered
  comparison against NaN is false, so a NaN limit passed validation and then lost every
  comparison that would have rejected a charge. The budget accepted work forever and
  reported success at each step. The denial-of-wallet module had a denial-of-wallet hole.
- **Next time:** check finiteness before magnitude, and when auditing a guard ask what
  the comparison returns for the degenerate value rather than only for the large one. The
  dangerous failure here was not an exception, it was a control that reported normal
  operation while enforcing nothing.

## "Cannot be replayed" was true and answered a different question

- **Expected:** the approval control was finished. Its docstring said an approval
  "cannot be replayed against a different tenant, tool, or object", an exercise was
  called "Design an approval replay attack", and a test asserted the binding held.
- **Actual:** all of that was accurate and none of it covered replay at the same
  target. Fifty authorizations from one approval returned True. The docstring
  sentence is carefully worded and every word is correct, which is why the clause it
  does not contain went unnoticed. `RequestBudget` in this same repository burns a
  reservation id exactly once and `incidents.py` dedups replayed operations, so the
  weakest version of the idea was the one guarding irreversible effects.
- **Next time:** read a prepositional phrase in a security claim as the boundary of
  the claim, not as detail. "Cannot be replayed *against a different X*" is about
  aiming, not freshness. When one module implements an idea more strongly than
  another in the same codebase, treat it as a finding rather than a style difference.

## An idempotency key looks like a nonce and is not one

- **Expected:** requiring an idempotency key on writes was replay protection, and a
  challenge would be a small addition to something already most of the way there.
- **Actual:** they are unrelated controls sharing a shape. An idempotency key makes a
  duplicate submission converge on one effect, a correctness property that a
  predictable value serves perfectly well. A nonce makes a duplicate be refused, a
  security property that a predictable value destroys. The broker accepted any
  non-empty string and the model chose it.
- **Next time:** when two controls share a vocabulary, tabulate them with a column for
  who issues the value and a column for whether it may be predictable. Written as
  prose they kept reading as one paragraph; written as a table the difference was
  immediate, and the table went into the chapter for the same reason.
