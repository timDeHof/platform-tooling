# Build log

Dated record of actual work on platform-tooling, including corrections and
approaches that were dropped. Consumer-facing release changes belong in
`CHANGELOG.md`. Current procedures belong in the build chapters.

## 2026-11-26 Chapter 00 design decisions

The maintainer and Claude reviewed the planning note
`22.16_platform-tooling-step-by-step-documentation-plan.md` (Revision 2) in a
question-and-answer session before any Chapter 00 file existed. No repository,
commit, workflow, or GitHub resource was created. Every decision below is a
design input for Chapter 00, not evidence that anything works.

This repository is public. Names, security settings, and organization details
of private repositories are kept in the maintainer's private planning note,
not here (Q25).

### Facts gathered

| Code | Fact | Source |
| --- | --- | --- |
| F1 | The personal GitHub account is `timDeHof`. No `platform-tooling` repository exists under it or under any organization it belongs to. | `gh auth status`, `gh repo view <owner>/platform-tooling` for each owner |
| F2 | Most active JS/TS repositories use pnpm and TypeScript, many as turbo workspaces. Declared pnpm versions range from 9.0.0 to 10.34.7. Only 2 repositories have a Node version file. Most workflows hard-code `node-version: 22`. | `package.json`, lockfiles, and `.github/workflows/*` in each repository under `~/Dev` |
| F3 | On the two private candidate consumers checked, the Actions policy allows all actions. Neither policy would block a call to a public reusable workflow. | `gh api repos/<owner>/<repo>/actions/permissions` |
| F4 | The newest Node LTS line is v26 (Lithium 26.13.1). The previous LTS line is v24 (Krypton 24.22.3). The local Node is 24.21.0 through nvm. | `https://nodejs.org/dist/index.json`, `node --version` |
| F5 | One existing private repository has a reusable workflow, called only from its own repository. It deploys, which the plan's section 1 rules out for the pilot, so it is not reused. | `rg -l workflow_call` over local repositories |

### Decisions

| Code | Decision | Basis |
| --- | --- | --- |
| Q1 | The tooling repository is `timDeHof/platform-tooling` and is public. | Any repository can call a reusable workflow from a public repository, and scanning is free on public repositories (GitHub documentation, recalled rather than fetched). Every candidate consumer is owned by the personal account (F1). |
| Q2 | The first consumer is a private pnpm and turbo workspace service, called the pilot service in these docs. | It best represents the existing repositories (F2): pnpm 9.0.0, a turbo workspace, Node 22, and one CI workflow with no deploys. A single-package candidate was rejected because a migration mistake there would touch a deploy. An npm candidate was rejected as an outlier. |
| Q3 | No Actions restriction blocks the pilot. Scanning availability for private consumers is assessed in Chapter 04. | Answered by F3. No decision was needed for Chapter 00. |
| Q4 | `git init` runs locally first. The GitHub repository is created only after the owner is settled. | Keeps local work separate from creating GitHub resources. See Q24. |
| Q5 | The target reader is a capable engineer who has never seen this setup. | Forces explicit prerequisites and exact commands without beginner-level detail. |
| Q6 | The tooling repository uses npm with `package-lock.json` and the current Node Active LTS (26, per F4). | The plan's section 1 proposal. Consumers keep their own package managers. The version file was revised by Q22. |
| Q7 | Negative proofs are committed fixtures that CI must reject on every run. | A fixture proves the check on every run, and a reviewer can rerun it. This replaces the plan's Chapter 00 wording about disposable edits (DRIFT). |
| Q8 | After Chapter 00 merges, `docs/wiki/` is the authoritative plan and vault note 22.16 is marked superseded. | The plan's section 3 forbids two independently edited copies. |
| Q9 | Claude writes changes on branches and opens PRs. The maintainer reviews and merges. Claude never merges. | One person holds the maintainer, service owner, and reviewer roles. |
| Q10 | Chapter 00 adds no branch protection. Protection is added after `validate-tooling` reports on a real PR. | The plan's Chapter 03 rule, applied to the tooling repository itself. |
| Q11 | Every action is pinned to a full commit SHA with a version comment. Dependabot waits for Chapter 07. | The plan requires immutable references and marks recurring automation optional. |
| Q12 | Evidence is one JSON file per chapter and verification tier in `docs/evidence/`, using `schema_version: 1` and checked by a small Node test. | Machine-checkable evidence without a JSON Schema dependency. |
| Q13 | This log starts with this entry. | The plan says the build log records real dated work, and these decisions are real dated work. |
| Q14 | The license is Apache-2.0. | Maintainer choice. |
| Q15 | `validate:docs` uses markdownlint-cli2 and remark-validate-links. `validate:workflows` uses actionlint at a pinned version, installed with Homebrew locally and downloaded with a checksum check in CI. | The established tool for each job. actionlint is the one prerequisite that npm does not install. |
| Q16 | Tests use the built-in `node:test` runner. | The tests are file-and-exit-code assertions that need no framework. |
| Q17 | GitHub secret scanning and push protection are turned on and recorded as a settings change. No local secret scanner is added. | Push protection blocks the push itself. gitleaks is reconsidered only if Chapter 04 finds a gap. |
| Q18 | `validate-tooling` runs on `pull_request` and on `push` to `main`, with no path or branch filters. | A filtered workflow can leave a required check pending (plan Chapter 03). |
| Q19 | The first ADR is `docs/decisions/0001-services-stay-independent.md`, with status Proposed. | The plan names this as Chapter 00's decision, and an unapproved choice is marked Proposed. |
| Q20 | `.github/pull_request_template.md` is a checklist built from the plan's section 8 definition of done. | Every PR has to answer the definition of done. |
| Q21 | The repository ships `LICENSE` with the unmodified Apache-2.0 text and no `NOTICE` file. | There are no attributions to preserve yet. |
| Q22 | The Node version file is `.nvmrc` containing `26`, not `.node-version`. | The installed nvm 0.40.2 reads only `.nvmrc` (`nvm_find_nvmrc`, `~/.nvm/nvm.sh:508-512`). With `.node-version`, `nvm use` would fail in a clean clone. |
| Q23 | The first commit goes straight to `main` with only `LICENSE` and a README stub. Everything else arrives through PR #1. | An empty repository has no base branch for a PR. The bypass is limited to one commit with no code. |
| Q24 | Claude runs `gh repo create` and the secret scanning change only after showing the exact command and receiving a yes for each one. | Both are outward-facing changes. |
| Q25 | Public documentation describes private repositories only in generic terms. Their names, security settings, and organization details stay in the maintainer's private planning note. | The plan's section 6 requires removing private configuration and identifying data before publication. |

Q22 to Q24 were accepted when the maintainer asked for Q1 to Q24 to be recorded
here.

### Corrections

Q6 first chose `.node-version`. A check of the installed nvm showed that it
reads only `.nvmrc`, so Q22 replaced the file name. The Node version in Q6 is
unchanged.

The first draft of this entry and of Chapter 00 named private repositories and
described their security settings. Those details were removed before anything
was pushed (Q25).

### Not done

No files exist yet beyond this log and the Chapter 00 draft. No commands have
run against a platform-tooling repository. Chapter 01 fixture design for pnpm
was left for a later session.

## 2026-11-26 Chapter 00 documentation drafts

Claude drafted the first documentation pages. The maintainer has not reviewed
them yet. Nothing is committed, because the directory is not yet a Git
repository.

### Files drafted

- [Build 00: Foundation](wiki/Build-00-Foundation.md), with status draft. Every
  "Observed" field is pending.
- [ADR 0001](decisions/0001-services-stay-independent.md), with status
  Proposed.
- [Architecture](wiki/Architecture.md) and [Roadmap](wiki/Roadmap.md), both
  with status draft.

### Checks run

The checkers were installed in a scratch directory outside this repository,
not from this repository's `package.json`, which does not exist yet. The
versions were markdownlint-cli2 0.24.2 (markdownlint 0.42.2), remark-cli
12.0.1, remark-validate-links 13.1.0, and actionlint 1.7.12.

- markdownlint-cli2 with `MD013` turned off and `MD024` limited to siblings
  reported 0 issues across the 5 files in `docs/`.
- remark with remark-validate-links (`repository: false`), run on a scratch
  copy of `docs/` inside a Git repository, exited 0.
- remark-validate-links exited 1 on a broken-link fixture and printed
  ``Cannot find file `does-not-exist.md` ``.
- actionlint exited 1 on a malformed workflow fixture and printed
  `"runs-on" section is missing in job "broken"`.

These are drafting checks. They are not Chapter 00 evidence, because the
chapter's own scripts and repository do not exist yet.

### Findings and corrections

| Code | Finding | Change |
| --- | --- | --- |
| F6 | remark-validate-links failed with `Command failed: git remote -v` outside a Git repository, and with ``Cannot find remote `origin` of local Git repo`` in a repository that has no `origin` remote. It failed before checking any link, so a fixture test that checked only the exit code would have passed for the wrong reason. | Chapter 00 sets `repository: false` in `.remarkrc.json`, and its fixture test also asserts the message text. |
| F7 | remark-cli printed the whole Markdown file to stdout when given a single file. | Chapter 00 adds `--no-stdout` to every remark command. |
| F8 | markdownlint rule MD024 rejected this log, because each entry repeats headings such as "Not done". | Chapter 00 sets `MD024` to `siblings_only: true`. |

The first drafts named private repositories. They were rewritten in generic
terms before anything was pushed (Q25).

### Not done

- `git init`, `LICENSE`, `README.md`, `package.json`, the checker
  configuration, the fixtures, the tests, the evidence records, the pull
  request template, and `validate-tooling.yml`.
- Creating the GitHub repository, changing security settings, and opening a
  pull request.
- Review of ADR 0001. It stays Proposed until the maintainer approves it.

## 2026-11-26 Chapter 00 steps 6 to 10

Claude wrote the files for Chapter 00 steps 6 to 10 and ran them locally.
The directory is still not a Git repository, so nothing is committed.

### Work done

- Installed Node v26.13.1 with `nvm install 26`, because it was not installed.
- Wrote `.nvmrc`, `.gitignore`, `package.json`, `.markdownlint-cli2.jsonc`,
  `.remarkrc.json`, the two fixtures, `tests/fixtures.test.mjs`,
  `tests/evidence.test.mjs`, `docs/evidence/00-local.json`, and
  `docs/evidence/00-actions.json`.
- Ran
  `npm install --save-dev markdownlint-cli2 remark-cli remark-validate-links`,
  which wrote `package-lock.json` with markdownlint-cli2 0.24.2, remark-cli
  12.0.1, and remark-validate-links 13.1.0.
- Filled in the "Observed" fields for steps 6 to 10 in
  [Build 00](wiki/Build-00-Foundation.md).

### Results

These ran on macOS with Node v26.13.1, npm 11.20.0, and actionlint 1.7.12.

- `npm test` passed 5 of 5, including both fixture tests and the evidence
  record tests.
- `npm run validate` exited 1 at `validate:docs` (F9).
- `npm run validate:workflows`, run on its own, exited 3 (F10).
- Both evidence records stay in `draft`.

### Findings and decisions

| Code | Finding or decision | Outcome |
| --- | --- | --- |
| F9 | `validate:docs` passes `README.md` and `.github` to remark by name. Until steps 2 and 11 create them, remark exits 1 with `No such file or folder`. | No change. A checked path that goes missing should fail loudly. `remark .` with `--ignore-pattern fixtures` passed on the current tree, but it was not confirmed to include the hidden `.github` folder. |
| F10 | actionlint run with no arguments finds workflows by locating `.github/workflows` in a Git repository. Without one it exits 3 with `no project was found in any parent directories`. | No change. The check is expected to pass after steps 1 and 11. The fixture test passes the fixture path directly, which works without a repository. |
| F11 | Chapter 00 had no `.gitignore`, so `node_modules/` would have been committed at step 11. | Step 7 now writes `.gitignore` containing `node_modules/`. The file was written. |
| Q26 | Accept the 13 `npm audit` findings (4 low, 9 moderate), including the minimatch advisory GHSA-g3hv-75wg-m249, and keep `npm audit` out of `validate`. | Accepted by the maintainer. The packages are development-only checkers that read this repository's own files, not untrusted input. npm's only full fix downgrades remark-validate-links to 12.1.1, which npm calls a breaking change. Revisit in the Chapter 04 dependency audit. |

### Not done

- Steps 1 to 5 and 11 to 13.
- The positive proof from a fresh clone, and the deliberate fixture repair in
  the negative proof.
- `.gitignore` has not been checked with `git check-ignore`, because no Git
  repository exists yet.

## 2026-11-26 Chapter 00 step 11

Claude wrote the step 11 files and ran `npm run validate`. The directory is
still not a Git repository, so nothing is committed.

### Work done

- Wrote `README.md`, `.github/pull_request_template.md`, and
  `.github/workflows/validate-tooling.yml`.
- Resolved the action pins and the actionlint checksum. The values and the
  method for each are in the step 11 "Observed" field of
  [Build 00](wiki/Build-00-Foundation.md).
  - `actions/checkout` is pinned to `3d3c42e5aac5ba805825da76410c181273ba90b1`
    (v7.0.1).
  - `actions/setup-node` is pinned to
    `949feb2413d6458794dcd2491c4babbbce0c15c1` (v7.1.0).
  - actionlint 1.7.12 is pinned to linux_amd64 sha256
    `8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8`.
- Downloaded the pinned actionlint archive on macOS to check it. The checksum
  matched, and the archive contains the `actionlint` binary.

### Results

These ran on macOS with Node v26.13.1 and actionlint 1.7.12.

- `npm run validate` exited 3. `validate:docs` passed across 7 files, then
  `validate:workflows` stopped with `no project was found in any parent
  directories`, as F10 predicts until step 1 runs.
- `actionlint -no-color .github/workflows/validate-tooling.yml` exited 0 with
  no findings.
- `npm test` passed 5 of 5.

### Findings

| Code | Finding | Outcome |
| --- | --- | --- |
| F12 | markdownlint rule MD041 rejected `.github/pull_request_template.md`, because its first line is `## Outcome` and not a top-level heading. A pull request template starts at `##`, because the pull request title is the top-level heading. | Added `<!-- markdownlint-disable-file MD041 -->` to that file only. markdownlint then reported 0 issues. |
| F9 follow-up | The open question under F9 was whether naming `.github` would cover the hidden folder. remark checked `.github/pull_request_template.md` in this run. | Confirmed. Naming paths explicitly covers `.github`. |

### Not done

- Steps 1 to 5, 12, and 13, so `npm run validate` cannot pass in full yet.
- The workflow has not run on GitHub. Its curl, `sha256sum`, and
  `GITHUB_PATH` lines have not run on a Linux runner.
- The positive proof from a fresh clone, and the deliberate fixture repair.

## 2026-11-26 Chapter 00 steps 1 to 3

Claude ran Chapter 00 steps 1 to 3 at the maintainer's request. The directory
is now a local Git repository with one commit. Nothing is pushed, and no
remote exists.

### Work done

- Ran `git init -b main`.
- Wrote `LICENSE` with the apache.org Apache-2.0 text, copied byte for byte
  from `https://www.apache.org/licenses/LICENSE-2.0.txt`. Its sha256 is
  `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`. GitHub's
  license API copy differs only in whitespace. No `NOTICE` file was added
  (Q21).
- Made the bootstrap commit
  `855f8a1eb702bd01cfb9ecac4f2a36f3df4a9601` (`855f8a1`) on `main`, with the
  message `chore: bootstrap repository with license and readme`. This hash is
  the amended commit (see Correction). It contains
  only `LICENSE` and `README.md`, 2 files and 247 insertions, with no
  co-author. This is the one commit that bypasses review (Q23).

### Results

- `npm run validate` exited 0 for the first time. markdownlint reported 0
  issues across 7 files, actionlint found the project and reported nothing,
  and `npm test` passed 5 of 5. This resolves F10.
- `git check-ignore -v node_modules/` printed `.gitignore:1:node_modules/`.
  This completes the F11 check.
- The evidence records stay in `draft`. The positive proof needs a fresh clone
  of the pushed repository.

### Findings

| Code | Finding | Outcome |
| --- | --- | --- |
| F13 | The bootstrap commit has the full README, not the stub that step 2 describes, because steps 6 to 11 ran first. On `main`, the README links to files under `docs/` that arrive only with pull request #1, so those links are broken on GitHub until it merges. Step 2 also expected `LICENSE` and `README.md` to be the only untracked files, but many were. | Accepted. The links resolve once pull request #1 merges. The step 2 "Observed" field records the difference, and the step 2 instructions are unchanged. |
| Q27 | Set the repository-local `user.email` to the GitHub noreply address `2568193+timDeHof@users.noreply.github.com`, and amend the bootstrap commit before the first push. | Accepted by the maintainer. A commit pushed to a public repository exposes its author email permanently, and changing it after the push would need a force-push. The global Git configuration is unchanged. |

### Correction

The bootstrap commit was first recorded as `7cc2c32`
(`7cc2c328b2c338a3b301d09876e21926115b976a`). That commit carried a personal
email address from the global Git configuration. Before anything was pushed,
`git config user.email` set the noreply address for this repository only, and
`git commit --amend --reset-author --no-edit` replaced the commit with
`855f8a1` (`855f8a1eb702bd01cfb9ecac4f2a36f3df4a9601`). The new author and
committer are the noreply address. `git diff 7cc2c32 HEAD` is empty, so the
files are unchanged. The old commit remains only in the local reflog and is
not reachable from `main`, so a push does not send it.

### Not done

- Step 4, creating the public repository and pushing `main`. It needs the
  maintainer's yes on the exact command (Q24).
- Steps 5, 12, and 13, the positive proof from a fresh clone, and the
  deliberate fixture repair.

## 2026-11-26 Local paths in captured output

After step 5, the Chapter 00 files were committed on `chapter-00-foundation`
as `e667d03` (`e667d03db98a2c6fbb245a8570cf6eb6ef155444`). That commit had not
been pushed when this change was made.

### Findings and decisions

| Code | Finding or decision | Outcome |
| --- | --- | --- |
| F14 | Two lines of quoted command output in [Build 00](wiki/Build-00-Foundation.md) contained the local home directory path, which includes the macOS username. They were the step 1 `git init` output and the step 11 actionlint error. Pushing the branch in step 13 would publish that username. `git grep -n "/Users/" HEAD` found no other occurrence in the tree. | Fixed by Q28. |
| Q28 | Shorten the home directory to `~` in quoted output, and amend the unpushed commit `e667d03` before step 13 pushes the branch. | Accepted by the maintainer. Both lines now show `~/...`. Build 00 states that captured output shortens the home directory and changes nothing else. The plan's section 6 asks for captured output to be reviewed for identifying data before publication. |

### Correction

`e667d03` was amended with `git commit --amend --no-edit` to include this
change. The amended commit contains this entry, so its own hash cannot appear
here. The next build log entry records it. `e667d03` remains only in the local
reflog and is not reachable from `chapter-00-foundation`.

## 2026-11-26 Chapter 00 steps 4, 5, and 12

Claude ran steps 4, 5, and 12 after the maintainer approved each one.

### Work done

- **Step 4.** Ran
  `gh repo create timDeHof/platform-tooling --public --source=. --remote=origin --push`
  after the maintainer approved the exact command (Q24). It exited 0 and
  pushed `main` at `855f8a1` to `https://github.com/timDeHof/platform-tooling`.
  `gh repo view` reports visibility `PUBLIC` and default branch `main`. The
  remote `main` holds only `LICENSE` and `README.md`, with the noreply author.
  GitHub first reported no license, then `Apache-2.0` moments later.
- **Step 5.** Ran `git switch -c chapter-00-foundation` from `855f8a1`, then
  committed the 19 remaining Chapter 00 files as `e667d03`. Before the
  commit, `npm run validate` exited 0, and the staged diff matched no token
  patterns and none of the redacted private names. The Q28 amend replaced
  `e667d03`.
- **Step 12.** Ran the read-only check
  `gh api repos/timDeHof/platform-tooling --jq .security_and_analysis`. Secret
  scanning and push protection were already `enabled`, so the PATCH command
  was not run.

### Commit hash

When this entry was written, the Chapter 00 branch commit after the Q28 amend
was `3bd6c44` (`3bd6c440b85c20ffab9a24e70c4237c93eda5187`), on top of `main`
at `855f8a1`. Neither commit on the branch has been pushed.

### Findings

| Code | Finding | Outcome |
| --- | --- | --- |
| F15 | GitHub enabled secret scanning and push protection on the new public repository by default. Dependabot security updates, non-provider patterns, and validity checks were `disabled`. | Step 12 needed no change. The three disabled settings are outside Q17 and are left for Chapter 04. |

### Not done

- Step 13, pushing `chapter-00-foundation` and opening pull request #1.
- The positive proof from a fresh clone, the deliberate fixture repair, and
  the first hosted `validate-tooling` run.

## 2026-11-26 Chapter 00 negative proof and pull request #1 draft

### Work done

- **Negative proof.** This ran on `chapter-00-foundation` at `445202b`, Node
  v26.13.1.
  1. Line 3 of `fixtures/docs/broken-link.md` was changed to link to the
     existing `../../README.md`.
  2. `npm test` exited 1 with 4 passed and 1 failed. The failure was
     `remark rejects a broken relative link and names the missing file`, with
     `AssertionError [ERR_ASSERTION]: fixtures/docs/broken-link.md: no issues found`.
  3. `git checkout -- fixtures/docs/broken-link.md` restored the committed
     fixture, and `git diff` was then empty.
  4. The rerun of `npm test` exited 0 with 5 of 5 passing.

  The output is in the negative proof "Observed" field of
  [Build 00](wiki/Build-00-Foundation.md). The actionlint fixture was not
  repaired, because the chapter's negative proof covers only the link fixture.
- **Pull request #1 draft.** Claude drafted the body for
  `Chapter 00: foundation and independent validation` (base `main`, head
  `chapter-00-foundation`) in a local file outside this repository. It has
  these sections: Why, Summary, Evidence, Verification tier claimed,
  Definition of done, Merge Danger, and Out of scope. The maintainer has seen
  it. It has not been posted. Its definition-of-done item "The deliberate
  negative check ran" was written before this run, so it still says the repair
  is pending.

### Commit

This entry and the negative proof "Observed" field are committed as a new
commit on top of `445202b`, not as an amend. `445202b` stays reachable from
`chapter-00-foundation`. After the Q28 amend, amending a log entry into the
commit it describes left that entry one hash behind, and a separate commit
avoids that.

### Not done

- Updating the pull request #1 draft for this run, and showing it to the
  maintainer again.
- Step 13, pushing `chapter-00-foundation` and opening pull request #1.
- The first hosted `validate-tooling` run, and the positive proof from a fresh
  clone. Both evidence records stay `draft`.
