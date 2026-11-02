import { findDeclaredUuid } from '../deregistration/parsers/findDeclaredUuid'
import { clickUuid } from '../taxAddress/clickUuid'
import { dispatchM036Event } from '../taxAddress/dispatchM036Event'
import type { M036Session } from '../taxAddress/types/M036Session'
import { addOutsidePremises } from './addOutsidePremises'
import { activityFinderData } from './mappers/activityFinderData'
import { findNewButtonAfter } from './parsers/findNewButtonAfter'
import { readPopupError } from './parsers/readPopupError'
import type { ActivitiesRequest } from './types/ActivitiesRequest'
import type { EconomicActivity } from './types/EconomicActivity'

/** Add one row to "4. Actividades económicas" through its popup; refuses on the popup's error. */
export const addActivity = async (
  session: M036Session,
  request: ActivitiesRequest,
  activity: EconomicActivity,
): Promise<void> => {
  const popup = await clickUuid(
    session,
    findNewButtonAfter(session.html, "id:'tablaActividades'"),
  )
  await dispatchM036Event(session, {
    cmd: 'onValorDevuelto',
    uuid: findDeclaredUuid(session.blobs, 'ACTI_DESCRIPCION_400'),
    data: activityFinderData(activity),
  })
  await addOutsidePremises(session, popup, request)
  const saved = await clickUuid(
    session,
    findDeclaredUuid(session.blobs, 'botonGuardarActividad'),
  )
  const error = readPopupError(saved, 'errorActividades')
  if (error)
    throw new Error(
      `AEAT: the 036 refused activity ${activity.epigrafe} (${error}); nothing was filed`,
    )
}
