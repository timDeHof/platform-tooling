# platform-tooling

Shared CI for independent JS/TS services: a versioned reusable Node CI
workflow, security checks, and an aggregate gate. Each service keeps its own
repository, scripts, deployments, and credentials, and calls a pinned release
of these workflows.

## Status

**Chapter 00 in progress.** This repository currently validates only itself.
No reusable workflow for services exists yet, and no service uses this
repository. See the [roadmap](docs/wiki/Roadmap.md) for what comes next.

## Supported consumers

None yet. The first consumer will be a private pnpm and turbo workspace
service, adopted in Chapter 05.

## Validate this repository

Prerequisites are git, nvm, Node 26, and actionlint. The
[Chapter 00 prerequisites](docs/wiki/Build-00-Foundation.md#dependencies-and-permissions)
list the exact checks.

```sh
nvm use
npm ci
npm run validate
```

`npm run validate` checks Markdown formatting, local links and anchors, and
workflow syntax. It then runs the tests, which include fixtures that each check
must reject.

## Documentation

- [Build 00: Foundation and independent validation](docs/wiki/Build-00-Foundation.md)
- [Architecture](docs/wiki/Architecture.md)
- [Roadmap](docs/wiki/Roadmap.md)
- [ADR 0001: Services stay independent](docs/decisions/0001-services-stay-independent.md)
- [Build log](docs/BUILD_LOG.md)

## License

Apache-2.0. The license text is in the `LICENSE` file.
