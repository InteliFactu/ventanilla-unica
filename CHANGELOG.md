# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- `dehu comparecer` with several `--id`: the appearance relay of the first
  notification spends the listing bearer, so the second one got "no Cl@ve form
  in the appearance-login-form answer" and the error hid the first acceptance.
  Each later notification now logs in anew, and a failed one is reported as an
  outcome with its `error` instead of ending the run.
- `junta presentar` and `junta aportar`: a justificante download that fails
  after the entry is registered is now a note next to the registry number and
  CSV instead of an error that hid them.
- `dehu comparecer`: a failed re-login before a later notification is now that
  notification's `error` instead of aborting the run, and a download that fails
  after DEHU accepted keeps `accepted: true` and reports `downloadError`, since
  the deadlines already run.
- 036 events are sent as ASCII-escaped JSON: the `zkau` decodes the body as
  Latin-1, so an accented value ("Disolución y liquidación", "Cáceres") arrived
  longer than typed and the form answered Error LNGINC.
- `tgss deuda`: an ERROR message ("NO SE HA ENCONTRADO DEUDA...") is a refusal
  even when Prosa keeps the request's `DOCDocumento` in the audit block; it used
  to be taken for an issued report and end in `no PDF returned (status 500)`.

### Added

- `caceres datos-contacto --correo m [--telefono t]`: answers the Cáceres sede's
  contact-data gate, which blocked every command for a certificate that never
  logged in there (the Vibra Lab representative one did). It presses the gate's
  own confirming buttons in turn (`PERSCONTACT_ADD` with the data, then
  `PERSCONTACT_YES`, then the identification "SÍ"/"Aceptar"; never "NO" or
  "Modificar") and checks the session then opens. Plan only without
  `--confirmar si`.
- `junta aportar --expediente 2026/25777D --documentos a.pdf [--descripciones 'd1|d2'] [--informacion t]`:
  contributes documents to an open expediente through the Junta's "Aporte
  documentación" procedure (6269000000810119707984), registered as documentación
  complementaria to the unit handling the file. The expediente is looked up
  among the party's open ones (`/people/info/expedientes`) and sent as
  `apordoc.expId`. With a representative certificate (first `represented` entry
  `onlyagent`) the entity is the `subject` and the holder the `representedBy`
  agent, the parties the sede's own form sends (captured 2026-10-09). Plan only
  without `--confirmar si`.
- `nic correo --identificador H-ESNIC-F5 --email m`: asks Red.es (nic.es) to
  change an ES-NIC contact's email, signed with the certificate as implicit
  CAdES over the form's token (what @firma's `AutoScript.sign` returns). Without
  `--confirmar si` it only reads the form and checks the contact is a natural
  person. `nic.es` joins the hosts the certificate may be presented to.
- `dehu comparecer --id a,b [--out d]`: appears at pending DEHU notifications.
  The exchange was captured from one browser acceptance on 2026-10-07: GET
  `get_legal_text/1/es`, GET
  `notifications/<ref>/appearance-login-form/aceptar/<id>`, a second Cl@ve relay
  (it skips the IdP chooser inside the same Cl@ve session) whose
  `appearance-login-check` hands back a fresh bearer, then POST
  `notifications/<ref>/voucher` `{"operation":"aceptar"}` with that bearer.
  Without `--confirmar si` it only reports which identifiers are pending.

- `aeat expedientes`: reads the represented holder's Mis Expedientes list and
  each detail page for status, period, dates and listed acts. It does not open
  act links or cover separate TEA tribunal proceedings.

- `aeat baja`: files a modelo 036 baja en el censo (casillas 150-152) of a legal
  entity or ESPJ, with the sucesores of page 13
  (`--sucesores 'NIF;Nombre;%;cuota|...'`). Plan mode is offline; `--validar si`
  fills the 036 and presses "Validar declaración" at the AEAT, filing nothing;
  only `--confirmar si` signs and files it. The baja takes the entity out of the
  ROI too: the AEAT refuses casilla 150 with 130 (error 10655). Datebox values
  go as ZK's own client sends them (`jq.d2j` UTC parts with `z$dateKeys`).

- `tgss ccc`: lists the holder's códigos de cuenta de cotización with their
  situation (alta or baja, and since when), type and RED authorisation, from the
  Sistema RED consulta de autorizados (RETC0001), which a company certificate
  opens directly on that list.

- `aeat informativa`: presents an informative return file in the BOE design
  (190, 347, 180...) through TGVI Online. It acts for the file's declarant,
  switching the session to "en representación de" when the certificate holder
  differs, and validates every record at the AEAT (`InicializarEnvio`,
  `EnviarDatos`, `RecuperarErrores`), listing the failures by NIF; that opens an
  envío but presents nothing. Confirmed, it refuses any failing record, because
  the signature window would otherwise register only the valid ones, checks the
  type 1 record the window shows against the file, and presents with the firma
  básica (`PresentarEnvio`), saving the justificante by CSV.

- `aeat modelo190`: builds the BOE file of a modelo 190 (2025 design, claves A
  and L) from a perceptor CSV, offline; byte-identical to the file the AEAT
  accepted in a live validation.

- `aeat aportar`: files documents (alegaciones, a reply to a requerimiento) at
  the AEAT registry against the CSV of the notification they answer
  (`REGD-JDIT/FGCSV`), as interesado or as the interesado's representative with
  a power on record. Plan only without `--confirmar si` (the form the CSV
  resolves to is opened and its procedure and parties printed; nothing is
  uploaded); confirmed, it uploads each PDF (`EECA-FICH/UploadSv`), attaches it
  with its document type, checks the "Firma y envío" screen lists exactly those
  files, and registers the filing with the firma básica. The filing counts as
  presented that day.

- `junta carpeta-comparecer`: accepts a pending notification in the Junta de
  Extremadura Carpeta Ciudadana (sede.gobex.es). Accepting counts as notified
  that day and starts the act's legal deadlines; the sede signs the acuse
  itself, so no AutoFirma is involved. Plan only without `--confirmar si`; an
  already accepted notification is never accepted again, only downloaded with
  `--out`.

- `junta carpeta-descargar`: downloads the PDF of an already accepted Carpeta
  Ciudadana notification (and the acuse when the sede serves it as a PDF),
  walking the grid's pages to find it; refuses a pending one.

- `dgsfp reclamacion`: files a complaint (queja o reclamación, procedure TEL43)
  at the Dirección General de Seguros y Fondos de Pensiones sede
  (sededgsfp.gob.es) in the holder's own name. It logs in with the certificate
  through Cl@ve, rebuilds the form values from the published schema, uploads the
  PDFs (escrito, proof of the prior complaint to the entity's customer service,
  policy terms, other documents), signs the request document locally as PAdES
  and calls `registrarPresentacionTelematica`; with `--out` it saves the
  justificante and the signed request. Plan only without `--confirmar si`, where
  `--out` saves the unsigned request document for review.

- `junta presentar`: files a writ with PDF attachments in the Junta de
  Extremadura's Registro Electrónico General (tramites.juntaex.es) in the
  holder's own name. It drives the STA registry SPA's JSON API (`/sta/api/v1`):
  draft, multipart uploads, the `sign` save, the AutoFirma exchange
  (`AutofirmaDownload`/`AutofirmaUpload`) signed locally as XAdES, and the
  submission; with `--out` it saves the justificante. Plan only without
  `--confirmar si`.
- `junta justificante`: saves the justificante PDF of a registry entry by its
  CSV.
- The HTTP client accepts a binary request body.

- `aeat certificado-corriente`: emits the "certificado de estar al corriente de
  obligaciones tributarias" (procedure G304) for public-sector contracts, grants
  or a generic purpose (`--finalidad`), downloads the PDF and reports whether it
  came out POSITIVO or NEGATIVO (`positive`). It shares the EMCE-JDIT request
  flow with `aeat certificado-censal`.

## [0.3.0] - 2026-09-26

### Added

- `junta carpeta-expedientes|carpeta-notificaciones|documentos|representados`:
  the rest of the Junta de Extremadura's Carpeta Ciudadana. The sede limits an
  expedientes search to 30 days, so `carpeta-expedientes` sweeps
  `--desde`..`--hasta` (default the last 365 days) one window at a time.
  Notifications are listed, never opened.

### Fixed

- Carpeta Ciudadana requests wait up to 180 s: the sede takes 50 to 70 s on some
  result pages, past the client's 60 s default.

## [0.2.0] - 2026-09-26

### Added

- `junta expedientes|notificaciones|registros` and
  `caceres expedientes|notificaciones|registros`: the Junta de Extremadura's
  sede asociada and the Ayuntamiento de Cáceres, both T-Systems STA sedes with a
  direct certificate login. Notifications are listed, never opened. A holder the
  sede asks to confirm contact data first gets an error instead of a write.
- The FNMT server root ("AC RAIZ FNMT-RCM SERVIDORES SEGUROS") is trusted
  alongside Node's roots, which lack it; `tramites.juntaex.es` chains to it.
- `junta deudas|tasas|pagos`: the Junta de Extremadura's Carpeta Ciudadana at
  `sede.gobex.es`, reached through Cl@ve with the certificate. Searches post no
  button but the search one, so no certificate is ever issued; `pagos` also
  returns the "Incidencias del tercero" grid (set-offs, garnishments). A search
  the sede answers with a server error is reported as such.

## [0.1.2] - 2026-09-26

### Security

- Every request, not only a redirect, must go to an administration host. The
  Cl@ve and SAML relays take their next URL from a form in the previous
  response, so a tampered page could otherwise receive the client certificate.
- PDF structural streams inflate to at most 64 MiB, and an xref stream whose
  `/W` widths or `/Index` counts do not fit its data is refused.
- TGSS report file names built from `--nif` cannot leave `--out`.

## [0.1.1] - 2026-09-26

### Fixed

- The `bin` path is written without a leading `./`, which `npm publish` rewrote
  with a warning on 0.1.0. First release published from GitHub Actions through
  npm trusted publishing, with provenance.

## [0.1.0] - 2026-09-26

### Security

- Cookies whose `Domain` is a public suffix (`es`, `gob.es`...) or not a parent
  of the host that set them are dropped.
- A redirect to another host outside the administrations is refused, so the
  client certificate is never presented to it.
- Response bodies and undeclared decompression are capped at 64 MiB.
- DEHU document file names are sanitised, and nothing is written outside
  `--out`.

### Changed

- Renamed from `sedes` to `ventanilla-unica` before the first release: the
  package, the binary, the repository (`InteliFactu/ventanilla-unica`) and the
  environment variables (`VENTANILLA_UNICA_CERT`, `VENTANILLA_UNICA_KEY`,
  `VENTANILLA_UNICA_KEY_PASSPHRASE`).

### Fixed

- Bodies that read as text (JSON, HTML) are no longer fed to `inflateRawSync`,
  which accepted OARGT's pretty-printed JSON as a deflate stream and returned
  one garbage byte.

### Added

- Write layer: every command declares its effect (read, emit, sign, write);
  write commands run their read-only preparation and print a plan unless
  `--confirmar si` is given, and refuse before the act when the plan's reads do
  not match.
- `aeat comparecer`, `aeat carta-pago` (modelo 010) and `aeat domicilio` (modelo
  036, legal entities).
- `tgss aplazamiento` and `tgss adjuntar`, plan mode only until the signing
  exchange is captured; the TGSS "firma optimizada" (PKCS#1 of the
  server-prepared data) is implemented and tested.
- `firmar pdf`: PAdES-B-B signatures by incremental update, classic and stream
  xrefs, optional visible stamp.
- `firmar xml`: XAdES-BES/EPES (enveloped, enveloping, detached) on a strict XML
  parser and Canonical XML 1.0 (inclusive and exclusive).
- `cirbe informe` and `cirbe estado`: the Banco de España risk report.
- `validar nif` and `calendario fiscal`, offline, without a certificate.
- Certificate-bearing HTTPS client with cookie jar, redirect handling,
  ISO-8859-15 decoding and inflation of bodies compressed without a header.
- HTML form parsing and the Cl@ve auto-submit relay walker.
- CLI skeleton: `ventanilla-unica <portal> <action> [--cert] [--key] [--out]`,
  JSON on stdout, usage on `--help`.
- `aeat deudas`: pending debts, their detail and deferral agreements at the
  Agencia Tributaria.
- `tgss deuda`: the "informe de deuda exigible" at the Seguridad Social.
- `dehu list`: pending and realized notifications at DEHU, without opening any.
- `oargt recibos`: receipts in voluntary and enforced collection at OARGT
  Caceres.
- `aeat pagos`: every payment made at the Agencia Tributaria (MisPagos) with its
  full NRC, and the receipt PDFs with `--out`.
- `aeat declaraciones`: declarations filed for one modelo and ejercicio
  (SCEJ-MANT), the CSV of each receipt, and the PDFs with `--out`.
- `tgss vida-laboral`: the "informe de vida laboral acotado" for a date range
  (INAF0011).
- `dehu documentos`: the document and voucher of notifications already realized,
  with retries on the portal's rate limit; no notification is opened.
- Every portal is laid out by feature and by kind of file (`types/`,
  `fetchers/`, `parsers/`, `mappers/`, `selectors/`, `validators/`).
- `aeat informativas`: informative returns filed for one modelo and ejercicio
  (SCGI-DTRA, from 2020 on), with their CSV and the PDFs with `--out`.
- `aeat certificado-censal`: the "certificado de situacion censal" (EMCE-JDIT),
  emitted with the certificate's own identity and downloaded by CSV.
- `tgss deuda --tipo total`: the total debt report next to the detailed one.
- `tgss corriente`: the "certificado de estar al corriente" in its generic,
  tender, subsidy and article 42 variants (AECPSED1 options 1, 2, 3 and 5).
- `oargt recibos --importes`: today's amount per enforced receipt (principal,
  surcharge, interest, costs, total) through the portal's `CALCULAR_IMP` call.
- `tgss situacion`, `tgss nss`, `tgss datos`, `tgss alta`, `tgss empresario`:
  the affiliation reports INAF0013, INAF0007, INAF0008, INAF0009 and INAF0005.
- `tgss bases`: the "informe de bases y cuotas ingresadas" for one year
  (AESRCUS3), with the monthly rows per régimen next to the PDF.
- `sepe prestacion` and `sepe certificado`: the last unemployment benefit and
  the "certificado de situacion" at the SEPE, through its Cl@ve relay.
