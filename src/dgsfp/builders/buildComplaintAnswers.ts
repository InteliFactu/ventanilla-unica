import { dateToFormValue } from '../mappers/dateToFormValue'
import { fileAnswer } from '../mappers/fileAnswer'
import { textAnswer } from '../mappers/textAnswer'
import type { DgsfpAttachment } from '../types/DgsfpAttachment'
import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'
import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'
import type { DgsfpPlace } from '../types/DgsfpPlace'

/** What a filing in the holder's own name answers, by control name; the notification is always electronic. */
export const buildComplaintAnswers = (
  query: DgsfpComplaintQuery,
  place: DgsfpPlace,
  files: Readonly<Record<string, DgsfpAttachment | undefined>>,
): Readonly<Record<string, Partial<DgsfpFieldValue>>> => ({
  fDocumentacionAcreditativa: fileAnswer(
    undefined,
    'No procede: presento la reclamación en mi propio nombre, sin representante.',
  ),
  cbnotificacion: textAnswer('Notificación Electrónica', '1'),
  Scorreoaviso: textAnswer(query.email),
  sDireccionNP: textAnswer(query.address),
  iprovinciaNP: textAnswer(place.province.value, place.province.key),
  iMunicipioNP: textAnswer(place.municipality.value, place.municipality.key),
  ...(query.town === '' ? {} : { sPoblacionNP: textAnswer(query.town) }),
  sCodigoPostalNP: textAnswer(query.postalCode),
  ...(query.phone === '' ? {} : { sMovilNP: textAnswer(query.phone) }),
  sMailNP: textAnswer(query.email),
  ...(query.lawsuits === '' ? {} : { sAccion: textAnswer(query.lawsuits) }),
  ...(query.sacDate === undefined
    ? {}
    : { dFechaPresentacion: textAnswer(dateToFormValue(query.sacDate)) }),
  sEntR: textAnswer(
    [`${query.entity} (NIF ${query.entityNif})`, query.entityDetail]
      .filter(Boolean)
      .join('\n'),
  ),
  sMotivo: fileAnswer(files['sMotivo']),
  bFirmante: textAnswer('true'),
  fCondicionesGenerales: fileAnswer(files['fCondicionesGenerales']),
  fSACDEC: fileAnswer(files['fSACDEC']),
  sAnexos: fileAnswer(files['sAnexos']),
})
