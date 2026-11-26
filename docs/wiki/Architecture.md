# Architecture

**Status:** draft. This page describes the planned design. The only things
that exist today are documentation pages. Every workflow, script, and fixture
named below is planned.

## Goal

The goal is shared CI for independent JS/TS services: a versioned reusable
Node CI workflow, security checks, and an aggregate gate that one real service
uses first. The reasons services stay independent are recorded in
[ADR 0001](../decisions/0001-services-stay-independent.md), which is
Accepted.

## Components

| Component | Location | Purpose | Status |
| --- | --- | --- | --- |
| Self-validation | `.github/workflows/validate-tooling.yml` | Checks this repository's docs, workflow syntax, and fixtures on every pull request | Planned, [Chapter 00](Build-00-Foundation.md) |
| Fixtures and tests | `fixtures/`, `tests/` | Known-bad inputs that each check must reject | Planned, Chapters 00 and 01 |
| Service contract validator | `scripts/validate-contract.mjs` | Checks that a service declares the scripts, lockfile, and runtime the workflows need | Planned, Chapter 01 |
| Reusable Node CI | `.github/workflows/node-ci.yml` | Installs, then runs the service's own scripts with read-only permissions | Planned, Chapter 02 |
| Aggregate gate | To be decided in Chapter 03 | One check that fails on any failure, cancellation, missing result, or unexplained skip | Planned, Chapter 03 |
| Security checks | `.github/workflows/security.yml` | Source scanning, dependency audit, secret scanning, and action pinning policy | Planned, Chapter 04 |
| Documentation | `docs/` | Build chapters, decisions, evidence, and the build log | Draft |

## How a service uses the tooling

A service adds one thin caller workflow that pins a tooling release by full
commit SHA. The service keeps its own `package.json` scripts, lockfile,
deployment workflows, and credentials.

**Illustrative configuration.** The interface is not defined until Chapter 02,
and `<full-sha>` stands for a real commit SHA.

```yaml
jobs:
  ci:
    uses: timDeHof/platform-tooling/.github/workflows/node-ci.yml@<full-sha> # vX.Y.Z
    permissions:
      contents: read
```

## Ownership

| Concern | Tooling repository | Service repository |
| --- | --- | --- |
| CI job structure, timeouts, permissions | Owns | Pins a version |
| Install, type-check, test, lint, and build commands | Runs the named scripts | Defines them in `package.json` |
| Package manager and lockfile | Supports the declared manager | Chooses and commits them |
| Deployment and publishing | Not involved in the initial scope | Owns |
| Credentials | Holds none | Owns, and passes only named secrets |
| Required-check settings | Documents them | Configures them |

## Trust boundaries

These rules apply to every planned workflow.

- Application jobs run with `contents: read` and check out without persisted
  credentials.
- No application job receives publishing credentials, write-scoped tokens, or
  OIDC tokens.
- Callers pass named secrets only when a job needs them, and never use
  `secrets: inherit` by default.
- No workflow runs pull request code in a privileged `pull_request_target`
  context.
- A reusable workflow cannot raise the permissions its caller grants, so each
  caller grants permissions explicitly (plan reference 3).
- Inside a reusable workflow, `actions/checkout` fetches the caller's
  repository. A helper from this repository must be pinned explicitly, never
  taken from a floating `main` (plan reference 4).

## The pilot service

The first consumer is a private pnpm and turbo workspace service on Node 22.
It has one CI workflow and does not deploy from CI (build log Q2). These docs
do not name it (build log Q25). It changes nothing until Chapter 05.

## Open design questions

- Where the aggregate gate lives, in each caller or inside a wrapping reusable
  workflow (Chapter 03).
- How the contract describes a workspace root that runs turbo across packages
  (Chapter 01).
- Whether the pnpm version comes from the service's `packageManager` field or
  from a workflow input (Chapter 01).
- What scanning is available for private consumers (Chapter 04).

## Related pages

- [Roadmap](Roadmap.md)
- [Build 00: Foundation](Build-00-Foundation.md)
- [Build log](../BUILD_LOG.md)
