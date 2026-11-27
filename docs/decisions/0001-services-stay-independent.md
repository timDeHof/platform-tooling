# 0001. Services stay independent and call a pinned shared workflow

- **Status:** Accepted on 2026-11-26 by the tooling maintainer
- **Date:** 2026-11-26
- **Decider:** the tooling maintainer
- **Related:** [build log](../BUILD_LOG.md) decisions Q2, Q19, and Q25

## Context

Each JS/TS service currently carries its own CI workflow that installs
dependencies, type-checks, tests, lints, and builds. The services are mostly
pnpm and TypeScript, and many are turbo workspaces. They do not agree on tool
versions. Declared pnpm versions range from 9.0.0 to 10.34.7, and most
workflows hard-code Node 22 (build log F2). Some services deploy from CI and
some do not.

The goal is one versioned definition of CI, security checks, and a final
aggregate gate that services can adopt and upgrade, without taking ownership of
the services themselves.

## Decision

Each service keeps its own repository, package manager, application scripts,
deployment workflows, and credentials.

The tooling repository publishes reusable workflows, triggered by
`workflow_call`, directly under `.github/workflows/`. A service adopts them
with a thin caller workflow that pins a tooling release by full commit SHA.

The shared workflows run named scripts that the service defines in its own
`package.json`, following the service contract planned for Chapter 01. They
do not run framework-specific commands themselves.

In the initial scope, the tooling never deploys or publishes anything for a
service.

## Alternatives considered

1. **Move the services into one monorepo.** Rejected. Sharing CI this way
   would mean migrating every service's history, deployment settings, and
   credentials into one repository. The plan's section 1 rules this out for
   the pilot.
2. **Copy a template CI file into each service.** Rejected. Copies drift apart,
   and there is no single version to upgrade or roll back. This is the current
   state.
3. **Shared composite actions as the main interface.** Rejected as the main
   interface. A composite action runs as steps inside the caller's job, so it
   cannot define separate jobs, job timeouts, job-level permissions, or an
   aggregate gate across jobs. Composite actions may still serve as pinned
   helpers later (plan Chapter 02).
4. **Shared configuration packages, such as lint or TypeScript presets,
   published to a registry.** Deferred, not rejected. These solve a different
   problem and need registry publishing, which is optional Chapter 06 work.

## Consequences

Benefits:

- A service upgrades or rolls back its CI by changing one pinned reference.
- Deployments stay owned by the service, so a tooling change cannot deploy
  anything.
- Each service keeps its own package manager and scripts. The tooling adapts
  to a service, and a service does not have to adapt to the tooling.

Costs and constraints:

- A service must expose the scripts the contract requires. A service that
  lacks them needs its own pull request first.
- Calling from the same repository does not prove that sharing works across
  repositories. Each change needs a test from a separate caller (plan
  Chapter 02).
- The tooling repository is public (build log Q1), so workflow code is
  readable by anyone. It must hold no secrets and no private configuration.
- A reusable workflow cannot obtain more permissions than its caller grants
  (plan reference 3). Each caller must grant the permissions it needs
  explicitly.
- Inside a reusable workflow, `actions/checkout` checks out the caller's
  repository. A relative action path therefore points into the service, not
  the tooling repository (plan reference 4).
- Services can fall behind on old pins. Chapter 07 covers upgrades.

## Validation criteria

This decision holds if both of the following are true:

1. The pilot service, a private pnpm and turbo workspace service, replaces its
   duplicated CI with a thin pinned caller. Its deployment workflows stay
   unchanged, and its required gate blocks a deliberately failing change
   (plan Chapter 05).
2. A second service can adopt the same workflow through inputs alone, with no
   copy of the workflow.

## Revisit when

- Two or more services need the same non-trivial step that cannot be written
  as a script in the service contract.
- Services start sharing deployment targets or coordinated releases. That
  would favour a monorepo.
- A GitHub limit on reusable workflows, such as nesting depth or permission
  handling, blocks the design.
- The pilot fails the validation criteria above.
