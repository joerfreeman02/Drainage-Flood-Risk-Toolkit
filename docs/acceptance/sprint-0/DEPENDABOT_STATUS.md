# Dependabot status

`.github/dependabot.yml` configures:

- weekly npm checks at the repository root;
- separate production and development dependency groups;
- weekly GitHub Actions checks grouped into one update;
- no automatic merging.

Every update remains subject to tests, build, compatibility review and Technical
Director approval.

## Repository security settings

The private repository settings could not be verified or changed because the
available GitHub CLI token, connector and browser session were not authenticated
for this repository. No setting is claimed as enabled.

Smallest exact manual sequence:

1. Open repository **Settings → Security → Code security and analysis**.
2. Enable **Dependency graph**.
3. Enable **Dependabot alerts**.
4. Enable **Dependabot security updates**.
5. Enable **Grouped security updates**.

Do not change repository visibility and do not enable automatic merging.
