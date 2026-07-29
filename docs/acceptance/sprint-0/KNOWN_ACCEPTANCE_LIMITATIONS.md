# Known technical-acceptance limitations

- Formal Product Owner and Technical Director acceptance are outstanding.
- Remote GitHub Actions status and dependency-security toggles require an
  authenticated private-repository session; no remote pass is claimed.
- A native print-to-PDF file was not generated because the controlled browser
  surface cannot operate the system print/save dialog. The on-screen print layout
  was generated and visually inspected.
- The fixed controlled-browser viewport prevented automated 1024 px and narrow
  window captures. These remain short manual visual checks.
- Native file-chooser population and malformed-file selection were not exposed by
  the browser controller. The production parsing/error code and deterministic
  malformed-GeoJSON regression passed.
- Console and failed-request event streams were not exposed by the browser surface.
  Awaited search/live-service outcomes and user-visible error states were recorded.
- Public Nominatim, base-map tiles and the EA vector service remain external
  availability/CORS dependencies.
- Colney Heath remains unverified: no authoritative red line or independently
  checked expected result has been supplied.
- The candidate includes no Sprint 1 datasets or professional planning conclusion.
