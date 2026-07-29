# ADR-0002 — Selective TPT component reuse

- Status: Accepted for Sprint 0 candidate
- Date: 2026-07-29

## Decision

Inspect TPT read-only and reimplement only product-neutral patterns: static modularity, project context, Leaflet lifecycle, EAS design tokens, diagnostics, deterministic tests, version visibility and Pages deployment.

Do not copy frozen module code, transport data, transport wording or the whole repository.

## Consequences

DFT remains independently governed. The detailed provenance and possible shared-platform candidates are recorded in `docs/TPT_REUSE_REGISTER.md`; later consolidation requires an explicit impact assessment.
