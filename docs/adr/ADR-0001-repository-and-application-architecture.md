# ADR-0001 — Repository and application architecture

- Status: Accepted for Sprint 0 candidate
- Date: 2026-07-29

## Decision

Use an independent private repository and a framework-free static browser application bundled by esbuild and managed with pnpm. Separate configuration, project context, mapping, provider adapter, spatial engine, narrative and diagnostics modules. Do not add a backend, database or service worker.

## Rationale

The workflow contains no credential or persistence requirement and can run locally in the browser. Static hosting is recoverable and consistent with the governing TPT pattern while retaining independent drainage ownership.

## Consequences

External data CORS/availability is visible to the user and cannot be hidden by a proxy. Future datasets must implement adapters rather than coupling the engine to provider schemas.
