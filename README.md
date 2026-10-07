# ventanilla-unica

[Leer en español](README.es.md)

Command-line client for Spanish public-administration portals, using the
holder's own digital certificate. One binary, one JSON answer per portal. It
reads by default; it also signs PDF and XML locally, and prepares or performs
the acts listed under "Writing" only when you confirm them. Maintained by
[InteliFactu](https://intelifactu.com), which uses it to keep the
administrations' side of its customers' books up to date.

| Command                                                                                                                          | Portal                                                             | What it reads                                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica aeat deudas --nif <NIF>`                                                                                       | Agencia Tributaria (AEAT)                                          | Pending debts, their detail, deferral agreements                                                                                                          |
| `ventanilla-unica aeat expedientes --nif <NIF>`                                                                                  | AEAT                                                               | Mis Expedientes procedures, status, dates and listed acts; excludes separate TEA tribunal proceedings                                                     |
| `ventanilla-unica aeat pagos --nif <NIF> [--out d]`                                                                              | AEAT                                                               | Every payment made (MisPagos) with its NRC, and the receipt PDFs                                                                                          |
| `ventanilla-unica aeat declaraciones --nif <NIF> --modelo m --ejercicio y [--periodo p] [--out d]`                               | AEAT                                                               | Declarations filed for one modelo and year, the CSV of each receipt, the PDFs                                                                             |
| `ventanilla-unica aeat informativas --nif <NIF> --modelo m --ejercicio y [--out d]`                                              | AEAT                                                               | Informative returns filed (190, 347, 349...) from 2020 on, with their CSV and PDFs                                                                        |
| `ventanilla-unica aeat certificado-censal --nif <NIF> --nombre "<name>" [--out d]`                                               | AEAT                                                               | The "certificado de situacion censal" (emits it; the same day answers the cached CSV)                                                                     |
| `ventanilla-unica aeat certificado-corriente --nif <NIF> [--finalidad contratacion\|subvenciones\|generico] [--out d]`           | AEAT                                                               | The "certificado de estar al corriente de obligaciones tributarias", default for public-sector contracts; `positive` says POSITIVO or NEGATIVO (emits it) |
| `ventanilla-unica tgss deuda --nif <NIF> [--tipo detallado\|total] [--out d]`                                                    | Tesorería General de la Seguridad Social (TGSS)                    | The "informe de deuda" detailed or total (emits it; counts against the daily cap)                                                                         |
| `ventanilla-unica tgss corriente --nif <NIF> --tipo generico\|licitacion\|subvenciones\|articulo-42 [--entidad <NIF>] [--out d]` | TGSS                                                               | A "certificado de estar al corriente" (emits it; counts against the daily cap)                                                                            |
| `ventanilla-unica tgss vida-laboral --desde DD/MM/AAAA [--hasta DD/MM/AAAA] [--out d]`                                           | TGSS                                                               | The "informe de vida laboral acotado" for a date range (emits it)                                                                                         |
| `ventanilla-unica tgss situacion [--out d]`                                                                                      | TGSS                                                               | The "informe de situación actual del trabajador" (emits it)                                                                                               |
| `ventanilla-unica tgss nss [--out d]`                                                                                            | TGSS                                                               | The "informe del número de la Seguridad Social" (emits it)                                                                                                |
| `ventanilla-unica tgss datos [--out d]`                                                                                          | TGSS                                                               | The "informe de datos identificativos y de domicilio" (emits it)                                                                                          |
| `ventanilla-unica tgss alta --fecha DD/MM/AAAA [--out d]`                                                                        | TGSS                                                               | The "informe de alta laboral a fecha concreta" (emits it)                                                                                                 |
| `ventanilla-unica tgss empresario [--out d]`                                                                                     | TGSS                                                               | The "informe negativo de inscripción de empresario" (emits it)                                                                                            |
| `ventanilla-unica tgss ccc`                                                                                                      | TGSS                                                               | The holder's cuentas de cotización with their situation (alta/baja, date) and RED authorisation (RETC0001)                                                |
| `ventanilla-unica tgss bases [--ejercicio y] [--out d]`                                                                          | TGSS                                                               | The "informe de bases y cuotas ingresadas" for one year, with the monthly rows per régimen (emits it)                                                     |
| `ventanilla-unica dehu list [--state s] [--year y]`                                                                              | Dirección Electrónica Habilitada única (DEHU)                      | Pending and realized notifications, without opening any                                                                                                   |
| `ventanilla-unica dehu documentos --out d [--year y] [--id a,b]`                                                                 | DEHU                                                               | The document and voucher of notifications already realized (none is opened)                                                                               |
| `ventanilla-unica oargt recibos [--include paid] [--importes hoy]`                                                               | OARGT, Diputación de Cáceres                                       | Receipts in voluntary and enforced collection, with today's amount per enforced receipt on `--importes`                                                   |
| `ventanilla-unica junta expedientes`                                                                                             | Junta de Extremadura, sede asociada (tramites.juntaex.es)          | Open and archived expedientes                                                                                                                             |
| `ventanilla-unica junta notificaciones`                                                                                          | Junta de Extremadura                                               | Pending, accepted and rejected notifications, as interested party and as representative, without opening any                                              |
| `ventanilla-unica junta registros`                                                                                               | Junta de Extremadura                                               | Registry entries filed by the holder or on their behalf                                                                                                   |
| `ventanilla-unica junta justificante --csv C --nif N --registro n --out d`                                                       | Junta de Extremadura                                               | Saves the justificante PDF of a registry entry                                                                                                            |
| `ventanilla-unica junta deudas`                                                                                                  | Junta de Extremadura, Carpeta Ciudadana (sede.gobex.es, via Cl@ve) | Debts with the Junta and how many are pending                                                                                                             |
| `ventanilla-unica junta tasas`                                                                                                   | Junta de Extremadura, Carpeta Ciudadana                            | Paid fees (modelo 050) and fee incidents                                                                                                                  |
| `ventanilla-unica junta pagos [--ejercicio a]`                                                                                   | Junta de Extremadura, Carpeta Ciudadana                            | Payments the Junta made to the holder in a year, and third-party incidents such as set-offs                                                               |
| `ventanilla-unica junta carpeta-expedientes [--desde d] [--hasta d]`                                                             | Junta de Extremadura, Carpeta Ciudadana                            | Expedientes started in a date range (default the last 365 days), swept 30 days at a time as the sede requires                                             |
| `ventanilla-unica junta carpeta-notificaciones`                                                                                  | Junta de Extremadura, Carpeta Ciudadana                            | Notifications in every state, without opening any                                                                                                         |
| `ventanilla-unica junta carpeta-descargar --id <n> --out d`                                                                      | Junta de Extremadura, Carpeta Ciudadana                            | The PDF of a notification already accepted ("Notificado"), and the acuse when the sede serves it; refuses a pending one                                   |
| `ventanilla-unica junta documentos`                                                                                              | Junta de Extremadura, Carpeta Ciudadana                            | Documents filed with the Junta ("Mis documentos")                                                                                                         |
| `ventanilla-unica junta representados`                                                                                           | Junta de Extremadura, Carpeta Ciudadana                            | Expedientes handled through a representative                                                                                                              |
| `ventanilla-unica caceres expedientes`                                                                                           | Ayuntamiento de Cáceres (sede.caceres.es)                          | Open and archived expedientes                                                                                                                             |
| `ventanilla-unica caceres notificaciones`                                                                                        | Ayuntamiento de Cáceres                                            | Pending, accepted and rejected notifications, without opening any                                                                                         |
| `ventanilla-unica caceres registros`                                                                                             | Ayuntamiento de Cáceres                                            | Registry entries filed by the holder or on their behalf                                                                                                   |
| `ventanilla-unica sepe prestacion`                                                                                               | Servicio Público de Empleo Estatal (SEPE)                          | The last unemployment benefit: dates, days of right, consumed and remaining                                                                               |
| `ventanilla-unica sepe certificado --out d`                                                                                      | SEPE                                                               | The "certificado de situacion" of benefits as PDF (emits it)                                                                                              |
| `ventanilla-unica cirbe informe --nacimiento DD-MM-AAAA --email e`                                                               | Banco de España (CIRBE)                                            | Requests your own risk report (emits it)                                                                                                                  |
| `ventanilla-unica cirbe estado [--out d]`                                                                                        | CIRBE                                                              | Lists your report requests and downloads the ready PDFs                                                                                                   |
| `ventanilla-unica rolece estado --nif <NIF>`                                                                                     | Registro Oficial de Licitadores (ROLECE)                           | Whether the company is inscribed (certificate search) and, if not, whether it is due for an initial application                                           |
| `ventanilla-unica placsp estado --email e`                                                                                       | Plataforma de Contratación del Sector Público (PLACSP)             | Whether an e-mail already has an operator account (availability check; creates nothing)                                                                   |

## Writing

Commands marked write act at the administration. Without `--confirmar si` they
run only the read-only preparation (session, lists, validation) and print the
plan: every request they would send, with its values. With `--confirmar si` they
perform it and return the portal's receipt. Each one refuses before the act when
anything does not match what the plan read (holder, amount, document).

| Command                                                                                                                                                                                     | Portal | Act                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica aeat comparecer --nif <NIF> --id <n> [--out d]`                                                                                                                           | AEAT   | Appears at a notification in the AEAT's own sede; legal deadlines start that day                                                                                                                                                                                                            |
| `ventanilla-unica aeat carta-pago --nif <NIF> --clave K --importe n,nn [--out d]`                                                                                                           | AEAT   | Generates a partial payment letter (modelo 010); paying is a separate step at the bank                                                                                                                                                                                                      |
| `ventanilla-unica aeat domicilio --nif <NIF> --codigo-postal ... --via ... [...]`                                                                                                           | AEAT   | Files a modelo 036 change of tax address (legal entities)                                                                                                                                                                                                                                   |
| `ventanilla-unica aeat baja --nif E... --causa disolucion\|otras --fecha DD/MM/AAAA --sucesores 'NIF;Nombre;%;cuota\|...' --lugar --firmado --calidad [--validar si] [--confirmar si]`      | AEAT   | Modelo 036 baja en el censo (150-152, page 13 sucesores) of an entity; `--validar si` fills it and runs the AEAT validation without filing (write)                                                                                                                                          |
| `ventanilla-unica aeat aportar --csv <CSV> --como interesado\|representante --asunto ... --telefono ... --documentos a.pdf,b.pdf [--tipos 203,200]`                                         | AEAT   | Files documents (alegaciones, a reply to a requerimiento) at the AEAT registry against the CSV of the notification they answer, as interesado or representative; confirmed, it counts as presented today                                                                                    |
| `ventanilla-unica aeat informativa --fichero f.txt [--periodo 0A]`                                                                                                                          | AEAT   | Presents an informative return file (190, 347, 180...) through TGVI Online for its declarant, switching to representation when needed; unconfirmed it validates every record at the AEAT and lists the failures; confirmed it refuses any failing record and presents with the firma básica |
| `ventanilla-unica junta presentar --destino DIR3 --telefono t --asunto s --documentos a.pdf,b.pdf [--out d]`                                                                                | Junta  | Files a writ in the Registro Electrónico General in the holder's own name: uploads the PDFs, signs the registry form (XAdES, no AutoFirma) and saves the justificante                                                                                                                       |
| `ventanilla-unica junta carpeta-comparecer --id <n> [--out d]`                                                                                                                              | Junta  | Accepts a pending notification in the Carpeta Ciudadana (the sede signs the acuse itself); it counts as notified that day and its legal deadlines start. An already accepted one is only downloaded                                                                                         |
| `ventanilla-unica tgss aplazamiento --nif <NIF> --plazos n --garantia exenta --documento f.pdf`                                                                                             | TGSS   | Requests a deferral (XV207A01). Plan only for now: the signing exchange is not captured yet                                                                                                                                                                                                 |
| `ventanilla-unica tgss adjuntar --expediente n --documento f.pdf --tipo t`                                                                                                                  | TGSS   | Attaches a document to an expediente. Plan only for now, same reason                                                                                                                                                                                                                        |
| `ventanilla-unica rolece solicitud --nif <NIF> --comunidad c --provincia p --email e --out d`                                                                                               | ROLECE | Files the initial inscription (Solicitud Simplificada): signs the application XML as AutoFirma would (XAdES enveloped) and saves the acuse de recibo and the justificante ZIP                                                                                                               |
| `ventanilla-unica placsp pregunta --expediente <link\|idEvl> --texto-file f.txt`                                                                                                            | PLACSP | Asks the contracting body a question about a published tender. Plan only for now: needs an operator account and the logged-in form                                                                                                                                                          |
| `ventanilla-unica dgsfp reclamacion --entidad e --nif-entidad NIF --email m --direccion d --provincia p --municipio m --cp n --escrito f.pdf --sac f.pdf --declaro-no-litigio si [--out d]` | DGSFP  | Files a complaint against an insurer or insurance distributor (TEL43) in the holder's own name: Cl@ve certificate login, uploads, the request document signed locally (PAdES), and saves the justificante with registry number and CSV                                                      |

## Signing

| Command                                                                                                                      | What it does                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `ventanilla-unica firmar pdf --in f.pdf --out g.pdf [--visible si] [--motivo text]`                                          | PAdES-B-B signature (ETSI.CAdES.detached) by incremental update; valid in Acrobat, pdfsig and openssl |
| `ventanilla-unica firmar xml --in f.xml --out g.xml [--modo enveloped\|enveloping\|detached] [--politica facturae\|ninguna]` | XAdES-BES/EPES with SHA-256, AutoFirma-style layout; verified with xmlsec1                            |

Both run locally with the certificate and key you pass; nothing leaves your
machine.

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

- It never opens (comparece) a DEHU notification: the accept exchange has not
  been captured, and a guessed legal act is worse than none.
- It never pays, and it never acts without `--confirmar si`.
- It never stores portal data, session cookies or tokens beyond the running
  command, and it sends nothing anywhere but to the portal you named.

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

## License

MIT, see `LICENSE`.
