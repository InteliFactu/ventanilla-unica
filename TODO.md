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

## Documentation

- [~] **Launch after `v0.1.0`.** Listing PR opened 2026-09-26:
  https://github.com/GeiserX/awesome-spain/pull/45. LinkedIn post rewritten for
  the final name and write layer and handed to the owner the same day. Done when
  the PR is merged and the post is published.

## Future Ideas

- [ ] FACe invoice submission. A production pipeline already exists in
      `~/p/wiki/tools/face/` (`face_client.py` SOAP with WS-Security,
      `facturae.py`, XAdES SHA-512 byte-compatible with AutoFirma through
      `afirma_bridge.py`). Port it here with the local XAdES signer rather than
      the AutoFirma bridge.
- [ ] RED SARA REC general registry filing and the Junta STA registry.
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
      message, which would mark it read. Next step: record the HTTP requests
      behind
      `moduloSeleccionado('preparar-acceso-aplicacion','SEGUIMIENTO_EDUCATIVO')`,
      the message list (`COD_PAGINA=20000363`) and
      `cambiaAlumnoDirecto.jsp?alumnoSalto=<id>` with a HAR, then port
      read-only.
