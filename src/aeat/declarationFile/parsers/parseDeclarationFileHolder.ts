import { unescapeZkLabel } from '../../filings/mappers/unescapeZkLabel'
import type { DraftFileHolder } from '../../selfAssessmentDraft/types/DraftFileHolder'

/** The NIF and name the read summary shows (`SPNIF`, `SPNOM`), or undefined when the AEAT could not read the file. */
export const parseDeclarationFileHolder = (
  answer: string,
): DraftFileHolder | undefined => {
  const nif = /id:'SPNIF',value:'([^']+)'/.exec(answer)?.[1]
  const nombre = /id:'SPNOM',value:'((?:[^'\\]|\\.)+)'/.exec(answer)?.[1]
  if (!nif || !nombre) return undefined
  return { nif, nombre: unescapeZkLabel(nombre) }
}
