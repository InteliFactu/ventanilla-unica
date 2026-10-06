import type { HttpResponse } from '../../../http/types/HttpResponse'
import { carpetaAnswer } from './carpetaAnswer'
import { carpetaListPage } from './carpetaListPage'

/** The list page holding one notification `number` in `status`, with the download panel open when `panel`. */
export const carpetaListAnswer = (
  number: string,
  status: string,
  panel = false,
): HttpResponse =>
  carpetaAnswer(
    carpetaListPage([{ number, status, link: 'j_id20' }], { panel }),
  )
