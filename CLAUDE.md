# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@paciolan/remote-component` is a React library (TypeScript) that dynamically loads React components from URLs at runtime. It wraps `@paciolan/remote-module-loader` to provide React-specific APIs (component, hook, and promise-based).

## Commands

```bash
npm run build          # Compile TypeScript (tsc) → dist/
npm run test           # Run Jest tests
npm run test:changed   # Test only files changed since HEAD
npm run test:coverage  # Run tests with coverage (100% threshold required)
npm run lint           # ESLint with auto-fix
npm run rebuild        # Clean + build
npm run watch          # Watch mode compilation
```

To run a single test file:
```bash
npx jest src/__tests__/createRequires.test.ts
```

## Architecture

The library exports three consumption patterns, all built on `@paciolan/remote-module-loader`:

1. **`createRemoteComponent`** → Factory that returns a React component. Accepts `url`, `fallback`, `render` (render prop), and spreads remaining props to the loaded component.

2. **`createUseRemoteComponent`** → Factory that returns a React hook. The hook returns a `[loading, err, Component]` tuple. Supports named exports via second argument (`imports`).

3. **`fetchRemoteComponent`** → Promise-based loader for programmatic/SSR use. Supports custom fetchers.

**Dependency injection system**: Remote components need access to shared dependencies (React, etc.). This is handled by:
- `createRequires` — builds a `require`-like resolver from a dependency map (supports lazy evaluation via function)
- `getDependencies` — auto-discovers `remote-component.config.js` (webpack alias pattern) and ensures it references itself recursively

**Pre-configured export**: `RemoteComponent` in `src/components/` is a ready-to-use component wired with `getDependencies` + `createRequires`.

**SSR support**: `getServerSideProps` loads a remote component and calls its `getServerSideProps` if present (Next.js pattern).

## Code Conventions

- TypeScript with CommonJS output; declarations and source maps generated
- Tests live in `__tests__/` directories colocated with source (e.g., `src/__tests__/`, `src/hooks/__tests__/`)
- Testing: Enzyme for component tests, `@testing-library/react-hooks` for hook tests
- 100% code coverage enforced (branches, functions, lines, statements)
- Prettier: no trailing commas, avoid arrow parens
- Conventional Commits enforced by commitlint (format: `type: emoji description`, e.g., `feat: ✨ add feature`)
- Git hooks (husky): pre-commit runs lint + changed tests; pre-push runs build + full coverage
