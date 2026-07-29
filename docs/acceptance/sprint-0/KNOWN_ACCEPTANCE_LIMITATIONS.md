# Known technical-acceptance limitations

- Formal Product Owner and Technical Director acceptance are outstanding.
- Remote GitHub Actions status and dependency-security toggles require an
  authenticated private-repository session; no remote pass is claimed.
- The current Environment Agency vector revision does not reproduce the supplied
  Aynsworth Avenue reference classification. It returns 0.0% Flood Zone 3,
  87.1% Flood Zone 2 and 12.9% Flood Zone 1; the supplied reference is 32.2%,
  53.8% and 14.0% respectively. The supplied raster-style example visibly
  represents different flood extents, so dataset identity/revision must be
  reconciled before Product Owner acceptance.
- The fixed controlled-browser viewport prevented automated 1024 px and narrow
  window captures. These remain short manual visual checks.
- Native file-chooser population and malformed-file selection were not exposed by
  the browser controller. The production parsing/error code and deterministic
  malformed-GeoJSON regression passed.
- Console and failed-request event streams were not exposed by the browser surface.
  Awaited search/live-service outcomes and user-visible error states were recorded.
- Public Nominatim, base-map tiles and the EA vector service remain external
  availability/CORS dependencies.
- Colney Heath is no longer the primary pending golden case. Aynsworth Avenue is
  the approved Sprint 0 golden case and its authoritative red line is retained as
  an exact, documented GeoJSON conversion.
- The candidate includes no Sprint 1 datasets or professional planning conclusion.
