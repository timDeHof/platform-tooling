# Roadmap

**Status:** draft. Chapters are ordered by dependency. They have no dates,
because the plan assigns no estimates until the work has been sized.

## Chapters

| Chapter | Outcome | Depends on | Status |
| --- | --- | --- | --- |
| 00 Foundation | This repository validates its own docs and workflows, and fixtures prove each check fails on bad input | Nothing | Draft, see [Build 00](Build-00-Foundation.md) |
| 01 Service contract | A contract validator, plus pnpm and JavaScript fixtures that pass and fail as expected | 00 | Planned |
| 02 Reusable Node CI | `node-ci.yml` runs correctly when called from a separate repository | 01 | Planned |
| 03 Aggregate gate | One required check that fails on any failure, cancellation, missing result, or unexplained skip | 02 | Planned |
| 04 Security | `security.yml` runs and reports into the gate | 03 | Planned |
| 05 Pilot service | The pilot service runs on a pinned caller, and its owner accepts the change | 00 to 04 | Planned |
| 06 Publishing | One publishing path, only if a real need exists | 05 | Out of scope for the initial release |
| 07 Upgrades and recovery | A consumer upgrades to a new tooling release and rolls back, and drift checks catch stale docs | 05 | Planned |

The pilot service is a private pnpm and turbo workspace service (build log
Q2). These docs do not name it (build log Q25).

## Initial release

The initial release is complete when Chapters 00 to 05 and Chapter 07 meet
their completion criteria and the pilot's owner accepts the pilot. Publishing
is not part of it.

## Pull request sequence

Each chapter arrives in its own reviewed pull request:

1. Chapter 00, with the README, this roadmap, the architecture page, ADR 0001,
   the pull request template, and the validation scripts.
2. The contract and fixtures.
3. Reusable Node CI.
4. The aggregate gate.
5. Security checks.
6. The pilot service change, opened in the pilot's own repository.
7. Upgrades and recovery.

Publishing, if it is ever chosen, gets its own pull request and review.

## Not planned

These are excluded from the initial release (plan section 1):

- A service monorepo.
- Shared configuration packages.
- A secrets manager integration.
- A wiki or site publisher.
- npm package or container image publishing.
- Dependabot or other recurring automation before Chapter 07.

## Next action

Run the Chapter 00 positive proof from a fresh clone, then merge pull
request #1. [ADR 0001](../decisions/0001-services-stay-independent.md) is
Accepted.
