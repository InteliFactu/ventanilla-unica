/**
 * RecuperarErrores answers each failing record followed by its messages, as
 * `<record>;(2) 21803 -   Año de Nacimiento SIN CONTENIDO`. Keep the
 * perceptor NIF (positions 18-26) or "declarante" and the messages.
 */
export const parseErrorReport = (
  text: string,
  recordLength: number,
): string[] =>
  text
    .split(/\r?\n/)
    .filter((line) => line.length > recordLength)
    .map((line) => {
      const who = line.startsWith('1') ? 'declarante' : line.slice(17, 26)
      const message = line.slice(recordLength).replace(/\s+/g, ' ').trim()
      return `${who} ${message.replace(/^;/, '')}`
    })
