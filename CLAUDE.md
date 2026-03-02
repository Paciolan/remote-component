# CLAUDE.md

## Project Overview

`@paciolan/remote-module-loader` is a TypeScript library that dynamically loads CommonJS modules from remote URLs. It works in both browser (XMLHttpRequest) and Node.js (http/https) environments, auto-detecting which fetcher to use. Modules are evaluated via `new Function()` with dependency injection through a `requires` function.
