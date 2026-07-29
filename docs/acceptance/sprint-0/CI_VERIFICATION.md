# CI verification

## Required gate

Workflow: `.github/workflows/ci.yml` (`CI`)

- triggers on pull requests into `main`;
- triggers on relevant pushes to `main` and the Sprint 0 branch;
- grants read-only contents permission;
- installs with `pnpm install --frozen-lockfile`;
- runs lint;
- runs all deterministic tests through `pnpm test:coverage`;
- runs the production build;
- uploads `coverage/` as the `sprint-0-coverage` artifact for 30 days.

The Pages candidate workflow is manual-only; no push automatically deploys it.

## Local clean-environment-equivalent result

On 29 July 2026:

- `pnpm install --frozen-lockfile`: pass
- `pnpm check`: pass
- `pnpm test`: pass, 28 of 28
- `pnpm test:coverage`: pass
- `pnpm build`: pass
- `pnpm test:live`: pass, 1 of 1

## Remote verification

The private repository was reachable through Git transport and pull-request refs
identified PR 1. The available GitHub CLI token, GitHub connector and browser
session were not authenticated for the private repository. Consequently the
workflow run ID, job conclusion and coverage artifact cannot be truthfully recorded
here until the pushed commit completes and an authenticated user checks it.

Smallest remaining action: sign in to GitHub, open PR 1, select **Checks**, wait for
`CI / quality`, and confirm it is green. Open that run's **Artifacts** section and
confirm `sprint-0-coverage` is present. Record the run URL and commit SHA here.
