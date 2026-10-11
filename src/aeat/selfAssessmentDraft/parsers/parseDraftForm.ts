import { unescapeZkDesktopId } from '../../filings/mappers/unescapeZkDesktopId'
import type { DraftForm } from '../types/DraftForm'

/**
 * The desktop id and the two buttons of the simulator's toolbar, found by
 * their ZK sclass: `cmd__importacion` (Importar, an upload button) and
 * `cmd__aeatPresentarBorrador` (Vista previa).
 */
export const parseDraftForm = (html: string): DraftForm => {
  const rawDesktopId = /dt:'(z_[^']+)'/.exec(html)?.[1]
  const importUuid = /Button','(\w+)',\{[^\]]*?sclass:'cmd__importacion'/.exec(
    html,
  )?.[1]
  const previewUuid =
    /Button','(\w+)',\{[^\]]*?sclass:'cmd__aeatPresentarBorrador'/.exec(
      html,
    )?.[1]
  if (!rawDesktopId || !importUuid || !previewUuid)
    throw new Error(
      'AEAT: the simulator page has no desktop, Importar or Vista previa',
    )
  return {
    desktopId: unescapeZkDesktopId(rawDesktopId),
    importUuid,
    previewUuid,
  }
}
