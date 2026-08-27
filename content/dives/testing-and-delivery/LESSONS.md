# Lessons learned

## Preserve patch text literally in orchestration scripts

- **Expected:** a single orchestration call would apply and commit four independent
  Python files in sequence.
- **Actual:** Python docstrings containing Markdown backticks terminated the
  JavaScript template literal that held each patch, so evaluation failed before
  any file was created.
- **Next time:** send patches containing arbitrary prose directly to `apply_patch`,
  or escape template delimiters before embedding them in an orchestration script.
  Confirm repository status after any orchestration failure before retrying.

## Do not assume the local interpreter alias

- **Expected:** the sibling repositories' documented `python` command would run
  the first local test checkpoint.
- **Actual:** this shell exposes `python3` but no `python` alias, so the verification
  command failed before test discovery.
- **Next time:** use `python3` before the course virtual environment exists, then
  use `.venv/bin/python` after setup. Keep learner-facing commands as `python`
  because activating the documented virtual environment provides that alias.

## Assert that test discovery is nonempty from the first checkpoint

- **Expected:** `python3 -m unittest discover -v` would recurse into the newly
  created test directory.
- **Actual:** discovery reported zero tests because `tests/` was not importable;
  a zero-test command still exited successfully.
- **Next time:** create `tests/__init__.py` before the first test file and always
  wrap discovery with an explicit `countTestCases() > 0` assertion in CI.

## Translate one-based percentile ranks before indexing

- **Expected:** nearest-rank p95 over values 0 through 19 would select 19.
- **Actual:** `ceil(0.95 * 20)` is one-based rank 19, which is zero-based index 18;
  the implementation was correct and the hand-written test expectation was not.
- **Next time:** write out `n`, the one-based rank, the zero-based index, and the
  selected value when reviewing percentile examples. Include non-one-origin data
  so rank and value cannot be conflated.

## Check standards before turning a simplification into a rejection

- **Expected:** duplicate normalized package names in `pylock.toml` would always
  be ambiguous and should fail the teaching audit.
- **Actual:** the PyPA specification permits multiple entries for one package
  when their markers or sources narrow to one installable entry.
- **Next time:** distinguish a format's legal representational variants from
  exact duplicate records. State what the teaching implementation does not
  resolve, but do not reject valid standard behavior merely to simplify it.

## Print the tolerance when a metamorphic check runs on floats

- **Expected:** shifting every load-test timestamp by one hour would leave the
  duration-derived measurements identical, so the example could label the shifted
  summary "same measurements".
- **Actual:** adding 3,600 to each timestamp perturbs the low-order bits. The
  printed values differ at the thirteenth digit, so the lesson asserted an equality
  the reader could see was false. The test was already honest, using
  `assertAlmostEqual`; only the learner-facing surface overstated the result.
- **Next time:** when a metamorphic relation runs on floats, print the observed
  drift and the tolerance it is compared against. Reserve `==` for exact quantities
  such as ratios of counts, and say which of the two a given field is.

## Apply a scripted fault on every branch that consumes it

- **Expected:** a fault table indexed by call number would exercise the writer's
  after-commit failure on every attempt it was scripted for.
- **Actual:** the idempotent deduplication path returned the cached receipt before
  reaching the after-commit check. It still advanced the call index, so scripting
  two lost responses in a row silently discarded the second one and the retry
  reported success. No test caught it because every test scripted a single fault.
- **Next time:** if a stimulus table advances on every call, apply it on every
  branch that call can take, or make the unreachable branches reject the stimulus
  loudly. Test each fault at length two, not only length one; the second occurrence
  is what exposes a branch that consumes without acting.

## Mutation probes find documented behavior that no test pins

- **Expected:** a suite with a test file per module and adversarial capstone
  scenarios would already cover the behavior the textbook describes.
- **Actual:** seeding fifteen deliberate defects showed thirteen caught and two
  survivors. Both survivors were behaviors the textbook states outright: unknown
  scanner severities failing closed, and side effects being counted per invocation
  rather than per writer. Both were implemented correctly and simply never asserted.
- **Next time:** treat a sentence in the textbook as a test obligation. Before
  declaring a lesson finished, mutate the branch that sentence describes and confirm
  something red appears.
