# TODO

> Consolidated from the accessible Claude project history. Last reviewed:
> 2026-09-26. History coverage: Partial. The session that built the write layer
> is still open, so its record stays partial; no Codex, Cursor or Antigravity
> history touched this repository.
>
> States: `[ ]` pending · `[~]` partial or unverified · `[!]` blocked · `[x]`
> verified complete · `[-]` obsolete or superseded. Closed work moves to
> `TODO_LOG.md`.

## Blocked Tasks

- [!] **PLACSP `pregunta` refuses `--confirmar si`.** The plan reads the public
  tender detail (expediente, órgano, estado, deadline, art. 138.3 date). The
  "Solicitar Información" tab, "Nueva Pregunta" and "Enviar" exist only with a
  logged-in operator session, and operators log in with user id and password
  only (no certificate, no Cl@ve). Vibra Lab has no account (`placsp estado` for
  info@tieneslavibra.com: "Id usuario y email permitidos."). Unblock: the owner
  self-registers at `/wps/portal/registrarse` (captcha, activation e-mail); then
  capture the logged-in form read-only.
- [!] **TGSS `aplazamiento` and `adjuntar` refuse `--confirmar si`.** The "firma
  optimizada" is implemented and tested. The protocol is no longer uncaptured:
  on 2026-09-22 a real deferral (registro 20265990000981409) and a CEUS
  attachment (justificante 20265990000982555) were filed from
  `~/p/wiki/tools/tgss/` (`xv207a01-aplazamiento.mjs`, `ceus-adjuntar.mjs`,
  `expose-node-signer.mjs`, `patch-autoscript.browser.mjs`), and
  `~/p/wiki/brain/topics/tgss-headless.md` section "XV207A01" documents the
  button walk, the Garantias radio pair, the field limits, the PEM-only
  certificate trap that 500s `PREPARARXML`, and the `SPM.ACC.FIRMAR` response.
  Those scripts drive Playwright and let the TGSS page's own JS build the
  FIRMA_* requests, so the HTTP bodies are still not on disk. Next step: rerun
  `ceus-expediente.mjs` (read-only) with Playwright request logging to record
  the CEUS bodies, then port; the deferral bodies need the next real deferral
  the owner authorises.

## Owner requests

- [ ] **`oargt recibo --numero <n>`: the detail and PDF of one OARGT receipt.**
      The list does not say what a receipt is for: Deluxe's 261243480 (ref 117,
      2026-07-20) could not be matched to a month. Next step: capture the detail
      and print request in the sede, read-only.
- [!] **`oargt fraccionar` (write, `--confirmar si`).** Requests a
  fraccionamiento in ejecutiva (ordinance: up to 6 months from 100,01 to 600, no
  guarantee below 30.000). The owner wants it once he has a job; blocked until
  then. Next step: capture the OARGT form when the first request is made.

## Maintenance

- [ ] Drop the two `minimumReleaseAgeExclude` entries in `pnpm-workspace.yaml`
      after 2026-10-08. Added 2026-10-07 for `@syntopica/eslint-config@0.9.0`
      and `eslint-plugin-code-policy@0.8.0`, which were inside the release-age
      window. Next: delete both lines and confirm `pnpm install` still resolves.

## Testing

- [~] **XAdES mutation test hit its 5-second timeout once under concurrent
  full-suite coverage.** The isolated `signXml.test.ts` passed 11/11, and
  `pnpm check:ci` passed 1,349/1,349 when rerun alone on 2026-10-07. Next:
  reproduce under sustained load before changing its timeout.

- [~] **`aeat aportar` act and receipt unverified.** Verified live on 2026-10-06
  with a real sancionador CSV: the form opens as GZ706 for a representative,
  five PDFs upload and attach, and the "Firma y envío" screen lists them and
  signs as the holder. The firma básica POST and the step-3 receipt were never
  sent, so `parseFilingReceipt` is lenient and the receipt page is always saved
  with `--out`. Smallest next step: after the first real filing, rewrite the
  receipt fixture from the saved page and tighten the parser. Files over 2 MiB
  go in one request where the dialog would chunk; also unverified.

- [~] **AEAT `carta-pago` and `domicilio`** ran live only in plan mode; the
  pages after the signature are inferred from the wiki flows and fail safe. Done
  when each has one owner-authorised live run and its receipt parsed.
- [~] **Junta `carpeta-comparecer` and `carpeta-descargar`** were built from the
  flow verified by hand on 2026-10-06 (accept by the `panelAceptar1` A4J button,
  download through `panelDescargar` `imprimirnot`) and tested offline only;
  scroller paging to a row past page 1 is untested live. 2026-10-06 live (owner
  cert, NoExp-NOT-222072_17351): `carpeta-descargar --out` saved a PDF identical
  byte for byte to the hand download (`acuse: null`), and `carpeta-comparecer`
  without confirm answered `accepted: 'already'`. Done when one owner-authorised
  confirmed acceptance of a Pendiente row runs through the CLI.
- [~] **`cirbe estado` download of a ready report.** The 2026-09-26 request was
  still "Registrada" at 03:18 and again at 12:20, two hours and nineteen minutes
  after it was made, across eight polls; the 14-minute-to-2-hour figure may hold
  only in office hours. Re-run `cirbe estado --out` during the day before
  suspecting the status parser. Done when a resolved request writes its PDF
  under `--out`.
- [ ] **TGSS debt report PDF path with a real debt.** Unexercised through the
      package because every indebted holder had used the day's emission. Run
      `tgss deuda --out` on a day one has not.

## Integrations

- [ ] **justicia: `justicia expedientes` for the Carpeta Justicia (read-only).**
      Mapped live 2026-10-09 with Alba's certificate (MON 670/2026). Needs
      `justicia.es` in `isAdministrationHost`. Login: GET
      `carpeta.justicia.es/c/portal/login` -> 308 to `selfservice-ext/login`,
      whose meta refresh goes to
      `am.justicia.es/selfservice-ext/saml2/sp/login/clave` (SAMLRequest form to
      pasarela.clave.gob.es); IdP chooser `idpRedirect` with
      `SelectedIdP=AFIRMA`, then the usual relay (`idpUrl` wins) back to
      `am.justicia.es/.../login/clave`, landing on `/group/guest/home`. List:
      GET `/group/guest/expedientes` (cards `cj-card__key/val`: Procedimiento,
      Organo, Estado, Fecha de estado, NIG); detail
      `...&_carjusmisprocedimientosmodule_mvcRenderCommandName=%2FmisProcedimientosDefault&_carjusmisprocedimientosmodule_idExpediente=<n>`
      carries the Atenea IRIS link
      `eje.justicia.es/visor-webapp/plantillaMatriz/accesoExternoEjeSeleccionOrgano-flow?coPro&nuPro&anPro&coOrd&codConsejo&rol=C`.
      Visor page gives `execution` (e1s1), `_csrf` meta and `var codExpediente`.
      POST `visor-webapp/plantillaMatriz/AjaxResolver?tipo=accesoExternoEje`
      with `X-CSRF-TOKEN`: `codOpe=accesoExternoEjeGetArbolByCodExpediente`
      (destino=procedimientoConstruccion, orden=asc) returns the full document
      tree; `getActosComunicacionDocumento` (idNodo) returns who was notified,
      by which channel and when; `getMetadataDocumento` (idNodo) gives tramite,
      escrito presenter and dates. Document content SOLVED the same day: the
      earlier 902s came from `nombreArbol=procedimientoConstruccion`; the visor
      JS maps the tab to `doc` (`eje`, `video`, `adm` for the others). POST
      `codOpe=accesoExternoEjeCheckDocumento` (codigoBarras,
      nombreProcedimiento, idDoc, operacionAuditoria=Consulta,
      esExpediente=false, codExpediente, esEje=false, checkFirmado=true,
      nombreArbol=doc) answers `{result:true, extension}`, then GET
      `visor-webapp/externoEjeControllerDocument?action=getDocumentoByCodigoApache&filename=doc<ext>&idDoc&execution&codigoBarras&nombreArbol=doc`
      returns the file; no extra cookie. All 37 documents of MON 670/2026 came
      down this way, so the ZIP job (`descargarFicheros`, estadoDescarga 7) is
      not needed. The three 2022-23 delitos-leves expedientes are refused by the
      visor itself ("No tiene acceso al procedimiento... no cumplir con los
      requisitos de acceso"), no codExpediente: a server-side access rule, not a
      client bug. Next: build list + tree + actos + document download as a
      command.

- [ ] **morosos: `experian acceso` and `equifax acceso` for the debtor files
      (BADEXCUG, ASNEF).** Mapped live 2026-10-09 for Alba (78117074N). Neither
      takes a certificate or Cl@ve; both are an account per person with an email
      code as second factor (read it from Vexa). Experian
      (`portaldelconsumidor.experian.es`): Blazor Server behind Incapsula, so
      the portal itself needs a browser, but the login is plain Okta classic:
      POST `https://experian-spainb.okta-emea.com/api/v1/authn`
      {username,password} -> MFA_REQUIRED (email factor) -> POST
      `factors/<id>/verify` {stateToken} sends the code -> same with passCode ->
      SUCCESS + sessionToken (or PASSWORD_EXPIRED, then
      `credentials/change_password` {stateToken,oldPassword,newPassword}; policy
      12+ chars, upper, lower, digit). The widget then exchanges an id_token at
      `api/create-user-session`; a stale portal session answers "El usuario no
      pudo ser verificado" until the Okta session is signed out. Flow: Inicio >
      BADEXCUG > Derecho de Acceso > Para mí mismo > Siguiente; the request is
      registered at once (code A..., 2026-10-09 A787054329551) and the result
      mail ("Solicitud derecho", noreply@experian.com) arrives in minutes; it
      stays two months in Mis Solicitudes; the PDF downloads from the row chip
      (`button.spcss-chip`, DOM click). Equifax
      (`www2.equifax.es/consumidores`): without the inclusion letter (ref
      "740/…") an account is required: create-account (persona física, NIF,
      address, province) -> Okta activation mail from authsvc-eu.equifax.com
      (168 h) -> password (12+, symbol) -> email factor -> PERFIL: upload DNI
      (one JPEG/PDF, max 2.9 MB) -> wait for the manual validation mail before
      ACCESO is allowed. In Orca, ref clicks do not reach Blazor/Angular
      handlers; DOM `.click()` and value plus `input` event do. Next: wrap the
      Okta login and the access request where HTTP reaches, browser step
      otherwise.

- [ ] **registro: cuentas anuales and legalised books have no free read route.**
      Investigated 2026-10-08 against sede.registradores.org: the CSV checker
      needs a real CSV plus requester NIF and a captcha; "Mis presentaciones"
      only shows the presenter's own filings (the gestoría's); the "Sociedad con
      Cuentas Depositadas" list may be free for subscribers (unconfirmed). The
      authoritative answer is a paid nota informativa mercantil (identification
      2,103542 + accounts relation 0,601012 + 0,601012 per legalised book,
      before tax). Next: decide whether to buy one per SL or build
      `registro nota` behind `--confirmar si`.

- [ ] **TEA appeal status is outside `aeat expedientes`.** The AEAT Mis
      Expedientes list covers its own 77 procedures for the tested holder and
      shows no recurso de reposición, but the separate Tribunales
      Económico-Administrativos may hold a reclamación. Next: map the TEA's
      certificate-authenticated, read-only case list and verify its coverage
      before asserting none is open.

- [ ] **dgsfp: read commands.** `dgsfp reclamacion` files but nothing reads
      back: no listing of the holder's presentations or drafts was found in the
      sede bundles. Next step: capture Carpeta/Mis presentaciones (if any) or
      read the registry entry through Carpeta Ciudadana by its REGAGE number.
- [ ] **dgsfp: the request document is rendered locally.** The browser renders
      it with react-pdf; the CLI writes an equivalent text PDF (same sections,
      values, hashes and HMAC) and signs it PAdES. The sede accepted it on
      2026-10-05 (REGAGE26e00086595724). Revisit only if the DGSFP objects.
- [ ] **dgsfp: drafts accumulate.** Each confirmed run saves a
      `guardarBorradorPresentacion` draft before registering; a failed register
      leaves it on the sede. Next step: find the draft delete call if one
      exists.

- [ ] **Dated AECPSED1 certificates (types 4, 8, 9)** are refused until the date
      field of the request is captured.
- [ ] **OARGT `LISTALIQ`** (liquidations) is server-rendered with a write button
      and was not ported.
- [!] **`junta pagos` answers HTTP 500 for E10484822.** The MisPagos search POST
  returns 500 with an empty body for that holder only, every year tried; the
  other five certificates answer. Server-side; recheck later and, if it
  persists, try the search per sociedad in the browser to see whether the sede
  itself fails there too.
- [!] **Re-propose to `awesome-spain`.** GeiserX/awesome-spain#45 was closed on
  2026-09-26 by the maintainer, kindly: too new (no stars or visible use,
  versions still shipping), it asks for the holder's certificate and acts on
  AEAT/TGSS/DEHU with write paths still "plan only", and it is the engine of a
  paid closed product. He invited a new proposal once it has use and stars and
  the write side is closed. Unblock: a few months of use, then reopen with that
  evidence.
- [ ] **Sistema RED (FR101, RETC)** has Playwright-only walks in
      `~/p/wiki/tools/tgss/` (`sede-red*.mjs`, `fr101-walk.mjs`). Capture at
      HTTP level before a port.
- [ ] **Duplicate AEAT client in InteliFactu.**
      `intelifactu/packages/core/src/aeat/` reimplements part of this package.
      Decide whether InteliFactu depends on `ventanilla-unica` or keeps its own,
      and file the result in both backlogs.

- [ ] **Cáceres general registry.** `junta presentar` runs on the shared STA
      registry SPA, but only the Junta's procedure id
      (`generalRegistryProcedures`) is mapped. Next step: open
      `sede.caceres.es/sta/reg` once and record its general-registry id, then
      test a plan run.
- [ ] **`src/index.ts` is at the 100-line lint limit.** The registry modules
      (`fileStaRegistryEntry`, `downloadStaRegistryReceipt`) are not exported.
      Next step: split the index by portal, then export them.

## Documentation

- [ ] **`--help` column overflows.** `usageText` pads `portal action` to 24
      characters, so `aeat certificado-censal` and `aeat certificado-corriente`
      run into their description with no space (seen 2026-10-03). Smallest step:
      pad to the longest command plus two, or always add one space.

## Future Ideas

- [ ] **PLACSP bid submission ("Preparación y Presentación de ofertas"): design
      note, not planned.** Evidence, Guía de licitación electrónica v9.1 and
      Guía del Operador Económico v5.3: offers are prepared in a Java 1.8
      desktop application launched by JNLP from the logged-in operator area,
      with Autofirma; documents stay on the client until sent, each sobre is
      encrypted client-side to the contracting body's key, the tool computes a
      "huella electrónica" and the platform answers a signed justificante. It
      requires an operator account with the additional company data filled in.
      No HTTP or web-service API for submission is published (the open data and
      the CODICE/sindicación feeds are read-only). Doing it over plain HTTP
      would mean reverse-engineering that applet's upload, sobre encryption and
      signature protocol, which no guide documents; the practical path is the
      official tool. Revisit only if a published submission API appears.
- [ ] FACe invoice submission. A production pipeline already exists in
      `~/p/wiki/tools/face/` (`face_client.py` SOAP with WS-Security,
      `facturae.py`, XAdES SHA-512 byte-compatible with AutoFirma through
      `afirma_bridge.py`). Port it here with the local XAdES signer rather than
      the AutoFirma bridge.
- [ ] RED SARA REC general registry filing.
- [ ] BOE fixed-width modelo writer and validator.
- [ ] **Rayuela (Educarex) portal:
      `rayuela mensajes|horario|faltas|profesorado|calificaciones`.** Mapped
      live on 2026-09-29 with the owner's parent account; the full flow is in
      `~/p/wiki/brain/topics/rayuela-headless.md`. Login is a plain form POST
      (`usuario`, `clave`, `tipo_acceso=NORMAL`, `nombre-pagina=identificacion`,
      `nombre-pagina-destino=comprobar-usuario`) to
      `modulo_acceso/controlador.rayuela;jsessionid=...`; certificate and Cl@ve
      buttons also exist (`peticionCertificadoDigital()`, `peticionClavePIN()`),
      so the holder's certificate path fits the package. The message list page
      carries each message's subject and HTML body in a hidden `.jsonLinea` JSON
      per row (truncated for long bodies), so the inbox reads without opening a
      message, which would mark it read. The whole read path was replayed with
      curl on 2026-09-29, so no HAR is needed: login POST, then
      `seleccion-modulo` POST with
      `aplicacionSeleccionada=SEGUIMIENTO_EDUCATIVO` returns an
      `EntradaDirectaUsuario.jsp?token=...` URL whose GET answers JSON with
      `nombreVentana`; every page is then
      `segedu/jsp/Principal.jsp?COD_PAGINA=<c_ code from menu.html>&X_MENU=...&N_V_=<nombreVentana>`
      (ISO-8859-1). Child switch is `cambiaAlumnoDirecto.jsp?alumnoSalto=<id>`;
      attachments are `PrincipalPPL.jsp` `idPPL=DOCADJMEN` then
      `EnviarFichero.jsp`. Endpoints and page names are in the brain page. Next
      step: port the read-only commands on that flow.

## Routed from `~/p/TODO.md` (2026-10-03)

Moved verbatim from `~/p/TODO.md` on 2026-10-03; the routing table in
`~/p/TODO_LOG.md` (entry of that date) records each move.

- [ ] **CI red on `main`.** Every push run since 2026-09-27 failed (latest
      2026-10-02 14:52 UTC, `gh run list -R InteliFactu/ventanilla-unica`); on
      2026-09-28 the failing step was `check:quality`. Split out of a cross-repo
      "Red CI" line in `~/p/TODO.md`.
