# TODO Log

> Searchable record of closed project work. Active work lives in `TODO.md`.

## 2026

### 2026-10

- [x] 2026-10-03 — **Backend:** `aeat certificado-corriente`, the AEAT
      "certificado de estar al corriente de obligaciones tributarias" (G304).
  - Result: `ECOTInternetCiudadanosServlet` runs the same EMCE-JDIT flow as the
    census certificate (fIslw, fAccion=2 validation, firma básica with the
    pre-filled `_fbNif`/`_fbNombre`, CSV, cotejo PDF), so that flow now lives in
    `fetchEmceCertificate` and both commands call it. `--finalidad` maps
    contratacion/subvenciones/generico to C1/B1/G1; `positive` comes from the
    "tiene carácter (de) POSITIVO|NEGATIVO" sentence of the MotorPDF text.
  - Evidence: `pnpm check:ci` green (1127 tests, clones unchanged at 10); one
    live run for B22903801, contratacion: CSV issued, POSITIVO, no debts listed.

### 2026-09

- [x] 2026-09-26 — **Backend:** The rest of the Junta Carpeta Ciudadana.
  - Result: `junta carpeta-expedientes` (30-day windows; the sede answers
    "Temporalmente se limita la búsqueda de expedientes a un rango máximo de 30
    días"), `carpeta-notificaciones` (every state, never opened), `documentos`
    and `representados`. Notifications, documents and represented expedientes
    search without dates; a date filter needs both ends. gobex requests wait 180
    s because the sede takes 50-70 s on some pages.
  - Evidence: `pnpm check:ci` green; live for 76048463K: 14 notifications (0
    pending, 3 expired), 17 documents, 13 represented, 1 expediente in the last
    365 days; the other certificates answer except E10484822's notifications
    (kept open in `TODO.md`).

- [x] 2026-09-26 — **Backend:** Junta de Extremadura and Ayuntamiento de Cáceres
      reads, released as 0.2.0.
  - Result: a shared T-Systems STA reader (`src/sta/`) gives
    `junta|caceres expedientes|notificaciones|registros` over the direct
    certificate login, listing notifications without opening them and refusing
    the contact-data confirmation gate. `src/gobex/` logs into the Carpeta
    Ciudadana through Cl@ve and gives `junta deudas|tasas|pagos`, posting no
    button but the search one. The FNMT server root is trusted alongside Node's
    roots; `juntaex.es`, `gobex.es` and `caceres.es` joined the host allowlist.
  - Evidence: `pnpm check:ci` green; live runs with all six certificates (STA:
    2/1/9 and 4/5/38 for the owner; gobex: 18 paid fees, pagos 2020-2022 and one
    "Embargo por fichero" set-off incident); three holders hit the Cáceres
    contact gate as designed; E10484822 `junta pagos` gets a sede 500 (kept open
    in `TODO.md`). Commits `61acd89`, `b2a8649`, `92d2048`.

- [x] 2026-09-26 — **Security:** Review of `5f03b02`, `f26f614` and `308dea4`.
  - Result: one blocker, two major, one minor, all fixed. Every request host,
    not only redirect targets, must be an administration host, because SAML
    relays post to a form action taken from the previous response. PDF streams
    inflate to at most 64 MiB. xref `/W` and `/Index` must fit the stream data.
    TGSS report file names are sanitised. The write gate and the XML parser (no
    DOCTYPE, no general entities, no recursion) were checked and are clean.
  - Evidence: `pnpm check:ci` green (462 files, 1029 tests); live `dehu list`,
    `sepe prestacion`, `cirbe estado` and `tgss nss` still log in.

- [x] 2026-09-25 — **Backend:** Certificate HTTP client, Cl@ve relay and CLI
      skeleton, then the AEAT, TGSS, DEHU and OARGT debt reads.
  - Result: `sedes <portal> <action>` with JSON on stdout, zero runtime
    dependencies, verified live on every holder the same day.
  - Evidence: commits `867495e`, `5f03b02`, fixes from the live run in
    `4043a2e`.

- [x] 2026-09-25 — **Refactors:** Layout by portal, feature and kind.
  - Result: 179 files moved, API and CLI unchanged.
  - Evidence: commit `9ebb1a4`, `pnpm check:ci` green.

- [x] 2026-09-25 — **Backend:** Read waves: AEAT pagos, declaraciones,
      informativas and certificado censal; DEHU documents; TGSS vida laboral,
      affiliation reports, bases and certificates; SEPE; OARGT amounts.
  - Result: each verified live once on the holder's certificate.
  - Evidence: commits `ee586c9`, `f26f614`.

- [x] 2026-09-25 — **Infrastructure:** Repository moved from BusiRocket to
      `InteliFactu/sedes`, Spanish README added.
  - Evidence: commit `b4412e1`; GitHub redirects the old URL.

- [x] 2026-09-26 — **Backend:** Write layer with plan mode, local PAdES and
      XAdES signing, CIRBE, offline NIF validation and fiscal calendar.
  - Result: 30 commands; writes act only with `--confirmar si`; no live act
    executed.
  - Evidence: commit `308dea4`, `pnpm check:ci` 457 files and 1010 tests
    passing; signatures verified with openssl, pdfsig, qpdf and xmlsec1.

- [-] 2026-09-26 — **Pending Decisions:** Rename to `papeleo`.
  - Resolution: applied without the owner's approval in `9baee9b`, reverted in
    `a1fb987` with the GitHub repository renamed back. The name stays open in
    `TODO.md`.

- [x] 2026-09-26 — **Pending Decisions:** Final name chosen by the owner:
      `ventanilla-unica`.
  - Result: package, binary, environment variables and GitHub repository
    renamed; nothing had been published as `sedes`.
  - Evidence: rename commit on `main`, `pnpm check:ci` green.

- [x] 2026-09-26 — **Refactors:** Local checkout moved from `~/p/sedes` to
      `~/p/ventanilla-unica`; the wiki page is now
      `projects/ventanilla-unica.md`.
  - Evidence: wiki `794125f1`, `~/p` `c472fa7`; `brain graph` reports 0 dangling
    links.

- [x] 2026-09-26 — **Security:** HTTP client and DEHU writer hardening before
      the first release.
  - Result: cookies scoped to a public suffix or a foreign domain are dropped;
    redirects to another host outside the administrations are refused; responses
    and undeclared decompression are capped at 64 MiB; DEHU file names are
    sanitised and writes outside `--out` are refused.
  - Evidence: `pnpm check:ci` 461 files and 1023 tests passing; live
    `cirbe estado` and `dehu list` through the new redirect check.

- [x] 2026-09-26 — **Infrastructure:** First releases on npm.
  - Result: `0.1.0` published by the owner from a clean clone of the tag;
    trusted publisher created with `npm trust github` for
    `InteliFactu/ventanilla-unica` and `publish.yml`; `0.1.1` (bin path without
    `./`) published by the workflow with provenance.
  - Evidence: tags `v0.1.0`, `v0.1.1`; Actions run 36235925200;
    `npm audit signatures` reports a verified signature and attestation.

- [x] 2026-09-26 — **Pending Decisions:** LICENSE copyright holder set to Vibra
      Lab S.L., the legal owner of InteliFactu per the wiki's project page;
      BusiRocket, the previous holder, is a trade name of the same company.
