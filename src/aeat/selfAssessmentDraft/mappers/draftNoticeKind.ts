import type { DraftNotice } from '../types/DraftNotice'

/** The row's icon tooltip ("Error", "Aviso", "Correcto") as a notice kind. */
export const draftNoticeKind = (tooltip: string): DraftNotice['kind'] =>
  tooltip === 'Aviso' ? 'aviso' : tooltip === 'Correcto' ? 'correcto' : 'error'
