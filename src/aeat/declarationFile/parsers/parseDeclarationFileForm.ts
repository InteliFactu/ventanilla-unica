import { unescapeZkDesktopId } from '../../filings/mappers/unescapeZkDesktopId'
import type { DeclarationFileForm } from '../types/DeclarationFileForm'

/** The desktop id and the Leer declaración upload button (`btnLeerDeclaracionUpl`) of an "Envío Fichero" page. */
export const parseDeclarationFileForm = (html: string): DeclarationFileForm => {
  const rawDesktopId = /dt:'(z_[^']+)'/.exec(html)?.[1]
  const readUuid = /Button','(\w+)',\{id:'btnLeerDeclaracionUpl'/.exec(
    html,
  )?.[1]
  if (!rawDesktopId || !readUuid)
    throw new Error(
      'AEAT: the Envío Fichero page has no desktop or Leer declaración',
    )
  return { desktopId: unescapeZkDesktopId(rawDesktopId), readUuid }
}
