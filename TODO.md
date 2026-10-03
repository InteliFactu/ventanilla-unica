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
- [!] **DEHU comparecencia.** Not implemented on purpose: the re-auth hop
  `.../aceptar/{ref}/login?authData=` and the accept call were never captured,
  and appearing is a legal act. Unblock: the owner records a browser HAR of one
  accept they choose to make, and authorises that specific notification.
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

## Testing

- [~] **AEAT `comparecer`, `carta-pago` and `domicilio`** ran live only in plan
  mode; the pages after the signature are inferred from the wiki flows and fail
  safe. Done when each has one owner-authorised live run and its receipt parsed.
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

- [ ] **STA registry filing: `caceres aportar` and `junta aportar` as gated
      `write` commands.** Owner, 2026-10-02: sede filings like this one must go
      through ventanilla-unica, not ad hoc Playwright. Two real filings exist as
      the reference: Cáceres "Alojamiento en despachos" (ENT2026039187,
      2026-09-30) and Cáceres "Aportación de documentación" (ENT2026040015,
      2026-10-02), plus the Junta STA "Aporte documentación" (ENT20260825259).
      The captured flow (form fields, `aportadoc_modo libre|req`,
      `referenciaAporDoc`, the `documentSignSend.jsp` upload popup that calls
      `MiniApplet.sign` with `Adobe PDF` per document and `XAdES` over
      `Form.xml` at "Firmar y enviar", the hidden template row, the transient
      `TimeoutException`, the justificante in `var docu`) is in
      `~/p/wiki/tools/sede-caceres/README.md`; the Playwright originals are in
      `ArchivoFiscal/Vibra Lab S.L./Subvenciones-Ayudas/2026/subsanacion-2026-10/_src/sede-caceres/`.
      Smallest next step: capture the HTTP requests of one plan-mode run (upload
      servlet, sign callback, final submit) and replay them on the existing
      `sta` session with `firmar pdf`/`firmar xml`. Done when
      `ventanilla-unica caceres aportar --referencia <registro> --doc <tipo>:<pdf>`
      returns a plan without `--confirmar si` and the registro plus the
      justificante with it.

- [ ] **Cáceres general registry.** `junta presentar` runs on the shared STA
      registry SPA, but only the Junta's procedure id
      (`generalRegistryProcedures`) is mapped. Next step: open
      `sede.caceres.es/sta/reg` once and record its general-registry id, then
      test a plan run.
- [ ] **`src/index.ts` is at the 100-line lint limit.** The registry modules
      (`fileStaRegistryEntry`, `downloadStaRegistryReceipt`) are not exported.
      Next step: split the index by portal, then export them.

## Documentation

- [~] **Launch after `v0.1.0`.** Listing PR opened 2026-09-26:
  https://github.com/GeiserX/awesome-spain/pull/45. LinkedIn post rewritten for
  the final name and write layer and handed to the owner the same day. Done when
  the PR is merged and the post is published.

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
