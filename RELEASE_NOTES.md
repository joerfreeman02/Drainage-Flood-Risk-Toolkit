# DFT-0.1.0 Sprint 0 candidate release notes

Status: candidate for Technical Director manual acceptance; not a production baseline.

This build implements the first Flood Zone spatial workflow using the current Environment Agency Flood Map for Planning - Flood Zones vectors. It accepts an actual site polygon, classifies its area exclusively as Flood Zone 3, Flood Zone 2 after removal of Zone 3, and residual Flood Zone 1, and produces a traceable map, result and qualified narrative.

The live Environment Agency and geocoding services remain external runtime dependencies. The Colney Heath golden case remains intentionally unverified until the authoritative red line and manually checked expected result are supplied.

The candidate version numbers are unchanged by the CI, coverage, dependency
governance and acceptance-evidence additions. See `docs/KNOWN_LIMITATIONS.md`,
`docs/TEST_PLAN.md` and `docs/acceptance/sprint-0/ACCEPTANCE_REPORT.md` before
acceptance.
