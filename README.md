# ventanilla-unica

[Leer en español](README.es.md)

Command-line client for Spanish public-administration portals, using the
holder's own digital certificate. One binary, one JSON answer per portal. It
reads by default; it also signs PDF and XML locally, and prepares or performs
the acts listed under "Writing" only when you confirm them. Maintained by
[InteliFactu](https://intelifactu.com), which uses it to keep the
administrations' side of its customers' books up to date.

| Command                                                                                                                          | Portal                                                             | What it reads                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica aeat deudas --nif <NIF>`                                                                                       | Agencia Tributaria (AEAT)                                          | Pending debts, their detail, deferral agreements                                                                                                                                                                                                                                                                  |
| `ventanilla-unica aeat expedientes --nif <NIF>`                                                                                  | AEAT                                                               | Mis Expedientes procedures, status, dates and listed acts; excludes separate TEA tribunal proceedings                                                                                                                                                                                                             |
| `ventanilla-unica aeat pagos --nif <NIF> [--out d]`                                                                              | AEAT                                                               | Every payment made (MisPagos) with its NRC, and the receipt PDFs                                                                                                                                                                                                                                                  |
| `ventanilla-unica aeat declaraciones --nif <NIF> --modelo m --ejercicio y [--periodo p] [--out d]`                               | AEAT                                                               | Declarations the certificate's holder filed for one modelo and year (another --nif is refused), the CSV of each receipt, the PDFs                                                                                                                                                                                 |
| `ventanilla-unica aeat informativas --nif <NIF> --modelo m --ejercicio y [--out d]`                                              | AEAT                                                               | Informative returns filed (190, 347, 349...) from 2020 on, with their CSV and PDFs                                                                                                                                                                                                                                |
| `ventanilla-unica aeat borrador-autoliquidacion --fichero f.txt [--out d]`                                                       | AEAT, open simulator (no login)                                    | Imports a 303 presentation file into the simulator of its exercise: the import's errors and avisos and, with --out, the official form filled in as a watermarked draft. It cannot present                                                                                                                         |
| `ventanilla-unica aeat certificado-censal --nif <NIF> --nombre "<name>" [--out d]`                                               | AEAT                                                               | The "certificado de situacion censal" (emits it; the same day answers the cached CSV)                                                                                                                                                                                                                             |
| `ventanilla-unica aeat certificado-corriente --nif <NIF> [--finalidad contratacion\|subvenciones\|generico] [--out d]`           | AEAT                                                               | The "certificado de estar al corriente de obligaciones tributarias", default for public-sector contracts; `positive` says POSITIVO or NEGATIVO (emits it)                                                                                                                                                         |
| `ventanilla-unica aeat contacto --nif <NIF>`                                                                                     | AEAT                                                               | The holder's avisos channels (mobile, e-mail, state) and the domicilio fiscal and de notificación as "Mis datos censales" shows them                                                                                                                                                                              |
| `ventanilla-unica aeat cotejo --csv C --out dir [--nif N]`                                                                       | AEAT                                                               | Saves the PDF an Agencia Tributaria CSV verifies (Cotejo de documentos), such as a notification or a diligencia de embargo; read-only, it opens no notification                                                                                                                                                   |
| `ventanilla-unica aeat apoderamientos --nif <NIF> [--tipo otorgados\|recibidos]`                                                 | AEAT                                                               | The Registro de apoderamientos: powers the holder granted (default) or received, each row under the column labels the page prints; lists only, never revokes or extends                                                                                                                                           |
| `ventanilla-unica tgss deuda --nif <NIF> [--tipo detallado\|total] [--out d]`                                                    | Tesorería General de la Seguridad Social (TGSS)                    | The "informe de deuda" detailed or total (emits it; counts against the daily cap)                                                                                                                                                                                                                                 |
| `ventanilla-unica tgss corriente --nif <NIF> --tipo generico\|licitacion\|subvenciones\|articulo-42 [--entidad <NIF>] [--out d]` | TGSS                                                               | A "certificado de estar al corriente" (emits it; counts against the daily cap)                                                                                                                                                                                                                                    |
| `ventanilla-unica tgss vida-laboral --desde DD/MM/AAAA [--hasta DD/MM/AAAA] [--out d]`                                           | TGSS                                                               | The "informe de vida laboral acotado" for a date range (emits it)                                                                                                                                                                                                                                                 |
| `ventanilla-unica tgss situacion [--out d]`                                                                                      | TGSS                                                               | The "informe de situación actual del trabajador" (emits it)                                                                                                                                                                                                                                                       |
| `ventanilla-unica tgss nss [--out d]`                                                                                            | TGSS                                                               | The "informe del número de la Seguridad Social" (emits it)                                                                                                                                                                                                                                                        |
| `ventanilla-unica tgss datos [--out d]`                                                                                          | TGSS                                                               | The "informe de datos identificativos y de domicilio" (emits it)                                                                                                                                                                                                                                                  |
| `ventanilla-unica tgss datos-personales`                                                                                         | TGSS (Importass)                                                   | Identity, phones, e-mail and domicile the Seguridad Social holds, from "Tus datos personales"                                                                                                                                                                                                                     |
| `ventanilla-unica tgss actividades [--out dir]`                                                                                  | TGSS (Importass)                                                   | The informe de actividades de trabajo autónomo: every activity communicated to the Seguridad Social with the company and role it is tied to (RD 504/2022); read-only, the PDF with --out                                                                                                                          |
| `ventanilla-unica tgss alta --fecha DD/MM/AAAA [--out d]`                                                                        | TGSS                                                               | The "informe de alta laboral a fecha concreta" (emits it)                                                                                                                                                                                                                                                         |
| `ventanilla-unica tgss empresario [--out d]`                                                                                     | TGSS                                                               | The "informe negativo de inscripción de empresario" (emits it)                                                                                                                                                                                                                                                    |
| `ventanilla-unica tgss ccc`                                                                                                      | TGSS                                                               | The holder's cuentas de cotización with their situation (alta/baja, date) and RED authorisation (RETC0001)                                                                                                                                                                                                        |
| `ventanilla-unica tgss autorizado-naf`                                                                                           | TGSS                                                               | The Sistema RED authorisation managing the holder's NAF now (`NO AS.` when none) and the ones that managed it before, with their dates (RETC0002)                                                                                                                                                                 |
| `ventanilla-unica ine encuestas`                                                                                                 | INE (IRIA, iria.ine.es)                                            | The statistical surveys assigned to the IRIA account of the certificate's NIF, with the sampled unit and whether questionnaires are pending                                                                                                                                                                       |
| `ventanilla-unica tgss bases [--ejercicio y] [--out d]`                                                                          | TGSS                                                               | The "informe de bases y cuotas ingresadas" for one year, with the monthly rows per régimen (emits it)                                                                                                                                                                                                             |
| `ventanilla-unica dehu list [--state s] [--year y]`                                                                              | Dirección Electrónica Habilitada única (DEHU)                      | Pending and realized notifications, without opening any                                                                                                                                                                                                                                                           |
| `ventanilla-unica dehu documentos --out d [--year y] [--id a,b]`                                                                 | DEHU                                                               | The document and voucher of notifications already realized (none is opened)                                                                                                                                                                                                                                       |
| `ventanilla-unica dehu contacto`                                                                                                 | DEHU                                                               | The e-mails (and whether each is confirmed), phone and notice hours DEHU uses for its avisos                                                                                                                                                                                                                      |
| `ventanilla-unica carpeta avisos`                                                                                                | Carpeta Ciudadana del Estado (carpetaciudadana.gob.es)             | The alert e-mail, whether it is verified, and which alert groups are active                                                                                                                                                                                                                                       |
| `ventanilla-unica oargt recibos [--include paid] [--importes hoy]`                                                               | OARGT, Diputación de Cáceres                                       | Receipts in voluntary and enforced collection, with today's amount per enforced receipt on `--importes`                                                                                                                                                                                                           |
| `ventanilla-unica oargt liquidaciones`                                                                                           | OARGT Cáceres                                                      | Whether the holder has liquidations ("Mis liquidaciones"), own or as representative; refuses, reading nothing, when the list has rows, whose layout is not captured yet                                                                                                                                           |
| `ventanilla-unica tea expedientes --nif <nif>`                                                                                   | Tribunales Económico-Administrativos (sede.tea.hacienda.gob.es)    | Whether the Tribunales Económico-Administrativos hold a case for the certificate holder; refuses, reading nothing, when the list has rows, whose layout is not captured yet                                                                                                                                       |
| `ventanilla-unica rayuela hijos`                                                                                                 | Rayuela (Educarex)                                                 | Read children using password login; no certificate                                                                                                                                                                                                                                                                |
| `ventanilla-unica rayuela mensajes`                                                                                              | Rayuela (Educarex)                                                 | Read messages using password login; no certificate                                                                                                                                                                                                                                                                |
| `ventanilla-unica rayuela horario [--hijo <name or id>]`                                                                         | Rayuela (Educarex)                                                 | Read timetable using password login; no certificate                                                                                                                                                                                                                                                               |
| `ventanilla-unica rayuela faltas [--hijo <name or id>]`                                                                          | Rayuela (Educarex)                                                 | Read absences using password login; no certificate                                                                                                                                                                                                                                                                |
| `ventanilla-unica rayuela profesorado [--hijo <name or id>]`                                                                     | Rayuela (Educarex)                                                 | Read teachers using password login; no certificate                                                                                                                                                                                                                                                                |
| `ventanilla-unica junta expedientes`                                                                                             | Junta de Extremadura, sede asociada (tramites.juntaex.es)          | Open and archived expedientes                                                                                                                                                                                                                                                                                     |
| `ventanilla-unica junta notificaciones`                                                                                          | Junta de Extremadura                                               | Pending, accepted and rejected notifications, as interested party and as representative, without opening any                                                                                                                                                                                                      |
| `ventanilla-unica junta registros`                                                                                               | Junta de Extremadura                                               | Registry entries filed by the holder or on their behalf                                                                                                                                                                                                                                                           |
| `ventanilla-unica junta datos-personales`                                                                                        | Junta de Extremadura                                               | The phone and e-mail the sede holds and whether it shows them as confirmed (until they are, it hides the identity data); Modificar and Sí/No are never pressed                                                                                                                                                    |
| `ventanilla-unica junta justificante --csv C --nif N --registro n --out d`                                                       | Junta de Extremadura                                               | Saves the justificante PDF of a registry entry                                                                                                                                                                                                                                                                    |
| `ventanilla-unica junta deudas`                                                                                                  | Junta de Extremadura, Carpeta Ciudadana (sede.gobex.es, via Cl@ve) | Debts with the Junta and how many are pending                                                                                                                                                                                                                                                                     |
| `ventanilla-unica junta tasas`                                                                                                   | Junta de Extremadura, Carpeta Ciudadana                            | Paid fees (modelo 050) and fee incidents                                                                                                                                                                                                                                                                          |
| `ventanilla-unica junta pagos [--ejercicio a]`                                                                                   | Junta de Extremadura, Carpeta Ciudadana                            | Payments the Junta made to the holder in a year, and third-party incidents such as set-offs                                                                                                                                                                                                                       |
| `ventanilla-unica junta carpeta-expedientes [--desde d] [--hasta d]`                                                             | Junta de Extremadura, Carpeta Ciudadana                            | Expedientes started in a date range (default the last 365 days), swept 30 days at a time as the sede requires                                                                                                                                                                                                     |
| `ventanilla-unica junta carpeta-notificaciones`                                                                                  | Junta de Extremadura, Carpeta Ciudadana                            | Notifications in every state, without opening any                                                                                                                                                                                                                                                                 |
| `ventanilla-unica junta carpeta-descargar --id <n> --out d`                                                                      | Junta de Extremadura, Carpeta Ciudadana                            | The PDF of a notification already accepted ("Notificado"), and the acuse when the sede serves it; refuses a pending one                                                                                                                                                                                           |
| `ventanilla-unica junta documentos`                                                                                              | Junta de Extremadura, Carpeta Ciudadana                            | Documents filed with the Junta ("Mis documentos")                                                                                                                                                                                                                                                                 |
| `ventanilla-unica junta representados`                                                                                           | Junta de Extremadura, Carpeta Ciudadana                            | Expedientes handled through a representative                                                                                                                                                                                                                                                                      |
| `ventanilla-unica caceres expedientes`                                                                                           | Ayuntamiento de Cáceres (sede.caceres.es)                          | Open and archived expedientes                                                                                                                                                                                                                                                                                     |
| `ventanilla-unica caceres notificaciones`                                                                                        | Ayuntamiento de Cáceres                                            | Pending, accepted and rejected notifications, without opening any                                                                                                                                                                                                                                                 |
| `ventanilla-unica caceres registros`                                                                                             | Ayuntamiento de Cáceres                                            | Registry entries filed by the holder or on their behalf                                                                                                                                                                                                                                                           |
| `ventanilla-unica caceres procedimiento --dboid ID`                                                                              | Ayuntamiento de Cáceres                                            | What a catalogue procedure's Relec form asks for ("Solicito" fields and document rows, with type and whether required), without filing; e.g. `6269000000342016807935` is "Instancia general"                                                                                                                      |
| `ventanilla-unica caceres datos-personales`                                                                                      | Ayuntamiento de Cáceres                                            | The phone and e-mail the sede holds and whether they are confirmed, with the name, NIF, address and other addresses; Modificar is never pressed                                                                                                                                                                   |
| `ventanilla-unica caceres padron`                                                                                                | Ayuntamiento de Cáceres                                            | The holder's padrón entry: alta date, address, birth, education, census district and section, and the people registered at the same address; `registered: false` when the sede says they are not inscribed                                                                                                        |
| `ventanilla-unica sepe prestacion`                                                                                               | Servicio Público de Empleo Estatal (SEPE)                          | The last unemployment benefit: dates, days of right, consumed and remaining                                                                                                                                                                                                                                       |
| `ventanilla-unica sepe certificado --out d`                                                                                      | SEPE                                                               | The "certificado de situacion" of benefits as PDF (emits it)                                                                                                                                                                                                                                                      |
| `ventanilla-unica sepe garantia-juvenil [--out d]`                                                                               | SEPE, Sistema Nacional de Garantía Juvenil                         | Registration status and date, offered certificate PDFs, or the inscription form fields and options                                                                                                                                                                                                                |
| `ventanilla-unica dgt datos --nif <NIF>`                                                                                         | Dirección General de Tráfico (DGT)                                 | What the DGT holds about the holder: identity, the postal address it notifies to (taken from the INE padrón unless changed), the email and phone it has, and the Mi DGT counters (vehicles, sanctions, points, licences, registry entries, appointments)                                                          |
| `ventanilla-unica dgt sanciones [--out d]`                                                                                       | DGT                                                                | The holder's fines in "Mis sanciones" (finished ones stay listed six months): expediente, state, date, province, amount, and the detail page (offence, article, paid); `--out` saves each "Datos de Expediente" PDF                                                                                               |
| `ventanilla-unica dgt vehiculos`                                                                                                 | DGT                                                                | The vehicles registered to the holder in Mi DGT ("Mis vehículos"): plate, first registration, make, model and fuel                                                                                                                                                                                                |
| `ventanilla-unica justicia expedientes`                                                                                          | Carpeta Justicia (Ministerio de Justicia)                          | The holder's judicial expedientes as the Carpeta Justicia lists them: procedimiento, órgano, estado and its date, NIG, with the index the next command takes                                                                                                                                                      |
| `ventanilla-unica justicia documentos --expediente <index> [--out dir]`                                                          | Carpeta Justicia (Atenea IRIS)                                     | Every document of one expediente from the Atenea IRIS visor (writs, resolutions, notifications and their LexNET receipts), each downloaded with `--out`; one it refuses keeps its `error`. Downloads are logged as consultations; it accepts no notification. It refuses expedientes the holder is not a party to |
| `ventanilla-unica cirbe informe --nacimiento DD-MM-AAAA --email e`                                                               | Banco de España (CIRBE)                                            | Requests your own risk report (emits it)                                                                                                                                                                                                                                                                          |
| `ventanilla-unica cirbe estado [--out d]`                                                                                        | CIRBE                                                              | Lists your report requests and downloads the ready PDFs                                                                                                                                                                                                                                                           |
| `ventanilla-unica rolece estado --nif <NIF>`                                                                                     | Registro Oficial de Licitadores (ROLECE)                           | Whether the company is inscribed (certificate search) and, if not, whether it is due for an initial application                                                                                                                                                                                                   |
| `ventanilla-unica placsp estado --email e`                                                                                       | Plataforma de Contratación del Sector Público (PLACSP)             | Whether an e-mail already has an operator account (availability check; creates nothing)                                                                                                                                                                                                                           |
| `ventanilla-unica reg registros [--pagina n]`                                                                                    | Registro Electrónico General (REG, formerly REC)                   | The holder's entries, ten per page, newest first: number, date, addressee, subject, status, uuid                                                                                                                                                                                                                  |
| `ventanilla-unica reg registro --uuid u [--out d]`                                                                               | REG                                                                | One entry: data, documents and SIR exchange trace; downloads every document, the signed justificante included                                                                                                                                                                                                     |
| `ventanilla-unica reg organismos --buscar texto`                                                                                 | REG                                                                | DIR3 units an entry can be addressed to, with the code `reg presentar --organismo` takes                                                                                                                                                                                                                          |

## Writing

Commands marked write act at the administration. Without `--confirmar si` they
run only the read-only preparation (session, lists, validation) and print the
plan: every request they would send, with its values. With `--confirmar si` they
perform it and return the portal's receipt. Each one refuses before the act when
anything does not match what the plan read (holder, amount, document).

| Command                                                                                                                                                                                                                    | Portal                                            | Act                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica aeat comparecer --nif <NIF> --id <n> [--out d]`                                                                                                                                                          | AEAT                                              | Appears at a notification in the AEAT's own sede; legal deadlines start that day                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `ventanilla-unica aeat carta-pago --nif <NIF> --clave K --importe n,nn [--out d]`                                                                                                                                          | AEAT                                              | Generates a partial payment letter (modelo 010); paying is a separate step at the bank                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ventanilla-unica aeat pagar --nif <NIF> --modelo 010 --justificante J --importe n,nn --iban ES... [--nombre n] [--out d]`                                                                                                 | AEAT                                              | Pays a liquidación (modelo 002, 004, 008, 010, 031, 032, 060, 061, 069) by debit to an account at a collaborating bank and returns the NRC; confirmed, the debt is paid and the charge cannot be undone                                                                                                                                                                                                                                                                                                           |
| `ventanilla-unica aeat domicilio --nif <NIF> --codigo-postal ... --via ... [...]`                                                                                                                                          | AEAT                                              | Files a modelo 036 change of tax address (legal entities)                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `ventanilla-unica aeat actividades --nif <NIF> --actividades 'tipo;seccion;epigrafe;descripcion\|...' --fecha DD/MM/AAAA --provincia --municipio --lugar --firmado [--calidad Interesado] [--validar si] [--confirmar si]` | AEAT                                              | Modelo 036 casilla 127: alta of economic activities outside a fixed premises (page 4), with the values of the AEAT activity finder; `--validar si` fills it and runs the AEAT validation without filing (write)                                                                                                                                                                                                                                                                                                   |
| `ventanilla-unica aeat baja --nif E... --causa disolucion\|otras --fecha DD/MM/AAAA --sucesores 'NIF;Nombre;%;cuota\|...' --lugar --firmado --calidad [--validar si] [--confirmar si]`                                     | AEAT                                              | Modelo 036 baja en el censo (150-152, page 13 sucesores) of an entity; `--validar si` fills it and runs the AEAT validation without filing (write)                                                                                                                                                                                                                                                                                                                                                                |
| `ventanilla-unica aeat aportar --csv <CSV> --como interesado\|representante --asunto ... --telefono ... --documentos a.pdf,b.pdf [--tipos 203,200]`                                                                        | AEAT                                              | Files documents (alegaciones, a reply to a requerimiento) at the AEAT registry against the CSV of the notification they answer, as interesado or representative; confirmed, it counts as presented today                                                                                                                                                                                                                                                                                                          |
| `ventanilla-unica aeat informativa --fichero f.txt [--periodo 0A]`                                                                                                                                                         | AEAT                                              | Presents an informative return file (190, 347, 180...) through TGVI Online for its declarant, switching to representation when needed; unconfirmed it validates every record at the AEAT and lists the failures; confirmed it refuses any failing record and presents with the firma básica                                                                                                                                                                                                                       |
| `ventanilla-unica junta presentar --destino DIR3 --telefono t --asunto s --documentos a.pdf,b.pdf [--out d]`                                                                                                               | Junta                                             | Files a writ in the Registro Electrónico General in the holder's own name: uploads the PDFs, signs the registry form (XAdES, no AutoFirma) and saves the justificante                                                                                                                                                                                                                                                                                                                                             |
| `ventanilla-unica junta aportar --expediente AÑO/NUMERO --documentos a.pdf,b.pdf [--descripciones 'd1\|d2'] [--informacion t] [--out d]`                                                                                   | Junta                                             | Contributes documents to an open expediente ("Aporte documentación", registered as documentación complementaria to the unit handling it); with a representative certificate it files for the represented entity, as the sede's own form does                                                                                                                                                                                                                                                                      |
| `ventanilla-unica caceres datos-contacto --correo m [--telefono t]`                                                                                                                                                        | Cáceres                                           | Answers the sede's contact-data gate (CONFIRMACION_DATOS_PERSONALES) a certificate meets on its first login: saves the e-mail and phone, says they are right and accepts the identification data, then checks the session opens                                                                                                                                                                                                                                                                                   |
| `ventanilla-unica oargt datos-contacto --correo m [--telefono t]`                                                                                                                                                          | OARGT Cáceres (sede.oargt.es)                     | Answers the OARGT sede contact-data gate: saves --correo/--telefono when the sede holds none, otherwise only presses "Sí"; plan only without `--confirmar si`                                                                                                                                                                                                                                                                                                                                                     |
| `ventanilla-unica caceres aportar --referencia AÑO/NUMERO\|ENT... --documentos a.pdf,b.pdf --tipos DECL,ALTER --descripciones 'd1\|d2' [--informacion t] [--correo m] [--telefono t] [--out d]`                            | Cáceres                                           | Contributes documents to an expediente or registry entry ("Aportación de documentación", the sede's Relec form) as representative of the entity the certificate represents: uploads each PDF and signs it PAdES, signs the registry form XAdES (no AutoFirma), registers it and saves the justificante. `--tipos` takes the sede's type codes (DECL, ALTER, CERTI, OTROE, FIAN, CAPA, JUST...); e-mail and phone default to the form's prefilled contact. Confirmed, it counts as presented that day              |
| `ventanilla-unica caceres instancia --asunto s --documentos a.pdf,b.pdf --filas 'Instancia General\|Otros documentos de entrada' [--representado NIF] [--correo m] [--telefono t]`                                         | Cáceres                                           | Plans an "Instancia general" (the sede's Relec form): checks the PDFs, logs in, opens the form and maps each PDF to a form row by name or DocReq id (see `caceres procedimiento`), naming the required rows left empty ("Instancia General Mod-201"). Plan only: `--confirmar si` refuses until the submission is captured                                                                                                                                                                                        |
| `ventanilla-unica caceres tramite --dboid ID --asunto text --documentos a.pdf,b.pdf --slots slotDboid,slotName [--correo m] [--telefono t] [--out d]`                                                                      | Cáceres                                           | Files a catalogue Relec procedure in the certificate holder's own name, with one PDF per slot. Plans by default; `--confirmar si` uploads and signs the PDFs and form, registers the filing, and saves the justificante and JSON receipt with `--out`.                                                                                                                                                                                                                                                            |
| `ventanilla-unica junta carpeta-comparecer --id <n> [--out d]`                                                                                                                                                             | Junta                                             | Accepts a pending notification in the Carpeta Ciudadana (the sede signs the acuse itself); it counts as notified that day and its legal deadlines start. An already accepted one is only downloaded                                                                                                                                                                                                                                                                                                               |
| `ventanilla-unica dehu comparecer --id a,b [--out d]`                                                                                                                                                                      | DEHU                                              | Appears at pending DEHU notifications (a second Cl@ve re-authentication, then the acceptance); each counts as notified that day and its legal deadlines start. With `--out` it saves the act and the acuse                                                                                                                                                                                                                                                                                                        |
| `ventanilla-unica ine asignar --orden 1005484700I --clave x [--aviso-correo si]`                                                                                                                                           | INE                                               | Assigns the survey of an INE letter (nº de orden and contraseña) to the certificate's IRIA account, optionally with an e-mail notice when each questionnaire opens                                                                                                                                                                                                                                                                                                                                                |
| `ventanilla-unica carpeta email --email e`                                                                                                                                                                                 | Carpeta Ciudadana                                 | Stores the alert e-mail in the holder's Carpeta Ciudadana preferences and makes the Carpeta mail a verification link to it (valid three days); replaces the previous alert e-mail. No alert group is switched on                                                                                                                                                                                                                                                                                                  |
| `ventanilla-unica carpeta confirmar-email --enlace <url or hashToken>`                                                                                                                                                     | Carpeta Ciudadana                                 | Opens the verification link that `carpeta email` made the Carpeta send, which marks the alert e-mail as verified                                                                                                                                                                                                                                                                                                                                                                                                  |
| `ventanilla-unica dehu quitar-email --email e`                                                                                                                                                                             | DEHU                                              | Removes one address from the e-mails DEHU mails its notices of new notifications to, after a Cl@ve re-authentication with the certificate; the remaining addresses keep their confirmation state. DEHU stops warning that address about new notifications; the notifications themselves and their deadlines do not change. Refuses to remove the last notice channel                                                                                                                                              |
| `ventanilla-unica tgss aplazamiento --nif <NIF> --plazos n --garantia exenta --documento f.pdf`                                                                                                                            | TGSS                                              | Requests a deferral (XV207A01). Plan only for now: the signing exchange is not captured yet                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `ventanilla-unica tgss adjuntar --expediente n --documento f.pdf --tipo t`                                                                                                                                                 | TGSS                                              | Attaches a document to an expediente. Plan only for now, same reason                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `ventanilla-unica tgss contacto --movil n --correo m [--fijo n]`                                                                                                                                                           | TGSS                                              | Changes the mobile, e-mail and landline Importass holds ("Modificar datos de contacto"). Legal effect: the Seguridad Social sends its notices and SMS codes to them. Posts nothing when the page already holds the values, and reads the page again to prove the change                                                                                                                                                                                                                                           |
| `ventanilla-unica tgss domicilio --tipo-via PZ --via v --numero n [--piso p --puerta d] --codigo-postal c --localidad l`                                                                                                   | TGSS                                              | Plan only: shows the domicile Importass holds and the "Modificar domicilio" form it would post. The save is not captured, so `--confirmar si` is refused before any request                                                                                                                                                                                                                                                                                                                                       |
| `ventanilla-unica rolece solicitud --nif <NIF> --comunidad c --provincia p --email e --out d`                                                                                                                              | ROLECE                                            | Files the initial inscription (Solicitud Simplificada): signs the application XML as AutoFirma would (XAdES enveloped) and saves the acuse de recibo and the justificante ZIP                                                                                                                                                                                                                                                                                                                                     |
| `ventanilla-unica placsp pregunta --expediente <link\|idEvl> --texto-file f.txt`                                                                                                                                           | PLACSP                                            | Asks the contracting body a question about a published tender. Plan only for now: needs an operator account and the logged-in form                                                                                                                                                                                                                                                                                                                                                                                |
| `ventanilla-unica dgsfp reclamacion --entidad e --nif-entidad NIF --email m --direccion d --provincia p --municipio m --cp n --escrito f.pdf --sac f.pdf --declaro-no-litigio si [--out d]`                                | DGSFP                                             | Files a complaint against an insurer or insurance distributor (TEL43) in the holder's own name: Cl@ve certificate login, uploads, the request document signed locally (PAdES), and saves the justificante with registry number and CSV                                                                                                                                                                                                                                                                            |
| `ventanilla-unica nic correo --identificador 1727AF1-ESNIC-F5 --email m`                                                                                                                                                   | Red.es                                            | Asks Red.es (nic.es) to change an ES-NIC contact's email, signed as implicit CAdES with the certificate. Legal effect: the registry, once it approves, sends that contact's password resets and transfer acceptances to the new address. Refuses legal-person contacts, which also need NIF and powers                                                                                                                                                                                                            |
| `ventanilla-unica registradores nota --nif <NIF> --email m --telefono t [--direccion d --codigo-postal n] [--municipio m] [--segmentos administradores,capital,actos,libros] [--irpf si\|no] [--out d]`                    | Colegio de Registradores (sede.registradores.org) | Orders a company's nota informativa mercantil as its representative: the plan finds the company (IRUS, registry, whether its accounts deposit is available) and prints the identification it would post, taking the representative from the certificate and the province from the sede; confirmed, it posts the identification (which creates the order), chooses card payment and prints the hosted checkout URL, with `--out` a page that opens it. It never pays; once paid, the nota is e-mailed to `--email` |
| `ventanilla-unica reg presentar --organismo DIR3 --asunto a --expone e --solicita s --documentos a.pdf,b.pdf --tipo-via t --via v --cp n --provincia p --municipio m [--email m] [--telefono t] [--out d]`                 | REG                                               | Files a writ with up to five PDFs to any DIR3 unit in the holder's own name: Cl@ve certificate login, uploads, the entry summary signed locally as AutoFirma does (XAdES detached, SHA-512), and saves the justificante. Legal effect: a registry entry at the addressee with the presentation date and time the REG stamps                                                                                                                                                                                       |
| `ventanilla-unica dgt contacto --nif <NIF> --correo m --telefono t`                                                                                                                                                        | DGT                                               | Registers or changes the holder's email and phone in Mi DGT ("Mis datos de contacto y suscripciones"), which subscribes them to the DGT's avisos service; the DGT then uses them for its communications, never for sanctions or notifications, which keep going to the DEV and the postal address. The postal address is not touched. Reads the data back and refuses if it does not match                                                                                                                        |
| `ventanilla-unica dgt domicilio --nif <NIF> --tipo-via t --via v --numero n [--planta p --puerta d] --codigo-postal c --municipio m --provincia p [--localidad l]`                                                         | DGT                                               | Plan only: shows the address the DGT notifies to by post and the Cambio de domicilio (CDI) requests that would change it. The address lookups and the act are not captured, so `--confirmar si` is refused before any request                                                                                                                                                                                                                                                                                     |

### Paying a liquidación by account debit

`aeat pagar` drives the sede's "Liquidaciones/Deudas - Pago mediante cargo en
cuenta" (`OVPP-PAGO/LiquidacionesCuenta`). Without `--confirmar si` it checks
the options offline (NIF, modelo, a 13-character justificante, an amount above
zero, the IBAN checksum and its CCC control digits), reads the list of adhered
banks, and posts the form's first step, which only validates: the AEAT answers
the summary page or its errors (a justificante whose control letter does not
match the amount, a bank field in a wrong format). For the certificate's own NIF
it also reads MisPagos, because the form does not refuse a justificante that is
already paid; for any other NIF it says it could not check. The plan shows the
census name the AEAT put on the payment (`titular`).

With `--confirmar si` it presses "Firmar y Enviar": the AEAT orders the bank to
debit the amount, the debt is paid, and the answer carries the NRC, which the
command returns; with `--out` it saves the receipt PDF (`aeat-pago-<NRC>.pdf`).
There is no separate signature: the client certificate of the session signs the
order. The certificate holder must hold the account. An error page is reported
as an error, and an answer with neither an NRC nor an error (or none) is
reported as unknown: check `aeat pagos` before trying again, since a second run
would charge twice.

## Cáceres catalogue filings

`caceres tramite` files a catalogue procedure in the certificate holder's own
name. Find its procedure ID and document slots with
`caceres procedimiento --dboid ID`. Set `PROCEDURE_DBOID` to that ID, `SUBJECT`
to the requested Asunto, `PDF_PATHS` to comma-separated PDF paths and `SLOT_IDS`
to the corresponding comma-separated slot IDs. With the certificate environment
variables configured, run this plan from a built checkout:

```sh
node dist/cli/main.js caceres tramite --dboid "$PROCEDURE_DBOID" --asunto "$SUBJECT" --documentos "$PDF_PATHS" --slots "$SLOT_IDS"
```

Each slot accepts exactly one PDF. `--slots` also accepts exact,
case-insensitive slot names; use IDs when a name contains a comma or is
ambiguous. Every required slot must be covered, and optional slots may be
omitted. The command checks PDF content, size, SHA-256 and local PAdES
compatibility, logs in, opens the form and reads the holder's contact defaults.
Unknown slots, duplicate assignments, missing required slots and unsupported
uploaders are rejected before uploading. `--correo` and `--telefono` override
the defaults; confirmation requires an email for electronic notification. The
Asunto is limited to 2500 characters and goes in `DinVarANNOT_TEXT_EXTRACT`. A
procedure must expose that field and signed PDF upload slots.

Without `--confirmar si`, the command returns `executed: false` and prints the
filing plan. Even with `--out`, it uploads nothing, sends no signing or
registration request, and creates no output directory. Adding
`--confirmar si --out ./caceres-receipt` uploads each PDF to its selected slot,
signs it locally as PAdES, signs the registry form locally as XAdES and sends
`TramitaJustif`. That final request files the procedure in the holder's name
with electronic notification. The command offers no representation option.

With `--out`, successful submissions save
`justificante-<registry-number-or-CSV>.pdf` and `aportacion-<CSV>.json`, using
the same receipt writer as `caceres aportar`. The JSON contains the receipt and
the reviewed filing, including document hashes and slot IDs. A failed download
or save is reported alongside the executed receipt. The command never retries a
submission; inspect `caceres registros` before repeating a run after a timeout
or an uncertain response.

The shared submission pipeline also serves `caceres aportar`; catalogue uploads
use the selected slot's DocReq ID and the holder's person ID, preserving the
form's fixed `pid`, `CUD`, type and required metadata. The contact script must
be read after opening the form in the same session. `caceres instancia` retains
its existing plan-only behavior.

Verification: `pnpm check:ci` covers the confirmation boundary, slot validation,
signed uploads, own-name form body, shared contribution behavior and receipt
saving with synthetic responses. The padrón alta procedure has been checked live
only in plan mode. Live acceptance of a confirmed catalogue filing and its
actual justificante remain unverified; other procedure-specific fields beyond
Asunto are not configurable through this command.

## Garantía Juvenil

`sepe garantia-juvenil` reads the certificate holder's record at
`https://garantiajuvenil.sepe.es`. It uses the young person's certificate
through the site's Cl@ve certificate option, rather than the separate SEPE
benefits service.

```sh
ventanilla-unica sepe garantia-juvenil --out ./garantia-juvenil-documents
```

The JSON contains `inscribed`, `state`, `registrationDate`, `evidence`,
`documents` and `form`. An explicit record can report `alta`, `baja` or
`pendiente`; `inscribed: true` includes a historical inscription now in `baja`.
A pending application has `inscribed: null`. A new, unconsolidated inscription
wizard with no history reports `inscribed: false`, `state: "not-inscribed"` and
no registration date. Unrecognized pages or conflicting history report
`unknown`, never an invented negative result.

For an unregistered holder, `form` lists the six pages: responsible
declarations, personal and contact details, education, work experience,
interests, and data protection. Each field has its portal `name`, label, type,
required marker, read-only marker and offered options. Prefilled personal
values, CSRF tokens and cookies are excluded. Options reflect the initial GET
pages; dependent choices may require another selection. No form answers are
saved or remotely validated during READ or plan mode.

`--out` downloads offered certificate or justificante links as
`sepe-garantia-juvenil-1.pdf`, and subsequent numbered files, using private
permissions. Existing files are preserved; use a fresh directory for another
download. A document must be a same-origin PDF download: generation buttons,
JavaScript-only downloads and redirects are not invoked. An empty `documents`
list means that the returned page offered no supported download.

### Inscription plans and submission

Add `--inscribir si` to request the inscription action. Without
`--confirmar si`, the command returns the standard WRITE result with
`executed: false`, the current read result, a plan and notes. This empty plan is
runnable before choosing answers:

```sh
ventanilla-unica sepe garantia-juvenil --inscribir si --respuestas '{}'
```

Pass declared answers through `--respuestas` as a JSON object keyed by step
number (`"1"` to `"6"`), then by the exact control names returned in `form`. All
values are strings: use the offered option codes, `"true"` for checked
declarations and `"false"` for unchecked checkboxes. Only offered editable
controls are accepted; callers cannot override hidden tokens, action buttons or
`pinSMS` (the code comes exclusively from the verification file). Do not infer
answers from eligibility assumptions.

Step 1 requires the holder to explicitly declare these five controls as
`"true"`: `situacionSolicitante.checkCompromisoEstudiosN`,
`situacionSolicitante.checkCompromisoFormacionN`,
`situacionSolicitante.checkEmpadronamientoN`,
`situacionSolicitante.checkResponsabilidadN` and
`situacionSolicitante.checkNeetN`. These declare no educational or training
activity on the preceding calendar day, registration as resident in Spain,
truthful information and an active participation commitment. Step 6 requires
`checkLOPD: "true"`; optional consent uses the separately offered
`checkConsentimiento`. Personal, contact, address, education and other answers
must come from the holder and use the fields and codes offered in that session.

Step-2 municipality controls accept a name such as `"CACERES"` with province
`"10"`, or an offered municipality ID. This applies to
`datosDireccionDomicilio.tcodMunicipio`, `datosDireccionContacto.tcodMunicipio`
and `datosContacto.notificaApartadoCorreos.tcodMunicipio`; each needs its
matching `.tcodProvincia`. A confirmed write POSTs JSON `{"idProvincia":"10"}`
to `/cargarMunicipios.action` and resolves `listadoMunicipios[].denominacionC`
to `idMunicipioC`. Name matching ignores case, accents and surrounding
whitespace. Missing or ambiguous matches stop the inscription. Plan mode accepts
these names locally and does not call the AJAX endpoint.

This is the answers shape, with synthetic contact details. Add every other
required control from the six GET pages using the holder's reviewed answers;
empty objects below illustrate the step keys and do not supply education, work
or interest answers:

```json
{
  "1": {
    "situacionSolicitante.checkCompromisoEstudiosN": "true",
    "situacionSolicitante.checkCompromisoFormacionN": "true",
    "situacionSolicitante.checkEmpadronamientoN": "true",
    "situacionSolicitante.checkResponsabilidadN": "true",
    "situacionSolicitante.checkNeetN": "true"
  },
  "2": {
    "datosContacto.movilC": "600000000",
    "datosContacto.correoElectronicoC": "holder@example.test",
    "datosContacto.correoElectronicoCR": "holder@example.test",
    "datosDireccionDomicilio.tcodProvincia": "10",
    "datosDireccionDomicilio.tcodMunicipio": "CACERES"
  },
  "3": {},
  "4": {},
  "5": {},
  "6": { "checkLOPD": "true" }
}
```

For confirmed submission, provide two different local handoff paths through
`--pin-fichero` and `--enlace-fichero`. Use new or empty private files for each
attempt. The files may initially be absent. The command checks each pending file
every 5 seconds for up to 30 minutes, keeping the process, certificate client
and cookies alive. It never prints their contents or deletes the files.

On step 2, the command submits `confirmarMovil` for an unverified or changed
mobile, which sends a real SMS. It prints `SMS requested` to stderr so the
holder or supervisor knows to write only the received digits into the PIN file.
The portal advertises a 4-hour code lifetime. Once digits arrive, the command
submits `pinSMS` with `confirmarOTP` and requires the returned hidden
`confirmaMovil` to equal `1`.

For an unverified or changed email, the command submits `confirmarCorreo` on the
same form and prints a waiting message. The holder or supervisor writes the
received confirmation URL into the link file. The command GETs that URL using
the same client, then GETs step 2 again and requires `confirmaCorreo=1`. In the
captured JavaScript, `0` means unverified and `2` means awaiting confirmation;
`confirmaCorreo` has an `id` but no submitted `name`. Links and every redirect
must use HTTPS on `garantiajuvenil.sepe.es` or another administration host
allowed by the HTTP client. URLs containing credentials or a nonstandard port
are refused. Already verified, unchanged contacts do not receive new messages.

From this checkout, run `pnpm build` first. After configuring
`VENTANILLA_UNICA_CERT` and `VENTANILLA_UNICA_KEY` as PEM file paths and setting
`GJ_ANSWERS` to the complete, reviewed JSON, run:

```sh
node dist/cli/main.js sepe garantia-juvenil --inscribir si --respuestas "$GJ_ANSWERS" --pin-fichero /private/tmp/gj-pin.txt --enlace-fichero /private/tmp/gj-email-link.txt --confirmar si --out ./garantia-juvenil-submission
```

This confirmed command is documented and covered by synthetic HTTP/file tests;
it was not run against the live portal. Without `--confirmar si`, the command
only logs in and reads pages: it does not save a step, resolve municipalities,
request verification messages, read handoff files or visit a confirmation link.
Confirmed mode requires both handoff paths before saving any step.

Confirmation authorizes the municipality lookup, real SMS and email verification
requests, visiting the confirmation link, saving the six form steps and sending
the page-6 `Confirmar solicitud` action. This submits the holder's declarations
to the Sistema Nacional de Garantía Juvenil; it is not merely a status lookup.
`executed: true` means the final action was sent. An explicit submission
confirmation and a plausible registry number are both required for
`receipt.registered: true`; an HTTP-200 response, a draft or a further signature
page does not prove registration. PDF download failures preserve the executed
action and receipt in the JSON, with an error note. The command does not retry
uncertain writes. Inspect the portal before repeating a request after an error
or an unverified receipt.

The implemented write sequence, including dependent municipalities and SMS/email
verification, has synthetic HTTP tests and has not been exercised live. Any
signature step after confirmation still requires portal interaction;
registration requires the explicit receipt evidence described above. Timeouts,
failed codes, expired sessions and ambiguous write responses stop the process
without resending messages or retrying steps. Inspect the portal before starting
another attempt. Live READ verification covered an unregistered holder and all
six form pages. Alta/baja/pending records and offered PDF downloads still need
an eligible live record.

Protocol: GET `/loginClave`, post the returned SAML request to Cl@ve, choose
`AFIRMA`, and replay the SAML relay to `/j_spring_security_check`. READ then
uses GET `/tablaHistoricoSitSolicitante.action` and `/solicitudPaso1` through
`/solicitudPaso6` for an unconsolidated wizard. Confirmed writes use each page's
fresh Struts token and `/solicitudPasoNToken.action`, with `siguiente` on steps
1, 3, 4 and 5, `validar` on step 2 and `confirmarInscripcion` on step 6. Only
the exact Garantía Juvenil host accepts legacy folded response headers; TLS
certificate verification remains enabled.

To recapture a portal change, use the holder's own certificate and retain only
synthetic fixtures with the current control names and page structure. Login
relay POSTs are authentication; inscription `Token.action` requests are writes
and require explicit confirmation. Never log cookies, private keys or SAML
payloads.

## Signing

| Command                                                                                                                                                                                                                       | What it does                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica firmar pdf --in f.pdf --out g.pdf [--visible si] [--motivo text] [--lugar t] [--contacto t] [--pagina n] [--posicion x1,y1,x2,y2] [--texto t] [--campo name] [--tsa url [--sello firma\|documento\|ambos]]` | PAdES-B-B signature (ETSI.CAdES.detached) by incremental update; valid in Acrobat, pdfsig and openssl                                                                                                                        |
| `ventanilla-unica firmar xml --in f.xml --out g.xml [--modo enveloped\|enveloping\|detached\|internally-detached] [--politica facturae\|age\|ninguna] [--tsa url]`                                                            | XAdES-BES/EPES with SHA-256, AutoFirma-style layout; `facturae` emits AutoFirma's Facturae profile (role `emisor`, SHA-512 references, key value) and `age` the AGE policy v1.9; `--tsa` adds XAdES-T; verified with xmlsec1 |

Both run locally with the certificate and key you pass; nothing leaves your
machine. For portal flows, the library's
`signAutoScript(identity, {data, algorithm, format, extraParams})` does what
AutoFirma does for a page's `AutoScript.sign` call (NONE, CAdES, XAdES, FacturaE
and PAdES, with AutoFirma's defaults; `operation: 'cosign'` or `'countersign'`
with `signature` does `coSign` and `counterSign` for CAdES and XAdES, and a
PAdES `coSign`) and returns the signature and certificate the page posts.

## Offline tools

| Command                                                                                                                                        | What it does                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica validar nif --nif X`                                                                                                         | Validates a DNI, NIE, special NIF or legal-entity NIF and names its type                                |
| `ventanilla-unica aeat modelo190 --datos f.csv --out f.txt --ejercicio 2025 --nif X --nombre ... --telefono ... --contacto ... [--correo ...]` | Builds the BOE file of a modelo 190 (claves A and L) from a perceptor CSV, ready for `aeat informativa` |
| `ventanilla-unica calendario fiscal --ejercicio 2026 [--modelo 303] [--periodo 3T]`                                                            | Filing deadlines and direct-debit cut-offs as the AEAT publishes them; unverified years answer an error |

The modelo 190 CSV has one row per perceptor and key. `provincia` is the
province of the perceptor's home (an employee living in Badajoz is `06` even if
the workplace is in Cáceres), not the declarant's. `L` with subclave `05` is
only for a payment actually exempt under art. 7.e LIRPF: the payment at the end
of a temporary contract (art. 49.1.c ET) is taxable and goes in `A` with the
rest of that perceptor's pay. `retencion` is what each payslip actually
withheld, even when the quarterly 111 returns add up to something else. The AEAT
validation only checks format and census, so reconcile the amounts against the
payslips before filing.

No certificate needed.

No browser, no runtime dependencies, nothing stored: the tool speaks HTTPS with
the certificate, walks the Cl@ve relay where the portal needs it, parses the
answer and prints JSON.

## Install

```sh
npm install -g ventanilla-unica      # or: pnpm add -g ventanilla-unica, or npx ventanilla-unica ...
```

Node 22 or newer.

## Junta payment-account registration

`junta alta-terceros --iban <Spanish-IBAN> --telefono <nine-digits> --out <directory>`
prepares a plan without contacting the portal. With `--confirmar si`, it
creates, signs and submits the P5145 application. It requests an account
registration (ALTA) and authorizes the Junta to verify AEAT identity and bank
ownership. It does not change a grant application or submit a BAJA.

The old Carpeta profile must contain the province, municipality and notification
email. For a natural person or a legal entity,
`junta carpeta-completar --comunidad <code> --provincia <code> --municipio <code> --telefono <nine-digits> --correo <email> --out <directory>`
plans that prerequisite update. `--confirmar si` signs and submits it. The codes
must occur in the portal's dependent dropdowns. The command preserves the street
address and uses numeric street numbering; review the existing address before
confirming.

Each filing saves the draft PDF and redacted signing responses under `--out`. A
registry number in the response is required for `registered: true`. HTTP 200 or
a generic signing-success modal is insufficient. The portal can reject
registration with code 40090, "Error al guardar los documentos adjuntos". The
CLI preserves that error and does not retry. Check the live expediente list and
recover the same draft before another submission. A filed registration request
does not prove that the account is already active.

Protocol: authenticate through the existing Cl@ve certificate relay; open
`/SEDE/privado/ciudadanos/exterior.jsf?cod=5145` (account) or `cod=5637`
(profile); submit the JSF/A4J form pages; save the draft and pass
`/SEDE/privado/docAdjuntos.jsf`; review the live `/SEDE/VisorPdf/<draft>.pdf`;
prepare `/SEDE/privado/ciudadanos/firmarSolicitud.jsf`; reproduce
`MiniApplet.sign` with SHA512withRSA, XAdES Detached and the AGE 1.9 policy from
`/SEDE/common-js/scriptFirma.js`; submit the real signature callback and inspect
the registration response. JSF component identifiers and ViewState are
session-specific. The client resolves button identifiers from the current page
and updates every ViewState copy after a fragment.

To recapture a failure, retain the redacted response, draft number and preview
in a private evidence directory. Re-open the exact draft with the holder's
certificate and inspect the live form and its scripts. Do not copy live
identities, IBANs, signatures, client state or credentials into fixtures. The
certificate environment variables described below are sufficient; this flow adds
no credentials.

## The certificate

The portals accept the qualified certificates FNMT issues to people and to legal
entities, and the DNIe. Export yours once to PEM (a PKCS#12 bundle from FNMT
needs `-legacy` on OpenSSL 3):

```sh
openssl pkcs12 -legacy -in certificate.p12 -clcerts -nokeys -out cert.pem
openssl pkcs12 -legacy -in certificate.p12 -nocerts -nodes -out key.pem
chmod 600 key.pem
```

Then either pass the paths or export them:

```sh
ventanilla-unica aeat deudas --cert cert.pem --key key.pem --nif 12345678Z

export VENTANILLA_UNICA_CERT=cert.pem VENTANILLA_UNICA_KEY=key.pem
ventanilla-unica aeat deudas --nif 12345678Z
```

`VENTANILLA_UNICA_KEY_PASSPHRASE` unlocks an encrypted key. Prefer the
environment variables on a shared machine: command-line arguments show up in the
process list.

## Output

Every command prints one JSON document on stdout and exits 0. Errors go to
stderr as `ventanilla-unica: <message>` with exit code 1; an unknown command or
option prints the usage and exits 2. Amounts keep the portal's own text
(`"1.234,56"`) next to a parsed number in euros, so nothing is lost in rounding
and nothing has to be re-parsed downstream.

```sh
ventanilla-unica aeat deudas --nif 12345678Z | jq '.debts[] | {clave, estado, pendiente}'
```

## Library

The same code is importable. The client takes the certificate once and every
portal function takes the client:

```ts
import { createHttpClient, loadCertificateIdentity } from 'ventanilla-unica'

const identity = await loadCertificateIdentity({
  cert: 'cert.pem',
  key: 'key.pem',
})
const client = createHttpClient(identity)
```

The portal orchestrators and their result types are exported from the package
root as well; see `src/index.ts`.

## What it will not do

- It never pays except through `aeat pagar`, and it never acts without
  `--confirmar si`.
- It never stores portal data, session cookies or tokens beyond the running
  command, and it sends nothing anywhere but to the portal you named.
- It does not submit PLACSP bids. Offers are prepared and sent with the
  platform's own Java desktop tool (Herramienta de Preparación y Presentación de
  Ofertas), which encrypts each sobre on the client to the contracting body's
  key and signs it with AutoFirma; no submission API is published, and the open
  data and CODICE feeds are read-only.

Some reads are emissions: documents the portal generates on request (TGSS
reports and certificates, the AEAT census and up-to-date certificates, the SEPE
certificate, the CIRBE report). Emitting one changes nothing about the holder's
position, but the portals limit how many a subject may request per day (TGSS
refuses around the third request for the same holder), and those commands say so
in `--help`.

## Legal notice

Use `ventanilla-unica` only with your own certificate, or with one whose holder
has authorised you to act on their behalf, on the holder's own data. The
portals' terms of use bind you, not the tool. The package is not affiliated
with, nor endorsed by, any of the administrations it talks to; their pages
change without notice and a parser can break at any time. Read the JSON with
that in mind and check anything that matters against the portal itself.

## Contributing

See `CONTRIBUTING.md`. The lint configuration is the coding standard; the
fixtures are synthetic by rule; every command stays read-only unless its name
says otherwise.

## Rayuela password login

Set `VENTANILLA_UNICA_RAYUELA_USUARIO` and `VENTANILLA_UNICA_RAYUELA_CLAVE` in
the environment. Credentials are never accepted as command arguments. `--hijo`
selects an offered child by id or an unambiguous case-insensitive name fragment;
the current child is not in the switcher. Messages include only the first inbox
page, its total and embedded previews, which may be truncated. Nothing opens a
message or marks it read. Grades are not supported.

## License

MIT, see `LICENSE`.

### AEAT appointments

`aeat cita` lists in-person appointment slots for the holder without booking.
Use a five-digit postal code, a search date and the earliest acceptable time.
The default service is Aplazamientos (`C324163`); `--servicio` accepts a code
actually offered for that holder. Province names are not accepted: the captured
form's handling of accented names was ambiguous, while postal codes were
verified against the live source.

```sh
ventanilla-unica aeat cita --nif 00000000T --nombre "TEST HOLDER" \
  --postal 10000 --fecha 2026-10-23 --hora 11:00
```

To check an exact offered slot, add `--centro` and its exact `--hora`. Without
`--confirmar si`, the run stops after the offer list: it never preselects the
slot, because the portal holds a preselected slot as "Cita pendiente de
confirmar" and hides it from later searches. Confirmed reservations also require
`--email`, `--telefono` (digits, Spanish +34 prefix), `--out` and optionally
`--detalle` (250 characters maximum), all checked before any portal request. The
CLI rechecks the selected centre, date and time against current offers. It
submits the final request once, saves its HTML response with owner-only
permissions and reports transmission separately from confirmation. Inspect that
receipt before retrying: a timeout or an unrecognized result must not cause a
duplicate reservation. Booking does not apply for a deferral, change a payment
plan, accept notifications or pay a debt.

The captured protocol is the public `TOCP-MUTE/internet` flow: GET
`identificacion`, POST holder identification, POST `procedimiento` with an
offered service, POST `cita` with explicit in-person/date/time/postal filters,
and, only with `--confirmar si`, POST `cita` to prepare the offered slot and
POST `confirmacion`. The same HTTP client retains the session cookies; slot
codes must be recaptured in each session. No browser or runtime dependency is
needed.
