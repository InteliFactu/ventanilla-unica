import { checkDeclared } from '../deregistration/checkDeclared'
import { findDeclaredUuid } from '../deregistration/parsers/findDeclaredUuid'
import { pickComboItem } from '../deregistration/pickComboItem'
import { typeDateIntoDeclared } from '../deregistration/typeDateIntoDeclared'
import { clickUuid } from '../taxAddress/clickUuid'
import type { M036Session } from '../taxAddress/types/M036Session'
import { findNewButtonAfter } from './parsers/findNewButtonAfter'
import { readPopupError } from './parsers/readPopupError'
import type { ActivitiesRequest } from './types/ActivitiesRequest'

/** Add the "fuera de un local determinado" row (alta, fecha, municipio) of the open activity popup. */
export const addOutsidePremises = async (
  session: M036Session,
  activityPopup: string,
  request: ActivitiesRequest,
): Promise<void> => {
  await clickUuid(
    session,
    findNewButtonAfter(activityPopup, 'La actividad se desarrolla fuera'),
  )
  await checkDeclared(session, 'FUERA_LOCAL_ALTA_405')
  await typeDateIntoDeclared(
    session,
    'FUERA_LOCAL_FECHA_406_409',
    request.fecha,
  )
  await pickComboItem(
    session,
    'FUERA_LOCAL_CODIGO_PROVINCIA',
    request.provincia,
  )
  await pickComboItem(
    session,
    'FUERA_LOCAL_CODIGO_MUNICIPIO',
    request.municipio,
  )
  const saved = await clickUuid(
    session,
    findDeclaredUuid(session.blobs, 'botonGuardarFueraLocal'),
  )
  const error = readPopupError(saved, 'errorFueraLocal')
  if (error)
    throw new Error(
      `AEAT: the 036 refused the municipality row (${error}); nothing was filed`,
    )
}
