import { typeIntoWidget } from '../taxAddress/typeIntoWidget'
import type { M036Session } from '../taxAddress/types/M036Session'
import { addSuccessor } from './addSuccessor'
import { checkDeclared } from './checkDeclared'
import { deregistrationCauseLabel } from './mappers/deregistrationCauseLabel'
import { pickComboItem } from './pickComboItem'
import { typeDateIntoDeclared } from './typeDateIntoDeclared'
import type { DeregistrationRequest } from './types/DeregistrationRequest'

/**
 * Fill casillas 150-152, the signature and page 13; form state only, nothing
 * is filed. The baja en el censo takes the entity out of the ROI too: the
 * AEAT refuses casilla 150 together with 130 (ROI) as incompatible (10655).
 */
export const fillDeregistration = async (
  session: M036Session,
  request: DeregistrationRequest,
): Promise<void> => {
  await checkDeclared(session, 'T1_BAJA_CENSO_150')
  await pickComboItem(
    session,
    'T1_BAJA_CAUSA_151',
    deregistrationCauseLabel[request.causa],
  )
  await typeDateIntoDeclared(session, 'T1_BAJA_FECHA_152', request.fecha)
  await typeIntoWidget(session, 'T1_LUGAR', request.lugar)
  await typeIntoWidget(session, 'T1_FIRMA_EN_CALIDAD', request.calidad)
  await typeIntoWidget(session, 'T1_FIRMADO', request.firmado)
  for (const successor of request.sucesores)
    await addSuccessor(session, successor)
}
