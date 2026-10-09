# TODO Log

> Searchable record of closed project work. Active work lives in `TODO.md`.

## 2026

### 2026-10

- [x] 2026-10-09 — **`caceres aportar` and `junta aportar` verified live.**
  - Result: `caceres aportar` (64a48b6, Relec form over HTTP) registered
    ENT2026041263 (CSV 16336616641771423311, four PDFs as DECL/ALTER/CERTI/OTROE
    to expediente 2026/00032519N, VIBRA LAB SL as interesado, holder as
    representative); the sede accepted the local XAdES form signature and the
    PAdES documents, and the registry number appears only in the justificante.
    `junta aportar` (3eee739) registered ENT20260859077 for expediente
    2026/25777D. Evidence: justificantes under
    `ArchivoFiscal/Vibra Lab S.L./Subvenciones-Ayudas/2026/`.

- [x] 2026-10-07 — **Blocked → done:** `dehu comparecer` opens pending DEHU
      notifications over plain HTTP.
  - Result: the owner authorised opening every pending notification. One
    (Deluxe, OARGT) was accepted through the wiki's Playwright flow with a HAR
    recorded; the exchange is legal text id, `appearance-login-form`, a second
    Cl@ve relay that skips the IdP chooser, a fresh bearer from
    `appearance-login-check`, and POST `voucher` `{"operation":"aceptar"}`. The
    new command then accepted two more live (an OARGT providencia for a natural
    person and a court LexNET notification delivered as a ZIP), each in about a
    minute, and saved document and acuse. `pnpm check:ci` green.
- [x] 2026-10-07 — **Testing:** `aeat comparecer --confirmar si` live.
  - Result: notification 2699864820446 (an interest liquidation) opened in the
    AEAT sede; the receipt parsed (fechaNotificacion, CSV) and both the act and
    the acuse PDFs were saved with `--out`.

- [x] 2026-10-07 — **Testing:** `aeat informativa --confirmar si` presents a
      real modelo 190 through TGVI.
  - Result: the first real filing went through on 2026-10-07 16:48, a modelo
    190-2025 for a dissolved ESPJ, signed by a member's personal certificate "en
    representación de". The validation run answered 7 records valid and 0
    failing, `PresentarEnvio` was accepted, and the cotejo returned the
    justificante PDF with its registry number and CSV, saved with `--out`.
    Before filing, an adversarial review compared the file with the AEAT 2025
    logical design: placement was correct, but two input rows had the wrong
    province (the employer's, not the perceptor's home) and a temporary contract
    end payment had been put in L05. Those mistakes are now documented in the
    README.

- 2026-10-06 [-] **Launch after `v0.1.0`.** Listing PR opened 2026-09-26: —
  Superseded: GeiserX/awesome-spain #45 was closed unmerged 2026-09-26; the
  re-proposal item replaces it. LinkedIn post unverified.
- [x] 2026-10-05 — **Integrations:** `dgsfp reclamacion` files a complaint
      (TEL43) at sededgsfp.gob.es (72566d04).
  - Result: certificate login through Cl@ve (`createClave2Request`, AFIRMA),
    form values rebuilt from `obtenerFormularioProcedimiento` and the reusable
    sections, FilePond uploads keyed by SHA-256, `comprobarAdjuntoPresentacion`,
    `guardarBorradorPresentacion`, the request document signed locally PAdES,
    and `registrarPresentacionTelematica`. Used live for the MyBox Salud
    complaint against CaixaBank: registry REGAGE26e00086595724, 05/10/2026
    17:14:22, CSV GEISER-2ddf-3df3-93c5-4e04-bb4c-bcb9-ad59-0cac; the
    justificante lists all four attachments with their hashes. `pnpm check:ci`
    green.

- [x] 2026-10-03 — **Backend:** `rolece solicitud --confirmar si` files the
      Solicitud Simplificada.
  - Result: "Firmar y Enviar Solicitud" answers the unsigned draft (files
    nothing); its Firmar button calls `AutoScript.sign` on `campoXML` with
    SHA256withRSA, `XADES`, `format=XAdES Enveloped`, `nodeToSign=root`, and
    `firmaExito` posts `firma` (base64) and `xmlFirmado` (bytes) to
    `firmaSolicitud!firmarSolicitud` in ISO-8859-1, with the token `body_load()`
    writes. `signXml` gained `signedNodeId` (`URI="#root"`, the signature inside
    that node); the command checks the draft's operator, address and province
    and that the certificate represents the operator. "Descargar el Justificante
    Electrónico" answers a ZIP (the registry's signed proof XML and its XSL),
    not a PDF. Not reproduced from AutoFirma: `ds:KeyName` and the extra XPath
    transform; the portal accepted it.
  - Evidence: `pnpm check:ci` green (1200 tests); xmlsec1 verifies the signed
    draft; one live filing for B22903801: Número de Registro
    ROLECE2026E000070053, expediente 2026\020459, solicitud 2026\121716.
    `rolece estado` then reads the check screen's "Ya existe una solicitud para
    este operador económico pendiente de recibir los datos del Registro
    Mercantil" as `pendingApplication: true`, and `solicitud` refuses to file
    again.

- [x] 2026-10-03 — **Backend:** `junta presentar` and `junta justificante`, the
      Junta de Extremadura's Registro Electrónico General (STA registry SPA).
  - Result: the SPA's JSON API (`/sta/api/v1`, `X-CSRF-TOKEN` from the `__csrf`
    cookie) runs draft save, multipart uploads, the `sign` save, the AutoFirma
    exchange over plain HTTP (`AutofirmaDownload` returns the `<REGIS>` form in
    base64, signed locally as XAdES-BES enveloped, `AutofirmaUpload` takes it
    back) and the `mode: ""` submission, which answers
    `{id, date, document.cud}`. The justificante is
    `/sta/Utils/DocumentCheck?ACTION=view`.
  - Evidence: `pnpm check:ci` green (1186 tests); one live filing for 76048463K
    to A11030071, registro ENT20260840512, CSV A11002926LMYLAE6JZLK,
    justificante downloaded and its three SHA-256 match the uploads.

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
