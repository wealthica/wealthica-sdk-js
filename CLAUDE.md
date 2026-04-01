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

```
npm version patch  # or minor/major
git push && git push --tags
npm publish
```
