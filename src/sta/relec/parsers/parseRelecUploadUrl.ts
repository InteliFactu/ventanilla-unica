import { parseRelecUploaderArgs } from './parseRelecUploaderArgs'

/** Reproduce the catalogue's openUploader() URL from the selected holder row. */
export const parseRelecUploadUrl = (
  html: string,
  origin: string,
  slot: string,
  person: string,
): string => {
  const args = parseRelecUploaderArgs(html, slot, person)
  const query = new URLSearchParams({
    tipoDocumento: slot,
    firma: 'S',
    extensions: args[1] ?? '',
    personDBOID: person,
    maxSize: args[4] ?? '',
    checkPdf: args[5] ?? '',
    reusable: args[6] ?? '',
    allowMultiple: args[8] ?? '',
  })
  if (args[7]) query.set('indice', args[7])
  return `${origin}/sta/pages/relec/documentSignSend.jsp?${query.toString()}`
}
