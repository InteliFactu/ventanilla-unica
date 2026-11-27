import { firstNoticeChoices } from '../firstNoticeChoices'
import type { NoticeDays } from '../types/NoticeDays'

/**
 * Refuse notice days the Carpeta front would not let the holder pick: the
 * first from its list, the second from the same list plus 1 day and strictly
 * fewer days than the first (`formularioValidoParaGuardar`).
 */
export const validateNoticeDays = (days: NoticeDays): void => {
  if (!firstNoticeChoices.includes(days.first))
    throw new Error(
      `--primer-aviso ${String(days.first)} is not offered; choose one of ${firstNoticeChoices.join(', ')}`,
    )
  if (
    !(days.second === 1 || firstNoticeChoices.includes(days.second)) ||
    days.second >= days.first
  )
    throw new Error(
      `--segundo-aviso ${String(days.second)} must be 1 or one of ${firstNoticeChoices.join(', ')}, and fewer days than --primer-aviso`,
    )
}
