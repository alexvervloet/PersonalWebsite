# GenAI Security Exercises

These exercises turn each lesson from a demonstration into an engineering decision.
Work in order. Start by writing the invariant and a failing test; only then change the
control. Keep every exercise offline and deterministic so a release can depend on it.

## 1. Add a trust boundary to the threat model

Model a support assistant that retrieves customer documents and can open tickets.
Add the ticket system as an asset, the tool call as a boundary-crossing flow, and at
least one excessive-agency risk.

Acceptance criteria:

- A risk cannot reference an asset that has no accountable owner.
- The initial model reports both an uncontrolled flow and an open risk.
- Adding a named authorization control and mitigation removes those findings without
  lowering the risk's impact score.

Stretch: add a residual-risk field instead of treating mitigation as elimination.

## 2. Prove a secret never enters observability

Add a restricted OAuth refresh token to lesson 2. Confirm it is absent from context,
model output, exception text, and serialized decisions.

Acceptance criteria:

- Tests search all four surfaces for the exact token and fail if any copy appears.
- Diagnostics retain the field name, reason, and keyed fingerprint.
- Fingerprinting the same token under a different pepper produces a different
  reference, and an unkeyed digest is rejected outright.
- An authorized purpose still cannot override the classification ceiling.

Stretch: define separate context policies for an interactive model and a tightly
controlled batch job.

## 3. Detect a mixed-release supply chain

Extend the manifest to include a tokenizer, retrieval corpus snapshot, and policy file.
Construct a deployment containing one artifact from the previous release.

Acceptance criteria:

- Every artifact uses an immutable version and approved source.
- Verification names the exact mismatched artifact.
- Updating a digest without a valid approval signature does not pass.

Design question: where would the signing identity and transparency log live in your
real build pipeline? The lesson HMAC is deliberately not an acceptable answer.

## 4. Add a poisoning detector without hiding evidence

Introduce a policy that limits exact and near-duplicate records. Keep quarantined
records and findings available for investigation rather than deleting them.

Acceptance criteria:

- A clean, diverse corpus passes.
- A concentrated duplicate campaign fails with stable record IDs.
- Reordering input records does not change the set of accepted IDs or findings.
- Detector failure quarantines the batch; it never silently admits everything.

Stretch: distinguish a rejected source record from a release-blocking corpus-level
finding.

## 5. Add a new output sink

Add a `create_ticket` action with `title`, `body`, and `priority`. Do not share raw model
JSON with the ticket API.

Acceptance criteria:

- Exact fields and enum values are enforced; unknown fields fail.
- Length, control-character, and normalization rules are explicit.
- HTML output is encoded, while API values remain data rather than syntax.
- Malformed JSON, valid-but-disallowed JSON, and downstream exceptions have separate
  tests and diagnostics.

## 6. Design an approval replay attack

Try to reuse an approval for a different tenant, subject, tool, object, or idempotency
key. Strengthen the approval object if your new object identifier is not currently
bound.

Acceptance criteria:

- Only the exact approved operation passes.
- A repeated write has one externally observable effect.
- The model cannot place identity, roles, approval, or tenant into effective arguments.
- Authorization policy failure denies the call and records why.

## 7. Break a retrieval cache safely

Create two users in one tenant with different groups, and two tenants with identical
queries. Attempt to reuse cached results across each boundary.

Acceptance criteria:

- Cache keys differ by tenant, effective principals, query, and corpus version.
- Authorization happens before scoring and before cache insertion.
- A source whose approval is revoked disappears even if it is semantically closest.
- An empty ACL denies at ingestion rather than becoming public.

Stretch: pin a claim to the retrieved source, then show how a corpus update invalidates
its evidence chain.

## 8. Test redirect and DNS rebinding defenses

Build a fake resolver and redirect sequence covering public IPv4, IPv6 loopback,
private space, link-local metadata, malformed addresses, and resolver failure.

Acceptance criteria:

- Scheme, hostname, port, userinfo, DNS result, and every redirect are checked.
- An allowlisted name resolving to any non-global address is denied.
- Resolver failure denies with useful diagnostics.
- The exercise opens no real socket.

Production question: how will the HTTP client connect to the exact address that policy
checked without silently resolving the hostname again?

## 9. Write a runner contract and its escape tests

Add a request for a generated analysis program. Define mounts, environment, identity,
network, and resource limits, then enumerate what only the runtime can enforce.

Acceptance criteria:

- Writable paths are confined to a fresh scratch root, including symlink resolution.
- A mount with an approved source is still denied when its destination overlays a
  system path inside the guest.
- Root, unexpected environment variables, extra programs, and network are denied.
- Tests never execute generated code on the host.
- Documentation does not call the Python policy function a sandbox.

## 10. Share one budget across an agent tree

Simulate two branches that both try to reserve the last remaining tool call and output
tokens.

Acceptance criteria:

- At most one branch receives the reservation.
- Failed reservations mutate no counters.
- Replaying one reservation ID charges once.
- Wall-time exhaustion stops work even when monetary budget remains.

Stretch: make reservation thread-safe, then prove it under controlled concurrency.

## 11. Make a regression fail the release

Copy the capstone probe suite and intentionally weaken one control. Add one benign case
that resembles the attack so a block-all patch is not accepted.

Acceptance criteria:

- The naive system fails and the original hardened system passes.
- The weakened system fails with the affected category in its evidence.
- A harness exception is a gate failure, not a skipped or passing probe.
- Missing required-category coverage fails even when every executed probe passes.

## 12. Run a tabletop incident

Assume the cross-tenant vector probe fired in production. Identify the exposed asset,
preserve minimal evidence, contain the index, identify root cause, add the regression,
recover through a passing gate, and assign postmortem actions.

Acceptance criteria:

- The incident cannot skip lifecycle states.
- Evidence metadata contains a digest and size, not raw customer data.
- Tampering with an earlier audit event invalidates the chain.
- Deleting the final events does not, until the head hash is anchored outside
  the log and checked against it.
- Recovery is impossible while the security release gate fails.
- The postmortem names an owner and a systemic change, not "be more careful."

## Capstone extension

Add one system-specific risk that is absent from every top-ten list. Wire it through:

1. the threat model and owner;
2. an enforceable control;
3. success, denial, exception, and replay tests;
4. a benign-utility probe and an adversarial probe;
5. the release evidence; and
6. the incident runbook.

If you cannot connect all six, you have found a security claim the system cannot yet
prove.
