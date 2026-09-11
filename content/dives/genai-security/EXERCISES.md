# GenAI Security Exercises

These exercises turn each lesson from a demonstration into an engineering decision.
Work in order. Start by writing the invariant and a failing test; only then change the
control. Keep every exercise offline and deterministic so a release can depend on it.

## 1. Add a trust boundary to the threat model

Model a support assistant that retrieves customer documents and can open tickets.
Add the ticket system as an asset, the tool call as a boundary-crossing flow, and at
least one excessive-agency risk.

Acceptance criteria:

- A risk can't reference an asset that has no accountable owner.
- The initial model reports both an uncontrolled flow and an open risk.
- Adding a named authorization control and mitigation removes those findings without
  lowering the risk's impact score.

Stretch: add a residual-risk field instead of treating mitigation as elimination.

## 2. Prove a secret never enters observability

Add a restricted OAuth refresh token to lesson 2. Confirm it's absent from context,
model output, exception text, and serialized decisions.

Acceptance criteria:

- Tests search all four surfaces for the exact token and fail if any copy appears.
- Diagnostics retain the field name, reason, and keyed fingerprint.
- Fingerprinting the same token under a different pepper produces a different
  reference, and an unkeyed digest is rejected outright.
- An authorized purpose still can't override the classification ceiling.

Stretch: define separate context policies for an interactive model and a tightly
controlled batch job.

## 3. Detect a mixed-release supply chain

Extend the manifest to include a tokenizer, retrieval corpus snapshot, and policy file.
Construct a deployment containing one artifact from the previous release.

Acceptance criteria:

- Every artifact uses an immutable version and approved source.
- Verification names the exact mismatched artifact.
- Updating a digest without a valid approval signature doesn't pass.

Design question: where would the signing identity and transparency log live in your
real build pipeline? The lesson HMAC is deliberately not an acceptable answer.

## 4. Add a poisoning detector without hiding evidence

Introduce a policy that limits exact and near-duplicate records. Keep quarantined
records and findings available for investigation rather than deleting them.

Acceptance criteria:

- A clean, diverse corpus passes.
- A concentrated duplicate campaign fails with stable record IDs.
- Reordering input records doesn't change the set of accepted IDs or findings.
- Detector failure quarantines the batch; it never silently admits everything.

Stretch: distinguish a rejected source record from a release-blocking corpus-level
finding.

## 5. Add a new output sink

Add a `create_ticket` action with `title`, `body`, and `priority`. Don't share raw model
JSON with the ticket API.

Acceptance criteria:

- Exact fields and enum values are enforced; unknown fields fail.
- Length, control-character, and normalization rules are explicit.
- HTML output is encoded, while API values remain data rather than syntax.
- Malformed JSON, valid-but-disallowed JSON, and downstream exceptions have separate
  tests and diagnostics.

## 6. Design an approval replay attack

Try to reuse an approval for a different tenant, subject, tool, object, or idempotency
key. Strengthen the approval object if your new object identifier isn't currently
bound.

Then do the harder half: take an approval that legitimately succeeded and submit the
identical call again. Binding can't help you here, because nothing about the second
call is different.

Acceptance criteria:

- Only the exact approved operation passes.
- A repeated write has one externally observable effect.
- The model can't place identity, roles, approval, or tenant into effective arguments.
- Authorization policy failure denies the call and records why.
- The same approval presented twice is refused the second time, and the reason
  distinguishes a spent challenge from a mis-aimed one.
- A challenge computed from the operation's visible fields is refused. Explain which
  inputs the model can see, and why that makes any derived value worthless.
- A challenge expires, and the expiry is enforced against an injected clock rather than
  a sleep.

Stretch: state which of these a caller-chosen idempotency key can provide on its own,
and which it can't. Then decide where the challenge should be spent: at the
authorization decision, or after the effect succeeds. Both lose something.

Then the read that none of the above refuses. Give the support principal a tool that
answers questions about a person, point it at somebody who isn't the subject of the
case, and confirm that the tenant matches, the role matches, the arguments are well
formed, and no approval is owed because it's a read. Add the scope and watch it fail.

Acceptance criteria:

- A subject-keyed tool refuses a record outside the request's scope, and the reason
  names the scope rather than the role.
- The refusal returns no arguments. Rewriting the request to the scoped subject would
  return data the caller asked for and leave nothing to show an attempt happened.
- A tool addressed by an identifier your system minted is unaffected. Explain why
  scoping it too would break reading an invoice from the ticket about it.
- A subject-keyed tool called with no scope at all is refused rather than defaulting to
  the unscoped behaviour.

Stretch: name the three questions a tool call has to answer about identity, and say
which of them a role answers. Then find a read in your own system that answers the third
one from an argument.

## 7. Break a retrieval cache safely

Create two users in one tenant with different groups, and two tenants with identical
queries. Attempt to reuse cached results across each boundary.

Acceptance criteria:

- Cache keys differ by tenant, effective principals, query, and corpus version.
- Authorization happens before scoring and before cache insertion.
- A source whose approval is revoked disappears even if it's semantically closest.
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
- Documentation doesn't call the Python policy function a sandbox.

## 10. Share one budget across an agent tree

Simulate two branches that both try to reserve the last remaining tool call and output
tokens.

Acceptance criteria:

- At most one branch receives the reservation.
- Failed reservations mutate no counters.
- Replaying one reservation ID charges once.
- Wall-time exhaustion stops work even when monetary budget remains.
- A limit of NaN or infinity is refused at construction. Check why: every guard in the
  budget is an ordered comparison, and every ordered comparison against NaN is false, so
  a NaN limit passes validation and then bounds nothing.

Stretch: make reservation thread-safe, then prove it under controlled concurrency.

## 10A. Bound what the agent gives away

Every limit in lesson 10 counts something you pay for. Add a tool that hands something
out, so a refund, a credit, a discount, a plan upgrade, and give it a ceiling.

Acceptance criteria:

- A single payment above the per-request ceiling is refused before anything moves.
- Several payments that each fit the per-request ceiling are refused once they exceed
  the account's window, and the two refusals are distinguishable in the log.
- A refused payment leaves both totals unchanged.
- A retried payment is counted once, so a retry neither pays twice nor consumes ceiling
  the account was entitled to.
- The ceiling holds when a human has already approved the payment.

Stretch: list every resource your agent can move, and mark each one with who owns it.
The ones you own almost certainly have limits already. Say what the others have instead,
and whether a person reads it.

## 11. Make a regression fail the release

Copy the capstone probe suite and intentionally weaken one control. Add one benign case
that resembles the attack so a block-all patch isn't accepted.

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

- The incident can't skip lifecycle states.
- Evidence metadata contains a digest and size, not raw customer data.
- Tampering with an earlier audit event invalidates the chain.
- Deleting the final events doesn't, until the head hash is anchored outside
  the log and checked against it.
- Recovery is impossible while the security release gate fails.
- The postmortem names an owner and a systemic change, not "be more careful."

## 13. Forge the prompt's own grammar

Write a passage that, concatenated verbatim, would give the model a section heading, a
citation key, an evidence marker, and a closing fence tag the application never wrote.
Run it through `assemble_context` and inspect both the prompt and the findings.

Acceptance criteria:

- No key the retriever didn't issue survives in bracket form.
- The fence's open and close tags each appear exactly once.
- Every forged element is still readable in the prompt, defused rather than deleted.
- A findings record names the passage and its citation, so the corpus can be audited.
- A clean passage produces no findings and is passed through byte for byte.
- A passage that politely *asks* for an invented policy produces no findings at all.
  Explain why that's the correct outcome and which lesson answers it instead.

Stretch: a model honours a close tag that is merely close enough. List five spellings of
your fence tag that a reader would accept, and confirm the escape catches all five. Then
argue why the nonce, not the escape, is the part doing the real work.

## 14. Leak a subject across one authorized conversation

Open a conversation for one operator, record turns about two different subjects, then
compose an answer about the second. Every access-control check must pass throughout:
the operator owns the handle and was entitled to every turn in it.

Acceptance criteria:

- A colleague in the same tenant can't resume the handle, and neither can the same
  subject name in a different tenant.
- A refused resume and a nonexistent handle return the same wording. Say what an
  attacker learns if they differ.
- Handles are unguessable and expire against an injected clock.
- Composing for one subject withholds the other's turns, and the withheld turns are
  returned rather than silently dropped. Explain which incident each half answers.
- A turn reading "what about the September obligation?" is attributed correctly.
  Explain why no amount of reading the text achieves that.

Stretch: name the point at which this stops being an access-control problem. Then
decide what should happen when an operator legitimately needs both subjects at once,
and what the answer must say about it.

## Capstone extension

Add one system-specific risk that is absent from every top-ten list. Wire it through:

1. the threat model and owner;
2. an enforceable control;
3. success, denial, exception, and replay tests;
4. a benign-utility probe and an adversarial probe;
5. the release evidence; and
6. the incident runbook.

If you can't connect all six, you've found a security claim the system can't yet
prove.
