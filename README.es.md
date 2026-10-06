# ventanilla-unica

[Read in English](README.md)

Cliente de línea de comandos para las sedes electrónicas de la administración
española, con tu propio certificado digital. Un binario, una respuesta JSON por
sede: deudas, pagos, modelos presentados, notificaciones, informes de la
Seguridad Social, prestaciones del SEPE y el informe CIRBE, sin abrir el
navegador. Por defecto solo lee; también firma PDF y XML en local, y prepara o
ejecuta los trámites de "Escritura" solo cuando los confirmas. Lo mantiene
[InteliFactu](https://intelifactu.com), que lo usa para tener al día la parte de
la administración en la contabilidad de sus clientes.

| Comando                                                                                                                | Sede                                                               | Qué lee                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ventanilla-unica aeat deudas --nif <NIF>`                                                                             | Agencia Tributaria (AEAT)                                          | Deudas pendientes, su detalle y los aplazamientos                                                                                                                        |
| `ventanilla-unica aeat pagos --nif <NIF> [--out d]`                                                                    | AEAT                                                               | Todos los pagos hechos (Mis pagos) con su NRC y los justificantes en PDF                                                                                                 |
| `ventanilla-unica aeat declaraciones --nif <NIF> --modelo m --ejercicio a [--periodo p] [--out d]`                     | AEAT                                                               | Los modelos presentados de un ejercicio, el CSV de cada uno y los PDF                                                                                                    |
| `ventanilla-unica aeat informativas --nif <NIF> --modelo m --ejercicio a [--out d]`                                    | AEAT                                                               | Las declaraciones informativas (190, 347, 349...) desde 2020, con CSV y PDF                                                                                              |
| `ventanilla-unica aeat certificado-censal --nif <NIF> --nombre "<razón social>" [--out d]`                             | AEAT                                                               | El certificado de situación censal (lo emite)                                                                                                                            |
| `ventanilla-unica aeat certificado-corriente --nif <NIF> [--finalidad contratacion\|subvenciones\|generico] [--out d]` | AEAT                                                               | El certificado de estar al corriente de obligaciones tributarias, por defecto para contratar con el sector público; `positive` dice si es POSITIVO o NEGATIVO (lo emite) |
| `ventanilla-unica tgss deuda --nif <NIF> [--tipo detallado\|total] [--out d]`                                          | Seguridad Social (TGSS)                                            | El informe de deuda, detallado o total (lo emite)                                                                                                                        |
| `ventanilla-unica tgss corriente --nif <NIF> --tipo generico\|licitacion\|subvenciones\|articulo-42 [--out d]`         | TGSS                                                               | El certificado de estar al corriente (lo emite)                                                                                                                          |
| `ventanilla-unica tgss vida-laboral --desde DD/MM/AAAA [--hasta DD/MM/AAAA] [--out d]`                                 | TGSS                                                               | El informe de vida laboral acotado (lo emite)                                                                                                                            |
| `ventanilla-unica tgss situacion [--out d]`                                                                            | TGSS                                                               | El informe de situación actual del trabajador (lo emite)                                                                                                                 |
| `ventanilla-unica tgss nss [--out d]`                                                                                  | TGSS                                                               | El informe del número de la Seguridad Social (lo emite)                                                                                                                  |
| `ventanilla-unica tgss datos [--out d]`                                                                                | TGSS                                                               | El informe de datos identificativos y de domicilio (lo emite)                                                                                                            |
| `ventanilla-unica tgss alta --fecha DD/MM/AAAA [--out d]`                                                              | TGSS                                                               | El informe de alta laboral a fecha concreta (lo emite)                                                                                                                   |
| `ventanilla-unica tgss empresario [--out d]`                                                                           | TGSS                                                               | El informe negativo de inscripción como empresario (lo emite)                                                                                                            |
| `ventanilla-unica tgss bases [--ejercicio a] [--out d]`                                                                | TGSS                                                               | Las bases y cuotas ingresadas de un año, mes a mes (lo emite)                                                                                                            |
| `ventanilla-unica dehu list [--state s] [--year a]`                                                                    | Dirección Electrónica Habilitada única (DEHÚ)                      | Notificaciones pendientes y realizadas, sin abrir ninguna                                                                                                                |
| `ventanilla-unica dehu documentos --out d [--year a] [--id a,b]`                                                       | DEHÚ                                                               | Documento y justificante de las notificaciones ya realizadas                                                                                                             |
| `ventanilla-unica oargt recibos [--include paid] [--importes hoy]`                                                     | OARGT, Diputación de Cáceres                                       | Recibos en voluntaria y en ejecutiva, con el importe a día de hoy                                                                                                        |
| `ventanilla-unica junta expedientes`                                                                                   | Junta de Extremadura, sede asociada (tramites.juntaex.es)          | Tus expedientes en curso y archivados                                                                                                                                    |
| `ventanilla-unica junta notificaciones`                                                                                | Junta de Extremadura                                               | Notificaciones pendientes, aceptadas y rechazadas, como interesado y como representante, sin abrir ninguna                                                               |
| `ventanilla-unica junta registros`                                                                                     | Junta de Extremadura                                               | Los registros de entrada presentados por ti o en tu nombre                                                                                                               |
| `ventanilla-unica junta deudas`                                                                                        | Junta de Extremadura, Carpeta Ciudadana (sede.gobex.es, vía Cl@ve) | Deudas con la Junta y cuántas siguen pendientes                                                                                                                          |
| `ventanilla-unica junta tasas`                                                                                         | Junta de Extremadura, Carpeta Ciudadana                            | Tasas pagadas (modelo 050) e incidencias de tasas                                                                                                                        |
| `ventanilla-unica junta pagos [--ejercicio a]`                                                                         | Junta de Extremadura, Carpeta Ciudadana                            | Pagos de la Junta al titular en un ejercicio, e incidencias del tercero como compensaciones                                                                              |
| `ventanilla-unica junta carpeta-expedientes [--desde d] [--hasta d]`                                                   | Junta de Extremadura, Carpeta Ciudadana                            | Expedientes iniciados en un rango de fechas (por defecto los últimos 365 días), de 30 en 30 días como exige la sede                                                      |
| `ventanilla-unica junta carpeta-notificaciones`                                                                        | Junta de Extremadura, Carpeta Ciudadana                            | Notificaciones en todos los estados, sin abrir ninguna                                                                                                                   |
| `ventanilla-unica junta carpeta-descargar --id <n> --out d`                                                            | Junta de Extremadura, Carpeta Ciudadana                            | El PDF de una notificación ya aceptada ("Notificado"), y el acuse cuando la sede lo sirve; rechaza una pendiente                                                         |
| `ventanilla-unica junta documentos`                                                                                    | Junta de Extremadura, Carpeta Ciudadana                            | Documentos presentados ante la Junta ("Mis documentos")                                                                                                                  |
| `ventanilla-unica junta representados`                                                                                 | Junta de Extremadura, Carpeta Ciudadana                            | Expedientes tramitados mediante representante                                                                                                                            |
| `ventanilla-unica caceres expedientes`                                                                                 | Ayuntamiento de Cáceres (sede.caceres.es)                          | Tus expedientes en curso y archivados                                                                                                                                    |
| `ventanilla-unica caceres notificaciones`                                                                              | Ayuntamiento de Cáceres                                            | Notificaciones pendientes, aceptadas y rechazadas, sin abrir ninguna                                                                                                     |
| `ventanilla-unica caceres registros`                                                                                   | Ayuntamiento de Cáceres                                            | Los registros de entrada presentados por ti o en tu nombre                                                                                                               |
| `ventanilla-unica sepe prestacion`                                                                                     | SEPE                                                               | La última prestación: fechas, días de derecho, consumidos y restantes                                                                                                    |
| `ventanilla-unica sepe certificado --out d`                                                                            | SEPE                                                               | El certificado de situación de prestaciones en PDF (lo emite)                                                                                                            |
| `ventanilla-unica cirbe informe --nacimiento DD-MM-AAAA --email e`                                                     | Banco de España (CIRBE)                                            | Pide tu informe de riesgos (lo emite)                                                                                                                                    |
| `ventanilla-unica cirbe estado [--out d]`                                                                              | CIRBE                                                              | Lista tus peticiones y descarga los PDF listos                                                                                                                           |
| `ventanilla-unica rolece estado --nif <NIF>`                                                                           | Registro Oficial de Licitadores (ROLECE)                           | Si la empresa está inscrita (búsqueda de certificados) y, si no, si le toca la solicitud inicial                                                                         |
| `ventanilla-unica placsp estado --email e`                                                                             | Plataforma de Contratación del Sector Público (PLACSP)             | Si un e-mail ya tiene cuenta de operador (comprobación de disponibilidad; no crea nada)                                                                                  |

## Escritura

Los comandos de escritura actúan ante la administración. Sin `--confirmar si`
solo hacen la preparación de lectura (sesión, listados, validación) e imprimen
el plan: cada petición que enviarían, con sus valores. Con `--confirmar si` la
ejecutan y devuelven el justificante. Se detienen antes del acto si algo no
cuadra con lo leído (titular, importe, documento).

| Comando                                                                                                                                                                                     | Sede   | Trámite                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica aeat comparecer --nif <NIF> --id <n> [--out d]`                                                                                                                           | AEAT   | Comparece en una notificación de la sede de la AEAT; los plazos empiezan ese día                                                                                                                                                                                                                    |
| `ventanilla-unica aeat carta-pago --nif <NIF> --clave K --importe n,nn [--out d]`                                                                                                           | AEAT   | Genera una carta de pago parcial (modelo 010); pagarla es otro paso, en el banco                                                                                                                                                                                                                    |
| `ventanilla-unica aeat domicilio --nif <NIF> --codigo-postal ... --via ... [...]`                                                                                                           | AEAT   | Presenta el 036 de cambio de domicilio fiscal (personas jurídicas)                                                                                                                                                                                                                                  |
| `ventanilla-unica aeat aportar --csv <CSV> --como interesado\|representante --asunto ... --telefono ... --documentos a.pdf,b.pdf [--tipos 203,200]`                                         | AEAT   | Presenta documentación (alegaciones, contestación a un requerimiento) en el registro de la AEAT con el CSV de la notificación, como interesado o representante; confirmado, cuenta como presentado hoy                                                                                              |
| `ventanilla-unica aeat informativa --fichero f.txt [--periodo 0A]`                                                                                                                          | AEAT   | Presenta una declaración informativa en fichero (190, 347, 180...) por TGVI Online en nombre de su declarante, pasando a representación si hace falta; sin confirmar valida cada registro en la AEAT y lista los errores; confirmado rechaza cualquier registro erróneo y presenta con firma básica |
| `ventanilla-unica junta carpeta-comparecer --id <n> [--out d]`                                                                                                                              | Junta  | Acepta una notificación pendiente de la Carpeta Ciudadana (la sede firma el acuse por sí misma); cuenta como notificada ese día y empiezan sus plazos. Una ya aceptada solo se descarga                                                                                                             |
| `ventanilla-unica tgss aplazamiento --nif <NIF> --plazos n --garantia exenta --documento f.pdf`                                                                                             | TGSS   | Solicita un aplazamiento (XV207A01). De momento solo plan: falta capturar la firma                                                                                                                                                                                                                  |
| `ventanilla-unica tgss adjuntar --expediente n --documento f.pdf --tipo t`                                                                                                                  | TGSS   | Adjunta un documento a un expediente. De momento solo plan, por lo mismo                                                                                                                                                                                                                            |
| `ventanilla-unica rolece solicitud --nif <NIF> --comunidad c --provincia p --email e --out d`                                                                                               | ROLECE | Presenta la inscripción inicial (Solicitud Simplificada): firma el XML de la solicitud como lo haría AutoFirma (XAdES enveloped) y guarda el acuse de recibo y el ZIP del justificante                                                                                                              |
| `ventanilla-unica placsp pregunta --expediente <enlace\|idEvl> --texto-file f.txt`                                                                                                          | PLACSP | Pregunta al órgano de contratación sobre una licitación publicada. De momento solo plan: requiere cuenta de operador y el formulario con sesión                                                                                                                                                     |
| `ventanilla-unica dgsfp reclamacion --entidad e --nif-entidad NIF --email m --direccion d --provincia p --municipio m --cp n --escrito f.pdf --sac f.pdf --declaro-no-litigio si [--out d]` | DGSFP  | Presenta una queja o reclamación contra una aseguradora o un distribuidor de seguros (TEL43) en nombre propio: acceso con certificado por Cl@ve, adjuntos, documento de solicitud firmado en local (PAdES) y justificante con número de registro y CSV                                              |

## Firma

| Comando                                                                                                                      | Qué hace                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica firmar pdf --in f.pdf --out g.pdf [--visible si] [--motivo texto]`                                         | Firma PAdES-B-B (ETSI.CAdES.detached) por actualización incremental; válida en Acrobat, pdfsig y openssl |
| `ventanilla-unica firmar xml --in f.xml --out g.xml [--modo enveloped\|enveloping\|detached] [--politica facturae\|ninguna]` | XAdES-BES/EPES con SHA-256 y la forma de AutoFirma; verificada con xmlsec1                               |

Las dos firman en tu máquina con el certificado y la clave que indiques.

## Utilidades sin certificado

| Comando                                                                                                                                        | Qué hace                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `ventanilla-unica validar nif --nif X`                                                                                                         | Valida un DNI, NIE, NIF especial o NIF de persona jurídica y dice de qué tipo es                                       |
| `ventanilla-unica aeat modelo190 --datos f.csv --out f.txt --ejercicio 2025 --nif X --nombre ... --telefono ... --contacto ... [--correo ...]` | Genera el fichero BOE de un modelo 190 (claves A y L) a partir de un CSV de perceptores, listo para `aeat informativa` |
| `ventanilla-unica calendario fiscal --ejercicio 2026 [--modelo 303] [--periodo 3T]`                                                            | Plazos de presentación y de domiciliación tal como los publica la AEAT; un año no verificado da error                  |

Sin navegador, sin dependencias en tiempo de ejecución y sin guardar nada: la
herramienta habla HTTPS con tu certificado, recorre Cl@ve donde la sede lo pide,
interpreta la respuesta e imprime JSON. El certificado no sale de tu máquina.

## Instalación

```sh
npm install -g ventanilla-unica      # o: pnpm add -g ventanilla-unica, o npx ventanilla-unica ...
```

Node 22 o superior.

## El certificado

Sirven los certificados cualificados de la FNMT de persona física y de
representante de persona jurídica, y el DNIe. Exporta el tuyo a PEM una vez (el
.p12 de la FNMT necesita `-legacy` con OpenSSL 3):

```sh
openssl pkcs12 -legacy -in certificado.p12 -clcerts -nokeys -out cert.pem
openssl pkcs12 -legacy -in certificado.p12 -nocerts -nodes -out key.pem
chmod 600 key.pem
```

Y pásalo por argumentos o por variables de entorno:

```sh
ventanilla-unica aeat deudas --cert cert.pem --key key.pem --nif 12345678Z

export VENTANILLA_UNICA_CERT=cert.pem VENTANILLA_UNICA_KEY=key.pem
ventanilla-unica aeat deudas --nif 12345678Z
```

`VENTANILLA_UNICA_KEY_PASSPHRASE` desbloquea una clave cifrada. En una máquina
compartida usa las variables de entorno: los argumentos se ven en la lista de
procesos.

## Lo que no hace

- Nunca comparece en una notificación de la DEHÚ: el intercambio de aceptación
  no está capturado y un acto jurídico a ciegas es peor que ninguno.
- Nunca paga, y nunca actúa sin `--confirmar si`.
- Nunca guarda datos de la sede, cookies ni tokens más allá del comando, y no
  envía nada a ningún sitio que no sea la sede que nombras.

Algunos comandos emiten un documento (informes y certificados de la TGSS,
certificados censal y de estar al corriente de la AEAT, certificado del SEPE,
informe CIRBE). Emitirlo no cambia tu situación, pero las sedes limitan cuántos
puedes pedir al día: la TGSS rechaza a partir de la tercera petición del mismo
titular.

## Aviso legal

Usa `ventanilla-unica` solo con tu certificado, o con el de alguien que te haya
autorizado, sobre sus propios datos. Te obligan las condiciones de uso de cada
sede, no la herramienta. El proyecto no está afiliado a ninguna de las
administraciones con las que habla ni cuenta con su aval; sus páginas cambian
sin aviso y un parser puede romperse en cualquier momento. Comprueba en la
propia sede cualquier dato del que dependa algo importante.

## Licencia

MIT, ver `LICENSE`.
