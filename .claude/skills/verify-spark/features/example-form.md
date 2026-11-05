# Example form validation

The example page has a form with Title, Description and Email. It shows a message under each field that is not valid and accepts valid values. It does not save anything.

## Sub-features

- `form-empty` shows all three validation messages for an empty submit.
- `form-valid` removes the messages after valid values are submitted.

## How to get to it (user POV)

- Open the example page and use the form under `Create New` (`إنشاء جديد` in Arabic).

## Driving it with drive.mjs

Preconditions:

- Doctor prints `OK` for this run. Any mode works.

- **Empty submit.** Open `/en-sa/example` and select the button `Get Started`. The messages `Must be at least 3 characters`, `Must be at least 10 characters` and `Invalid email address` appear.
- **Valid submit.** Type `Verify title` in `Title`, `A description long enough` in `Description` and `agent@example.com` in `Email`, then select `Get Started`. All three messages disappear and the fields keep their values.
- **Proof.** Run `RUN=<id> bun .claude/skills/verify-spark/scripts/drive.mjs example-form`. It writes `1-empty-submit.*` and `2-valid-submit.*`.

## Gotchas

- The submit handler is empty by design. No item is added to the list and no request is sent. Do not report a created item.
- The submit button text is `Get Started` (`ابدأ الآن` in Arabic), not "Submit" or "Create".
- Validation runs on submit, not while typing.
