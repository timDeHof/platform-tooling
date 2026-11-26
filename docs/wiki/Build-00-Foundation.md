# Build 00: Foundation and independent validation

## Purpose and scope

This chapter creates the platform-tooling repository and gives it its own
validation, separate from the reusable workflows it will later publish. At the
end, a clean clone can install the development tools and run one command that
checks the documentation, the workflow files, and the fixtures that prove those
checks fail when they should. The same command runs on every pull request.

This chapter creates or changes the following:

- The GitHub repository `timDeHof/platform-tooling`, public.
- `LICENSE`, `README.md`, `.nvmrc`, `.gitignore`, `package.json`,
  `package-lock.json`, `.markdownlint-cli2.jsonc`, `.remarkrc.json`.
- `.github/workflows/validate-tooling.yml` and
  `.github/pull_request_template.md`.
- `docs/wiki/Architecture.md`, `docs/wiki/Roadmap.md`, and this chapter.
- `docs/decisions/0001-services-stay-independent.md`.
- `docs/evidence/` with this chapter's evidence records.
- `fixtures/docs/broken-link.md`, `fixtures/workflows/malformed.yml`, and the
  tests under `tests/`.
- Secret scanning and push protection on the repository.

This chapter does not include the following:

- Any reusable workflow for services. That is Chapter 02.
- The service contract or pnpm fixtures. That is Chapter 01.
- Branch protection. That waits until `validate-tooling` has reported on a real
  pull request (see the Chapter 03 rule in the plan).
- Any change to the pilot service, the first consumer. It is a private pnpm
  and turbo workspace service, and this chapter does not name it (build log
  Q2, Q25).
- Dependabot, registry credentials, publishing, or a wiki publisher.

The highest verification tier this chapter can reach is **GitHub Actions
verified**. It has no consumer, so consumer verification does not apply.

## Status and tested environment

**Status:** draft. Steps 1 to 13 ran on 2026-11-26, and their "Observed"
fields hold that output. Steps 6 to 11 ran before steps 1 to 5. The hosted
record `docs/evidence/00-actions.json` is GitHub Actions verified. The local
record stays `draft` until the fresh-clone positive proof runs. The evidence
records stay in `draft`, because the full positive proof has not run.

**Authored on:** macOS (Darwin 27.2.0) with nvm 0.40.2, git 2.56.0, gh
2.102.0, and actionlint 1.7.12 installed.

**Tested environment for steps 6 to 10:** the same macOS machine with Node
v26.13.1, npm 11.20.0, and actionlint 1.7.12 from Homebrew. The directory was
not yet a Git repository.

**Captured output:** quoted command output shortens the home directory to `~`.
No other part of the output is edited (build log Q28).

## Dependencies and permissions

Decisions this chapter depends on are recorded in the
[build log](../BUILD_LOG.md) entry for 2026-11-26, codes Q1 to Q24.

You need the following before step 1:

| Prerequisite | Check | Expected |
| --- | --- | --- |
| git | `git --version` | Any recent version |
| GitHub CLI, signed in as the repository owner with `repo` scope | `gh auth status` | Logged in to github.com as `timDeHof` |
| nvm | `nvm --version` | A version that reads `.nvmrc` |
| Node 26 | `nvm install 26` | `node --version` prints `v26.x.y` |
| actionlint | `brew install actionlint`, then `actionlint -version` | A version string |

Permissions:

- Steps 1 to 3 and 5 to 11 change only local files.
- Step 4 creates a public GitHub repository and pushes to it.
- Step 12 changes repository security settings.
- Step 13 opens a pull request.

Steps 4, 12, and 13 are privileged procedures. Run them only after the
repository owner approves the exact command.

## Decision rationale

**Why the tooling repository validates itself.** A broken documentation link
or a malformed workflow in this repository must fail here, before any service
depends on it. `validate-tooling.yml` uses only pinned public actions and local
scripts, so it does not rely on the reusable workflows it will later test.

**Why services stay independent.** Each service keeps its repository,
application scripts, deployment settings, and credentials, and calls a pinned
shared workflow. ADR 0001 records the alternatives, such as a service
monorepo, and the conditions for revisiting this. The maintainer accepted it
on 2026-11-26.

**Why negative proofs are fixtures.** The plan first described a disposable
broken edit that is made and then reverted. A committed fixture that the test
suite must reject proves the same thing on every run, and a reviewer can rerun
it (build log Q7).

**Why npm and `.nvmrc`.** The tooling repository's own scripts use npm with a
committed lockfile. This does not constrain consumers. `.nvmrc` is the file
that nvm reads, and `actions/setup-node` can read it as well (build log Q22).

**Why the first commit skips review.** A pull request needs a base branch, and
an empty repository has none. The bootstrap commit holds only `LICENSE` and a
README stub, so the unreviewed change contains no code (build log Q23).

## Implementation steps

Every step lists its working directory, the exact action, why it is needed, the
expected result, and an observed result to fill in when it runs. The repository
root is `~/Dev/platform-tooling`, written below as the root.

Code blocks carry one of these labels: **Executable check**, **Illustrative
configuration**, **Expected output**, **Intentional failure**, or
**Privileged procedure**. Only executable checks are safe to run without
review.

### Step 1. Initialise the local repository

- **Directory:** the root.
- **Action:** `git init -b main`.
- **Why:** gives the bootstrap commit a `main` branch before any GitHub
  resource exists (build log Q4).
- **Expected:** `git status` reports `On branch main` with no commits yet.
- **Observed:** 2026-11-26. `git init -b main` printed
  `Initialized empty Git repository in ~/Dev/platform-tooling/.git/`.
  `git status` printed `On branch main` and `No commits yet`.

### Step 2. Write the bootstrap files

- **Directory:** the root.
- **Action:** create `LICENSE` with the unmodified Apache-2.0 text. Create
  `README.md` with the project name, one sentence of purpose, and the status
  line "Planned. Nothing is implemented yet." Add no `NOTICE` file (build log
  Q21).
- **Why:** the license must exist before the repository is public, and the
  README explains what the repository is.
- **Expected:** `git status` lists exactly `LICENSE` and `README.md` as
  untracked.
- **Observed:** 2026-11-26. This differs from the expectation (build log F13).
  `LICENSE` is the apache.org original from
  `https://www.apache.org/licenses/LICENSE-2.0.txt`, copied byte for byte: 202
  lines, sha256
  `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`. GitHub's
  license API copy (`gh api licenses/apache-2.0`) differs from it only in
  whitespace (`diff -w -B` exit 0). No `NOTICE` file was added. `README.md` was
  the full step 11 README, not the stub described above, because steps 6 to 11
  had already run. For the same reason, many files were untracked.
  `git status --short LICENSE README.md` listed exactly `?? LICENSE` and
  `?? README.md`.

### Step 3. Make the bootstrap commit

- **Directory:** the root.
- **Action:** `git add LICENSE README.md && git commit -m "chore: bootstrap repository with license and readme"`.
- **Why:** gives the repository a base branch for pull request #1.
- **Expected:** `git log --oneline` shows one commit.
- **Observed:** 2026-11-26. `git diff --cached --name-only` listed only
  `LICENSE` and `README.md` before the commit. `git log --oneline` shows one
  commit, `855f8a1 chore: bootstrap repository with license and readme`, with
  full hash `855f8a1eb702bd01cfb9ecac4f2a36f3df4a9601`. It holds 2 files and
  247 insertions, with no co-author. The first version of this commit,
  `7cc2c32`, carried a personal email address from the global Git
  configuration. Before anything was pushed, the repository-local `user.email`
  was set to the GitHub noreply address and the commit was amended with
  `git commit --amend --reset-author --no-edit`. Its author and committer are
  now `2568193+timDeHof@users.noreply.github.com`, and
  `git diff 7cc2c32 HEAD` is empty (build log Q27). After the commit, `npm run validate`
  exited 0. actionlint now finds the project, and `npm test` passed 5 of 5.
  `git check-ignore -v node_modules/` printed `.gitignore:1:node_modules/`.
  Nothing is pushed, and no remote exists.

### Step 4. Create the GitHub repository

**Privileged procedure.** It creates a public repository and pushes `main`.

```sh
gh repo create timDeHof/platform-tooling --public --source=. --remote=origin --push
```

- **Directory:** the root.
- **Why:** the hosted check in step 13 needs a GitHub repository.
- **Expected:** the command prints the repository URL, and `git remote -v`
  shows `origin`.
- **Observed:** 2026-11-26, run after the maintainer approved the exact
  command. Before the push, `main` held only `855f8a1` with `LICENSE` and
  `README.md`, authored with the noreply address. The command exited 0 and
  printed:

  ```text
  https://github.com/timDeHof/platform-tooling
  To github.com:timDeHof/platform-tooling.git
   * [new branch]      HEAD -> main
  branch 'main' set up to track 'origin/main'.
  ```

  `git remote -v` shows `origin` as `git@github.com:timDeHof/platform-tooling.git`
  for fetch and push. `gh repo view` reports visibility `PUBLIC` and default
  branch `main`. The remote `main` is
  `855f8a1eb702bd01cfb9ecac4f2a36f3df4a9601`, with the noreply address as
  author and committer, and its tree holds only `LICENSE` and `README.md`.
  `gh repo view` first reported no license. A second query moments later
  reported `Apache-2.0` for path `LICENSE` from
  `gh api repos/timDeHof/platform-tooling/license`, so GitHub's license
  detection runs after the push.

### Step 5. Create the Chapter 00 branch

- **Directory:** the root.
- **Action:** `git switch -c chapter-00-foundation`.
- **Why:** everything after the bootstrap commit arrives through review
  (build log Q9, Q23).
- **Expected:** `git branch --show-current` prints `chapter-00-foundation`.
- **Observed:** 2026-11-26. `git switch -c chapter-00-foundation` printed
  `Switched to a new branch 'chapter-00-foundation'`, and
  `git branch --show-current` printed `chapter-00-foundation`. The branch
  started at `855f8a1`. Every other Chapter 00 file was untracked at that
  point, and all of them were committed on this branch.

### Step 6. Declare the runtime

- **Directory:** the root.
- **Action:** write `.nvmrc` containing `26`. Run `nvm use`.
- **Why:** a clean clone and CI must select the same Node major version.
- **Expected:** `nvm use` prints that it is now using node v26.x.y.
- **Observed:** 2026-11-26. Node 26 was not installed, so `nvm install 26`
  ran first and printed `Checksums matched!` and
  `Now using node v26.13.1 (npm v11.20.0)`. The output of `nvm use` itself
  was not captured. Afterwards, in the root, `node --version` printed
  `v26.13.1` and `npm --version` printed `11.20.0`.

### Step 7. Add the development tools

- **Directory:** the root.
- **Action:** create `.gitignore` containing `node_modules/`. Then create
  `package.json` with `"private": true` and `"type": "module"`, and run
  `npm install --save-dev markdownlint-cli2 remark-cli remark-validate-links`.
- **Why:** these are the documentation checkers chosen in build log Q15. The
  install writes `package-lock.json`, which makes later installs reproducible.
  `.gitignore` keeps the installed `node_modules/` out of every commit after
  the bootstrap (build log F11).
- **Expected:** `.gitignore` contains `node_modules/`, `package-lock.json`
  exists, and `npm ls --depth=0` lists the three packages.
- **Observed:** 2026-11-26. `package-lock.json` exists with
  `lockfileVersion` 3. `npm ls --depth=0` printed
  `markdownlint-cli2@0.24.2`, `remark-cli@12.0.1`, and
  `remark-validate-links@13.1.0`, and the lockfile pins the same versions. npm
  wrote them to `package.json` as caret ranges (`^0.24.2`, `^12.0.1`,
  `^13.1.0`). `npm audit` reported 13 vulnerabilities (4 low, 9 moderate),
  including the minimatch advisory GHSA-g3hv-75wg-m249. npm's only full fix
  downgrades remark-validate-links to 12.1.1, which it calls a breaking change.
  They are accepted and kept out of `validate` (build log Q26).
  `.gitignore` was written the same day, containing `node_modules/`. It was
  not checked with `git check-ignore`, because the directory is not yet a Git
  repository.

### Step 8. Add the validation scripts and checker configuration

- **Directory:** the root.
- **Action:** add the scripts and configuration below.
- **Why:** one command, `npm run validate`, must run every check locally and in
  CI.
- **Expected:** each script exists in `package.json`. Running them comes in
  step 11.
- **Observed:** 2026-11-26. `package.json` defines `test`, `validate`,
  `validate:docs`, and `validate:workflows`. An early run of
  `npm run validate` before steps 1, 2, and 11 exited 1, as those steps
  predict. markdownlint passed with `Summary: 0 issues in 0 files` across 5
  files. remark then stopped with `No such file or folder` for `README.md` and
  `.github`, because neither exists yet. Run on its own,
  `npm run validate:workflows` exited 3 with
  `no project was found in any parent directories`, because actionlint looks
  for `.github/workflows` inside a Git repository.

**Illustrative configuration.** The scripts in `package.json`:

```json
{
  "scripts": {
    "validate:docs": "markdownlint-cli2 \"**/*.md\" \"#node_modules\" \"#fixtures\" && remark --frail --quiet --no-stdout README.md docs .github",
    "validate:workflows": "actionlint",
    "test": "node --test",
    "validate": "npm run validate:docs && npm run validate:workflows && npm test"
  }
}
```

The fixtures are excluded on the command line, not through ignore files. When
a test later passes a fixture path to a checker directly, no ignore rule
applies to it.

**Illustrative configuration.** `.markdownlint-cli2.jsonc` turns off the
line-length rule, because prose lines are wrapped for review and not for a
hard limit. It also limits the duplicate-heading rule to sibling headings,
because each build log entry repeats headings such as "Not done".

```json
{ "config": { "MD013": false, "MD024": { "siblings_only": true } } }
```

**Illustrative configuration.** `.remarkrc.json` turns on link and anchor
checking.

```json
{ "plugins": [["remark-validate-links", { "repository": false }]] }
```

`repository: false` stops the plugin from reading the Git remote. Without it,
remark-validate-links fails with "Cannot find remote `origin` of local Git
repo" in any working tree that has no `origin` remote, and it cannot run at all
outside a Git repository. This was observed while drafting (see
Troubleshooting). Local file and anchor checks still run with the option set.

### Step 9. Add the negative fixtures and their tests

- **Directory:** the root.
- **Action:** create the two fixtures and one test file below.
- **Why:** each fixture is a permanent proof that a check fails on bad input
  and names the file (build log Q7).
- **Expected:** `npm test` passes, which means both checkers rejected their
  fixtures.
- **Observed:** 2026-11-26, in the root on Node v26.13.1. `npm test` passed 5
  of 5. Both fixture tests passed:
  `remark rejects a broken relative link and names the missing file` and
  `actionlint rejects a job with no runs-on and names the file`. The deliberate
  fixture repair in the negative proof section has not run.

**Intentional failure.** `fixtures/docs/broken-link.md` links to a file that
does not exist.

```markdown
# Broken link fixture

See [the missing page](./does-not-exist.md).
```

**Intentional failure.** `fixtures/workflows/malformed.yml` is a workflow with
a job that has no `runs-on` key.

```yaml
on: push
jobs:
  broken:
    steps:
      - run: echo "never runs"
```

`tests/fixtures.test.mjs` uses `node:test` and `node:child_process`. It runs
`node_modules/.bin/remark --frail --no-stdout fixtures/docs/broken-link.md` and
`actionlint fixtures/workflows/malformed.yml`. For each one it asserts two
things:

1. The exit code is not zero.
2. The output names the fixture file and the specific problem, meaning
   `does-not-exist.md` for the link and `runs-on` for the workflow.

The second assertion matters. A checker can also exit non-zero because it
could not find or read the file, which would make the test pass for the wrong
reason. While drafting, remark-validate-links did exactly that, exiting 1 with
a Git remote error before it checked any link.

**Expected output.** Seen while drafting, in a scratch copy outside this
repository, on 2026-11-26. This is not chapter evidence. remark-cli 12.0.1 with
remark-validate-links 13.1.0 and `repository: false` exited 1 and printed:

```text
fixtures/docs/broken-link.md
3:5-3:44 warning Cannot find file `does-not-exist.md` missing-file remark-validate-links:missing-file
```

actionlint 1.7.12 exited 1 and printed:

```text
fx/malformed.yml:3:3: "runs-on" section is missing in job "broken" [syntax-check]
```

### Step 10. Add the evidence convention

- **Directory:** the root.
- **Action:** create `docs/evidence/00-local.json` and
  `docs/evidence/00-actions.json` in the record shape below, with null fields.
  Add `tests/evidence.test.mjs`, which parses every JSON file in
  `docs/evidence/` and checks the following:
  - `schema_version` is `1`.
  - `status` is one of `planned`, `draft`, `locally verified`,
    `GitHub Actions verified`, or `consumer verified`.
  - A record whose status is past `draft` has non-null revisions, a
    `verified_at` value, and observed results.
- **Why:** evidence is checked by a machine, so a record cannot claim a tier it
  has no data for (build log Q12).
- **Expected:** `npm test` passes with both records in `draft`.
- **Observed:** 2026-11-26. Both records exist with status `draft` and null
  results. In the same `npm test` run, `00-actions.json is a valid evidence
  record`, `00-local.json is a valid evidence record`, and
  `evidence directory has at least one record` passed. In a scratch copy
  outside the repository, `00-local.json` was changed to `locally verified`
  with its results left null. The test then failed with
  `tooling_revision is required once status is "locally verified"`.

**Illustrative configuration.** The record shape, shown with its pending
values:

```json
{
  "schema_version": 1,
  "chapter": "00",
  "status": "draft",
  "tooling_revision": null,
  "consumer_revision": null,
  "documentation_revision": null,
  "verified_at": null,
  "environment": null,
  "positive_check": { "expected": "npm run validate exits 0", "observed": null },
  "negative_check": { "expected": "both fixtures rejected with file named", "observed": null },
  "run_url": null,
  "limitations": ["Implementation checks have not run"]
}
```

### Step 11. Add the documentation and the hosted check

- **Directory:** the root.
- **Action:** write the following:
  - `README.md` in full: purpose, status, supported consumers, and a link to
    this chapter.
  - [Architecture](Architecture.md), [Roadmap](Roadmap.md), and
    [ADR 0001](../decisions/0001-services-stay-independent.md) with status
    Proposed. All three were drafted on 2026-11-26. The maintainer accepted
    ADR 0001 the same day.
  - `.github/pull_request_template.md`, the definition-of-done checklist from
    the plan's section 8 (build log Q20).
  - `.github/workflows/validate-tooling.yml`, sketched below.
- **Why:** the documentation is reviewed in the same pull request as the checks
  that validate it.
- **Expected:** `npm run validate` exits 0 locally.
- **Observed:** 2026-11-26, Node v26.13.1, directory not yet a Git
  repository. The expectation is not met yet. `npm run validate` exited 3:

  ```text
  > validate:docs
  markdownlint-cli2 v0.24.2 (markdownlint v0.42.2)
  Finding: **/*.md !node_modules !fixtures
  Linting: 7 files
  Summary: 0 issues in 0 files

  > validate:workflows
  > actionlint
  no project was found in any parent directories of "~/dev/platform-tooling". check workflows directory is put correctly in your Git repository
  ```

  `validate:docs` passed, and remark checked `.github/pull_request_template.md`
  by name. `validate:workflows` needs step 1 (`git init`), as build log F10
  predicts. Run on their own, `actionlint -no-color
  .github/workflows/validate-tooling.yml` exited 0 with no findings, and
  `npm test` passed 5 of 5. The first run failed markdownlint MD041 on the pull
  request template, which starts at `##` because the pull request title is the
  top-level heading. A file-level `markdownlint-disable-file MD041` comment
  fixed it (build log F12).

  The decision tasks below were resolved with these pins:

  | Pin | Value | How it was resolved |
  | --- | --- | --- |
  | `actions/checkout` | `3d3c42e5aac5ba805825da76410c181273ba90b1`, v7.0.1 | Latest release tag, `git/ref/tags/v7.0.1` object type `commit`, confirmed with `gh api repos/actions/checkout/commits/<sha>` |
  | `actions/setup-node` | `949feb2413d6458794dcd2491c4babbbce0c15c1`, v7.1.0 | Latest release tag, `git/ref/tags/v7.1.0` object type `commit`, confirmed with `gh api repos/actions/setup-node/commits/<sha>` |
  | actionlint | 1.7.12, linux_amd64 sha256 `8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8` | From `actionlint_1.7.12_checksums.txt` in the v1.7.12 release. The archive was downloaded on macOS, `shasum -a 256 -c` printed `OK`, and it contains the `actionlint` binary. The same version is installed locally from Homebrew. |

  The workflow has not run on GitHub. Its curl, `sha256sum`, and
  `GITHUB_PATH` lines have not run on a Linux runner.

**Illustrative configuration.** The workflow skeleton. Replace each
`<sha-for-vX.Y.Z>` with the full commit SHA of the release you select, and
keep the version comment. Do not commit a placeholder.

```yaml
name: validate-tooling

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@<sha-for-vX.Y.Z> # vX.Y.Z
        with:
          persist-credentials: false
      - uses: actions/setup-node@<sha-for-vX.Y.Z> # vX.Y.Z
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - name: Install actionlint
        run: <download the pinned actionlint release tarball and its checksums file, verify with sha256sum -c, then put the binary on PATH>
      - run: npm run validate
```

The trigger has no path or branch filters on `pull_request`, so the check
always reports and can later be made required (build log Q18).

**Decision task.** Choose the actionlint version for CI and record it here and
in the evidence. At drafting time the latest release was v1.7.12, which
publishes `actionlint_1.7.12_linux_amd64.tar.gz` and
`actionlint_1.7.12_checksums.txt` (`gh release view --repo rhysd/actionlint`,
2026-11-26). Keep the local Homebrew version and the CI version the same, or
record the difference.

**Decision task.** Choose the `actions/checkout` and `actions/setup-node`
releases, then resolve each tag to its commit SHA. Use
`gh api repos/actions/checkout/git/ref/tags/<tag> --jq .object.sha`. If the
object type is `tag` rather than `commit`, dereference it once more.

### Step 12. Turn on secret scanning and push protection

**Privileged procedure.** It changes repository security settings.

Check the current state first. Public repositories may already have secret
scanning turned on.

```sh
gh api repos/timDeHof/platform-tooling --jq .security_and_analysis
```

If either feature is not `enabled`, run the following:

```sh
gh api -X PATCH repos/timDeHof/platform-tooling \
  -f 'security_and_analysis[secret_scanning][status]=enabled' \
  -f 'security_and_analysis[secret_scanning_push_protection][status]=enabled'
```

- **Directory:** any.
- **Why:** push protection blocks an accidental secret before it reaches the
  repository (build log Q17).
- **Expected:** the first command, run again, shows both features as
  `enabled`.
- **Observed:** 2026-11-26. The read printed:

  ```json
  {"dependabot_security_updates":{"status":"disabled"},"secret_scanning":{"status":"enabled"},"secret_scanning_non_provider_patterns":{"status":"disabled"},"secret_scanning_push_protection":{"status":"enabled"},"secret_scanning_validity_checks":{"status":"disabled"}}
  ```

  Secret scanning and push protection were already `enabled`, because GitHub
  turned them on when the public repository was created. The PATCH command was
  not run, so the before and after output are this one read. Dependabot
  security updates, non-provider patterns, and validity checks are `disabled`.
  They are outside build log Q17 and are left for Chapter 04.

### Step 13. Open pull request #1

**Privileged procedure.** It pushes a branch and opens a pull request.

```sh
git push -u origin chapter-00-foundation
gh pr create --base main --title "Chapter 00: foundation and independent validation"
```

- **Directory:** the root.
- **Why:** the hosted run on a real pull request is the positive proof for the
  GitHub Actions tier.
- **Expected:** the pull request shows a `validate-tooling` check that
  succeeds.
- **Observed:** 2026-11-26, run after the maintainer approved the push and the
  full pull request body. `git push -u origin chapter-00-foundation` created
  the remote branch at `fda04ab`, and `gh pr create` printed
  `https://github.com/timDeHof/platform-tooling/pull/1`. The `validate-tooling`
  workflow ran its `validate` job as
  [run 45905985053](https://github.com/timDeHof/platform-tooling/actions/runs/45905985053)
  on event `pull_request` at head
  `fda04ab8a199fe6925d2a9764553a040a8e4d488`. The job started at
  2026-11-26T22:37:36Z, completed at 2026-11-26T22:37:53Z, and concluded
  `success`. The runner image was `ubuntu-26.04` version `20261116.88.1`, and
  setup-node installed Node `v26.13.1` from `.nvmrc`. The log showed:

  ```text
  /home/runner/work/_temp/actionlint_1.7.12_linux_amd64.tar.gz: OK
  Summary: 0 issues in 0 files
  ℹ pass 5
  ℹ fail 0
  ```

  This was the first run of the workflow's curl, `sha256sum`, and
  `GITHUB_PATH` lines on Linux. Socket Security and GitGuardian checks from
  third-party apps on the account also passed. This repository does not
  configure them.

## Verification

### Positive proof

**Executable check.** This runs from a fresh clone in an empty directory.

```sh
git clone https://github.com/timDeHof/platform-tooling.git
cd platform-tooling
git switch chapter-00-foundation
nvm use
npm ci
npm run validate
```

- **Expected:** `npm run validate` exits 0.
- **Observed:** pending.

The hosted proof is the `validate-tooling` check on pull request #1 succeeding
at the pull request's head commit.

### Negative proof

The fixture tests from step 9 are the negative proof. They run inside
`npm test`, both locally and in CI. A passing `npm test` means both checkers
rejected their fixtures and named the problem.

To confirm the tests themselves can fail, temporarily fix the link in
`fixtures/docs/broken-link.md` so that it points at an existing file. Then
run `npm test`.

- **Expected:** the broken-link test fails. Restore the fixture, rerun
  `npm test`, and confirm it passes again.
- **Observed:** 2026-11-26, on `chapter-00-foundation` at `445202b`, Node
  v26.13.1. Line 3 of `fixtures/docs/broken-link.md` was changed to link to
  `../../README.md`, which exists. `npm test` exited 1 with 4 passed and 1
  failed:

  ```text
  ✖ remark rejects a broken relative link and names the missing file
    AssertionError [ERR_ASSERTION]: fixtures/docs/broken-link.md: no issues found
      actual: 0,
      expected: 0,
      operator: 'notStrictEqual',
  ```

  The exit-code assertion failed first, because remark exited 0 once the link
  resolved. The other 4 tests passed. `git checkout -- fixtures/docs/broken-link.md`
  restored the committed fixture, and `git diff` was then empty. The rerun of
  `npm test` exited 0 with 5 of 5 passing. The actionlint fixture was not
  repaired in this run.

## Evidence and limitations

Record results in `docs/evidence/00-local.json` and
`docs/evidence/00-actions.json`. Keep local and hosted results in separate
files. A local pass does not establish GitHub Actions verification.

For the local record, capture the commit, `node --version`, `npm --version`,
the actionlint version, the operating system, and the output of the positive
and negative checks. For the hosted record, capture the run URL, the event,
the head SHA, and the check name.

Known limitations:

- The bootstrap commit in step 3 was not reviewed. It contains only `LICENSE`
  and a README stub.
- The fixtures prove that each checker rejects one known failure. They do not
  prove that the checkers catch every failure.
- `main` has no branch protection after this chapter, so a red check does not
  yet block a merge.

## Troubleshooting

### Observed

Seen while drafting this chapter on 2026-11-26, before any step had run.

| Symptom | Cause | Diagnostic and fix |
| --- | --- | --- |
| remark prints `Command failed: git remote -v` or `Cannot find remote origin of local Git repo` and exits 1 | remark-validate-links reads the Git remote by default. It fails outside a Git repository or in one with no `origin` remote. | `git remote -v`. Set `repository: false` in `.remarkrc.json` (step 8). |
| remark echoes the Markdown file to the terminal when given one file | remark-cli writes processed output to stdout for a single input | Add `--no-stdout` |

### Hypothetical

These failure modes have not been seen. They are labelled hypothetical until
one is.

| Symptom (hypothetical) | Likely cause | Diagnostic |
| --- | --- | --- |
| `nvm use` prints `No .nvmrc file found` | The shell is not in the root, or `.nvmrc` is missing | `ls -a` in the root |
| `npm run validate:workflows` reports `actionlint: command not found` | actionlint is not installed | `command -v actionlint` |
| The fixture test passes locally and fails in CI | The CI actionlint version differs from the local one | Compare `actionlint -version` in both logs |
| `gh repo create` fails with a name conflict | The repository already exists | `gh repo view timDeHof/platform-tooling` |

## Recovery

Revert a faulty Chapter 00 change with a new reviewed pull request. Do not
bypass the check, and do not delete the working copy as a recovery strategy.
Revert a bootstrap mistake made before step 4 with a local amend, because
nothing has been published yet. After step 4, fix it through a pull request.
If step 12 has unwanted effects, run the same `gh api -X PATCH` command with
`disabled` and record the change in the build log.

## Completion

Chapter 00 is done when all of the following are true:

- [ ] Pull request #1 merged, with `validate-tooling` succeeding at its head
      commit.
- [ ] The positive proof passed from a fresh clone, and its record is in
      `docs/evidence/00-local.json`.
- [ ] The negative proof passed, including the deliberate fixture repair and
      restore.
- [ ] The hosted run is recorded in `docs/evidence/00-actions.json`.
- [ ] Secret scanning and push protection show as `enabled`, with before and
      after output recorded.
- [ ] Every "Observed" field in this chapter is filled in, and its status is
      updated from draft.
- [ ] Vault note 22.16 is marked superseded and points at this repository
      (build log Q8).
- [ ] The build log has an entry for the implementation work.

## Navigation

- **Previous:** none. This is the first chapter. `Start-Here.md` will precede
  it once written.
- **Next:** `Build-01-Service-Contract.md`, not yet written.
