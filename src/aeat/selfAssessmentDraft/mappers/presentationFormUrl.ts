import { presentationBaseUrl } from '../presentationBaseUrl'
import type { DraftFileHeader } from '../types/DraftFileHeader'
import type { DraftFileHolder } from '../types/DraftFileHolder'
import { draftAppPath } from './draftAppPath'

/** The authenticated presentation form of one holder, model, exercise and period. */
export const presentationFormUrl = (
  header: DraftFileHeader,
  holder: DraftFileHolder,
): string =>
  `${presentationBaseUrl}${draftAppPath(header.modelo)}/E${header.ejercicio}/CONT/index.zul?${new URLSearchParams({ CYTE: holder.nif, PER: header.periodo }).toString()}`
