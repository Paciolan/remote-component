# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@paciolan/remote-module-loader` is a TypeScript library that dynamically loads CommonJS modules from remote URLs. It works in both browser (XMLHttpRequest) and Node.js (http/https) environments, auto-detecting which fetcher to use. Modules are evaluated via `new Function()` with dependency injection through a `requires` function.

## Commands

- **Build:** `npm run build` (runs `tsc --declaration`, outputs to `dist/`)
- **Test:** `npm test` (Jest via ts-jest)
- **Test single file:** `npm test -- --testPathPattern=<pattern>` (e.g., `npm test -- --testPathPattern=memoize`)
- **Test changed files:** `npm run test:changed`
- **Test with coverage:** `npm run test:coverage`
- **Lint:** `npm run lint` (ESLint with Prettier integration)
- **Watch mode:** `npm run watch`

## Architecture

The library uses a factory pattern. The main export `createLoadRemoteModule` accepts options (`requires`, `fetcher`) and returns a memoized function that fetches a URL, evaluates the response as a CommonJS module, and returns `module.exports`.

Key source files in `src/lib/`:
- **loadRemoteModule.ts** — Factory that creates the loader; wires up fetcher and requires; uses `new Function("require", "module", "exports", data)` to evaluate remote code
- **createRequires.ts** — Factory that builds a `requires` function from a dependency map for injection into loaded modules
- **memoize.ts** — Single-argument memoizer that caches by URL to prevent duplicate loads
- **nodeFetcher.ts** — Node.js fetcher using `http`/`https` with chunked response handling
- **xmlHttpRequestFetcher/** — Browser fetcher using XMLHttpRequest

`src/models/index.ts` defines the `Fetcher` interface: `(url: string) => Promise<string>`.

## Testing

- Tests live in `__tests__/` directories alongside source files
- **100% code coverage is enforced** (branches, functions, lines, statements)
- `src/index.ts` is excluded from coverage collection
- Tests mock fetchers with `jest.fn()` and mock `http`/`https`/`XMLHttpRequest` for environment-specific tests

## Code Style

- Prettier: 2-space indent, no trailing commas, avoid arrow parens
- ESLint enforces Prettier formatting (single `npm run lint` command covers both)
- Conventional commits required (enforced by commitlint via husky hooks)
- Use `npm run cz` (git-cz) for interactive commit message creation
