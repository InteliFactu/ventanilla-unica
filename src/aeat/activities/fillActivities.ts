import { pickComboItem } from '../deregistration/pickComboItem'
import { tickWidget } from '../taxAddress/tickWidget'
import { typeIntoWidget } from '../taxAddress/typeIntoWidget'
import type { M036Session } from '../taxAddress/types/M036Session'
import { addActivity } from './addActivity'
import type { ActivitiesRequest } from './types/ActivitiesRequest'

/** Tick casilla 127, add every activity on page 4 and sign; form state only, nothing is filed. */
export const fillActivities = async (
  session: M036Session,
  request: ActivitiesRequest,
): Promise<void> => {
  await tickWidget(session, 'T1_MOD_ACTIVIDADES_127')
  for (const activity of request.actividades)
    await addActivity(session, request, activity)
  await typeIntoWidget(session, 'T1_LUGAR', request.lugar)
  await pickComboItem(session, 'T1_FIRMA_EN_CALIDAD', request.calidad)
  await typeIntoWidget(session, 'T1_FIRMADO', request.firmado)
}
