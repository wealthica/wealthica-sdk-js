# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wealthica SDK for JavaScript — a client library for the Wealthica API, supporting Browser, Node.js, and React Native environments. Published as `wealthica-sdk-js` on npm.

## Commands

- **Build:** `yarn build` (webpack, outputs `dist/` for browser and `lib/` for Node.js)
- **Test:** `yarn test` (Jest)
- **Test single file:** `yarn test -- __tests__/vezgo.instance.js`
- **Test watch:** `yarn watch:test`
- **Lint:** `yarn lint`
- **Lint fix:** `yarn lint-fix`

## Architecture

**Entry point:** `src/index.js` — exports a singleton `Wealthica` instance with an `init(config)` method that creates an `API` instance.

**Core class:** `src/api.js` — The `API` class handles:
- Environment detection (Browser/Node/ReactNative) to determine auth strategy
- Token management (server-side via secret, client-side via `authEndpoint` or `authorizer` callback)
- Connect widget lifecycle (iframe/popup for browser institution linking)
- Chainable callback pattern: `.onConnection()`, `.onError()`, `.onEvent()`

**Resources:** `src/resources/` — Each resource (institutions, providers, teams, transactions, history, positions) is a class that wraps API calls. Resources are instantiated via `createResources()` in `src/resources/index.js`. Data resources (providers, teams) are attached at init; user resources (institutions, history, transactions, positions) are attached on `login()`.

**Two API instances per user:** `api` (unauthenticated, for data/token endpoints) and `userApi` (with async request transform that auto-injects bearer tokens).

## Build Outputs

Webpack produces 4 bundles (configured in `webpack.config.babel.js`):
- `dist/wealthica.js` — Browser, `window.Wealthica`
- `dist/wealthica.min.js` — Browser minified with source maps
- `dist/wealthica.es5.js` — Browser UMD for build systems
- `lib/wealthica.js` — CommonJS for Node.js (this is `"main"` in package.json)

## Testing

Tests live in `__tests__/` (not colocated with source). Jest config in `jest.config.js`. Test setup in `__tests__/testutils/setup.js` provides global helpers (`mockNode`, `mockBrowser`, `mockReactNative`, `mockAxios`). Uses `axios-mock-adapter` for HTTP mocking.

## Linting

ESLint with `airbnb-base`. `no-underscore-dangle` is disabled (private methods use `_` prefix convention). The `example/react-native` directory is ignored.

## Release Process

Published to npm as `wealthica-sdk-js` (see `name` in `package.json`) by GitHub Actions (`.github/workflows/publish.yml`), never from a developer machine: a local `npm publish` bundles whatever `node_modules` the machine has instead of the lockfile (that is how 0.0.21 shipped axios 1.14.0). `prepublishOnly` fails on purpose, so a local `npm publish` stops with a pointer here.

`main` only takes squash-merged PRs, so the version bump goes through a PR and the tag goes on the squash commit:

```bash
# 1. On a branch: bump the version without tagging, add a CHANGELOG.md entry, open a PR, squash-merge it
npm version patch --no-git-tag-version   # or minor / major

# 2. Tag the squash commit on main and push the tag; this starts the publish workflow
git fetch origin
git tag vX.Y.Z <squash-commit-sha>
git push origin vX.Y.Z

# 3. Approve the `npm` environment deployment in the workflow run (Actions tab)
```

The workflow only runs for `vX.Y.Z` tags (no prereleases). The `build` job fails if the tag does not match the `package.json` version or its commit is not on `main`, installs with `--frozen-lockfile --ignore-scripts`, runs lint, tests and build, fails if the bundled axios is not the version from `yarn.lock`, and packs the tarball. The `publish` job (environment `npm`, the only job with `id-token: write`) publishes that tarball with `npm publish --provenance`, authenticated by npm trusted publishing (OIDC) — there is no npm token. The trusted publisher on npmjs.com is GitHub Actions, organization `wealthica`, repository `wealthica-sdk-js`, workflow `publish.yml`, environment `npm`; renaming the workflow file or the environment breaks publishing until it is updated there.

Check the run in the Actions tab, then verify the new version shows the provenance badge on https://www.npmjs.com/package/wealthica-sdk-js.

There is no separate staging environment for this package — every published version is available to all consumers. Test changes locally with `npm link` or by pointing a consumer at a tarball before publishing.
