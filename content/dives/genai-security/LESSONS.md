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
