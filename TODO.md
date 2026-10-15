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
  capture the logged-in form read-only. Mailbox pass 2026-10-10: the account now
  exists. info@tieneslavibra.com got "DGPE: Activación de cuenta de usuario" for
  user `vibralabsl` and the communications-address change on 2026-10-03, and on
  2026-10-07 "PLACE: La pregunta del expediente 202600000109 ha sido contestada"
  (Centro Español de Metrología). Next: read that answer, then capture the
  logged-in form. Same mailbox, ROLECE 2026-10-03: "REQUERIMIENTO SUBSANACIÓN
  (DOCUMENTACIÓN BÁSICA) Debe remitirse nota mercantil simple a
  notasregistrales@patrimoniodelestado.es"; a notification followed on
  2026-10-05. Next: request Vibra Lab's nota informativa mercantil at
  registradores.org and send it there.
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

- [!] **`oargt fraccionar` (write, `--confirmar si`).** Requests a
  fraccionamiento in ejecutiva (ordinance: up to 6 months from 100,01 to 600, no
  guarantee below 30.000). The owner wants it once he has a job; blocked until
  then. Next step: capture the OARGT form when the first request is made.

## Maintenance

- [ ] **braces waiver expires 2026-11-15.** GHSA-vfj7-8cjw-p6xm (braces <=3.0.3,
      dev-only through type-coverage) had no patched release on 2026-10-15.
      Next: before the expiry, take the fixed braces through an override, or
      renew the entry in `.baseline-advisories.json` with the reason.

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

- [~] **TGSS `contacto` confirmed save and `domicilio` save.** 2026-10-11
  `tgss datos-personales` and both plans ran live (persona física cert); the
  contact data already matched, so the `ACC_GUARDAR_DATOS_CONTACTO` POST has
  never run and its answer page is assumed to re-render the datos personales
  page (the command re-reads it and fails otherwise). `domicilio` refuses
  `--confirmar si`: capture the `ACC_GUARDAR_DOMICILIO` answer (it may chain a
  locality lookup, `urlCodPostal` `AC_CARGA_LOCALIDADES`) on an owner-authorised
  change. Done when each has one live confirmed run.
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
- [ ] **TGSS debt report PDF path with a real debt.** Unexercised through the
      package. 2026-10-15 `tgss deuda --tipo detallado --out` for 76048463K,
      E10501278 and B22903801 answered "NO SE HA ENCONTRADO DEUDA", and
      E10484822 "SIN DATOS O NO EXISTE CCC/NAF PRINCIPAL": no holder has a TGSS
      debt today. Run it when one does.

## Integrations

- [ ] **sepe: `sepe datos-contacto` (write) for the "Comunicación de variación
      de datos personales" service.** Entry
      `https://sede.sepe.gob.es/PNuevosServiciosSede/pantallas/?servicio=1`,
      reached through the same GetAccess/Cl@ve relay (`loginWithCertificate`
      lands on it). Per the SEPE's own guide (GUIA-USO-COMUNICACION-VARIACION-
      SITUACION.pdf): residence address and identity are read-only there, the
      "datos a efectos de comunicaciones" address and the e-mail are editable,
      and the phone only changes in the holder's Cl@ve account. Not captured: on
      2026-10-11 ~03:10 the page answered "EL SITIO AL QUE INTENTA ACCEDER NO SE
      ENCUENTRA DISPONIBLE" and every certificate service landed on
      `GesUsuariosSEDE/.../error.jsp?errorcode=[TSEG_4003011]` (two different
      holders, so a sede outage). Next step: capture the variation screens in
      working hours, build plan mode first. Pending use: Alba's e-mail to
      albapriieto4@gmail.com (owner: no address change at SEPE for now).
- [~] **sexpe: demanda de empleo (consulta, informes, alta/baja).** Captured
  2026-10-11 (Alba, 78117074N) with the owner solving the CAPTCHA in Orca.
  Protocol: the SNE citizen catalogue
  `https://www.sistemanacionalempleo.es/CartaServiciosCiudadanoWEB/jsp/principal.jsp?CA=11`
  posts `cartaServicios.do` (`itemPrefijoNif=D (DNI)`, `nif`, `claveimagen`,
  `modo=formularioEntrada1`, `CA=11`); the CAPTCHA has no certificate bypass.
  The answer is a menu of `cartaServicios.do?modo=<OP>W3` (user/password) and
  `<OP>W4` (certificate) links: CON1NW4 consulta, INFORW4 informes, RENODW4
  duplicado de tarjeta, REN1HW4 renovación, DAPERW4 datos personales, CASITW4
  alta/baja/suspensión, SEREQW4, MISOFW4, CVEUPW4. A W4 link replayed with curl,
  the client certificate and the CAPTCHA session cookies (`JSESSIONID`,
  `JSESSIONID_empleo_cl`, `TS*`) goes 302 to
  `:444/SeguridadWEB_EMPLEO/seguridadWEB.do?modo=...`, then 302 to
  `:444/ConsultaDemandaWEB/jsp/principal.jsp`, which holds a hidden
  `idDemanda="D  78117074N"` (two spaces); POST
  `:444/ConsultaDemandaWEB/consultaDemanda.do` `idDemanda` +
  `modo=consultaDatos` returns the demand (name, address, occupations,
  situación, causa, colectivo). Without the CAPTCHA session the W4 link answers
  "Error de seguridad: Sus datos de autenticación son incorrectos". The first W4
  replay answered 500 and the second 200; a later CASITW4 from the same Orca
  cookies answered "El perfil de seguridad es inválido o se ha perdido": the
  cause was dropping the `:444` cookies curl had been given, not a one-use
  session. Second capture, same day, with a persistent cookie jar seeded from
  the Orca cookies: one CAPTCHA session served CASITW4 and DAPERW4 in a row.
  Alta de demanda: CASITW4 to
  `:444/CambioSituacionDemandaWEB/cambioSituacionDemanda.do?inicio=true`, POST
  `?modo=altaDemanda` (empty), POST `?modo=altaFijoNoDiscontinuo`
  `estudianteCheck=No`, `trabajdorCheck=No`, `motivoAltaCheck=02` (búsqueda
  activa; 03 servicios previos, 01 ningún servicio), `botonVolver=Confirmar`,
  answering "Su nueva situación administrativa es de Alta"; POST
  `?modo=CambioSituDemandaDarde` returns the DARDE PDF. Datos personales:
  DAPERW4 to
  `:444/ModifDatosPersonalesWEB/modifDatosPersonales.do?modo=notificacion`, POST
  `modo=modificacionDatos&botonNavModDatPersonales=Siguiente` **with a Referer**
  (without it: "Sistema temporalmente no disponible"), giving form
  `modPFWWWform` (48 fields: telefono, telefono_movil, correo_electronico,
  residence) that POSTs to `:444/modPFWWW/modPF.do`. That POST answered a SEPE
  "Error: 3-..." page after redirecting to `?codRetorno=0`, yet reloading the
  form showed the change saved: verify by re-reading, never by the answer. Next:
  `sexpe demanda|alta-demanda|contacto --sesion <cookie header>` commands taking
  the cookies of a CAPTCHA the holder solved. `extremaduratrabaja.juntaex.es`
  and `www.sexpe.es` did not answer on 2026-10-11.
- [ ] **Carpeta Ciudadana: alert groups and address change (plan only).** The
      e-mail alone switches no alert group on (`/api/v3/preferencias-usuario`
      does, not built). The address change service at
      `cambiodomicilio.redsara.es/pcd` is not built: the owner deferred any
      address change at AEAT/DEHU/Carpeta on 2026-10-11 (it fixes where a future
      self-employment counts as located for an aid); build it plan-only when
      that is decided.
- [ ] **AEAT avisos channels write.** `aeat contacto` reads the mobile and
      e-mail of `TOAG-JDIT` (MDAPL); the modification form behind it is not
      mapped. Map it when a holder's channels need changing.
- [ ] **DEHU contact phone.** `dehu contacto` reads `telefono`, but the DEHU
      front offers no field for it (e-mails and push only), so no write is
      built; `v1/contact/<base64 NIF>` accepts PUT/POST, unverified.
- [ ] **dgt: `dgt domicilio` (CDI change of address), plan only so far.** Owner
      has not decided on a new domicile (2026-10-11), so nothing was built. Live
      map: page `/es/servicios-sede/cambio-de-direccion/`, choose
      `radio_direcion=notificacion-nueva`; address fields take ids from
      `service_sadd.jsp` lookups (tipoVia, via, numero, planta, puerta,
      provincia, municipio, localidad, cp). Act: POST `service_cond.jsp`
      `{nifTitular, domicilioNuevo: JSON, tramite: 'CDI', token}` where `token`
      equals cookie `token-tramite-cond` (16 random chars set by JS, 5 s
      expiry), then `service_rele.jsp` (registry, asunto `SCDCB`) for the
      justificante. Write it behind `--confirmar si` when the owner decides.
- [ ] **ses / catastro / clave / inss: contact and domicile readers.** Not
      explored yet (2026-10-11). Cl@ve phone/email change with certificate lives
      under AEAT "Cl@ve > Otras gestiones"; SES contact data is in Centro de
      Salud Online (`ses.es` is not in `isAdministrationHost`); Catastro titular
      domicile via sedecatastro. Email/phone only; addresses wait for the owner.

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
  other five certificates answer. Still 500 on 2026-10-15. Server-side; recheck
  later and, if it persists, try the search per sociedad in the browser to see
  whether the sede itself fails there too.
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

- [ ] **Cáceres general registry: `caceres instancia` on Relec.** Found
      2026-10-15 (read-only): the Cáceres catalogue (`PAGE_CODE=CATALOGO`,
      `dataset_CATSERV`) lists "Instancia general" as `PTS_DEF_S01`, dboid
      `6269000000342016807935`, `application: EREG`. Only `STAWEB` procedures (3
      of 333 in Cáceres) open the `/sta/reg` SPA that `junta presentar` uses
      (`catserv.js` `enterNewReg`); EREG ones post `frame.jsp` into Relec, the
      engine of `caceres aportar`. `Relec/TramitaForm` for that dboid opened
      live with the owner's certificate: the same holder, representative and
      address fields as Aportación, plus `Asunto` (`ANNOT_TEXT_EXTRACT`) and
      `gruposDoc` with eleven document slots, and without the four
      `aportadoc_*`/`referenciaAporDoc` fields. Next: take the procedure id as a
      parameter in `openRelecForm`/`buildFrameForm`, map the asunto and the
      slots, build `caceres instancia` plan-first; the submit stays unverified
      until an owner-authorised filing.
- [~] **`reg presentar`, the first `signAutoScript` consumer, never ran
  confirmed.** 2026-10-15: login, `reg registros`, `reg registro --out` (signed
  justificante downloaded) and `reg organismos` ran live with the owner's
  persona física certificate, and `reg presentar` in plan mode resolved the
  addressee and address codes. The act (upload to `documents/`,
  `registry/?certificate=true`, XAdES detached over `xmlSummary`,
  `registry/signCertificate/:uuid`) is built from the front's bundle, not a
  capture: the create and sign answers, and whether `xmlSummary` is base64 as
  AutoScript requires, are unverified. Scope: own name only (no representation),
  Spanish address, PDFs only. ROLECE, NIC, TGSS and Caceres keep their
  live-verified hand-copied calls on purpose. Next: the first owner-authorised
  REG filing confirms it; save its receipt.
- [~] **Sede flows not re-verified after the XAdES shape change.** ROLECE, the
  STA registry and Relec sign with `signXml` enveloped, which since e3a3197
  emits AutoFirma's layout (XPath transform, DataObjectFormat fields). Unit
  tests and xmlsec1 pass; no live act was repeated. Next: the next real ROLECE
  or STA filing confirms it, or revert that flow's shape.
- [ ] **FACe and valide.redsara.es never tried** (external acts). Next: with the
      owner's go-ahead, validate one synthetic XAdES and one PAdES at
      valide.redsara.es. 2026-10-15: its form (`validarFirmaForm`, multipart
      `fileData`) requires an image CAPTCHA (`codigoSeguridad`), so the owner
      has to solve it in Orca while the files are uploaded.
- [ ] **Multisignature limits:** countersignatures ignore AutoFirma's `target`
      and countersign every top-level signer (nested ones are not
      countersigned); detached and internally detached XAdES cannot be cosigned.
      Next: when a sede sends one.
- [ ] **Minor AutoFirma differences left:** CAdES `contentHint`, MIME sniffing
      (AutoFirma writes `text/plain` where we write `application/octet-stream`),
      and NULL digest parameters. All valid either way. Next: only if a
      validator objects.

## Future Ideas

- [ ] **STA (Cáceres, Junta tramites): read the holder's contact data and padrón
      status.** Evidence 2026-10-11: `PAGE_CODE=DATOS_PERSONALES` on both sedes
      shows "Mis Medios de Contacto" (phone, e-mail, "confirmados") with a
      "Modificar" button, and `PAGE_CODE=DATOS_HABITANTE` on sede.caceres.es
      says "No se encuentra empadronado/a en este municipio" when the holder is
      not inscribed. `caceres datos-contacto` only answers the first-login gate
      and reports "nothing to confirm" afterwards, so it cannot change data
      already saved. Next step: a read command for both pages, then a write for
      "Modificar" (capture its `submitAjax.aa` body) if ever needed.
- [ ] **Cáceres padrón change ("alta por cambio de residencia"): not needed
      now.** The owner dropped it on 2026-10-11. Could be built later on the
      generalRegistryProcedures path (registry entry with DNI and escritura).

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
      the AutoFirma bridge. Needs the Facturae profile and digest items under
      Signing, plus a WS-Security envelope signer.
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
