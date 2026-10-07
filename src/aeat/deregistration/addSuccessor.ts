import { clickUuid } from '../taxAddress/clickUuid'
import type { M036Session } from '../taxAddress/types/M036Session'
import { findDeclaredUuid } from './parsers/findDeclaredUuid'
import { findSuccessorNewButton } from './parsers/findSuccessorNewButton'
import { readSuccessorError } from './parsers/readSuccessorError'
import { typeIntoDeclared } from './typeIntoDeclared'
import type { Successor } from './types/Successor'

/** Add one row to "13. Relación de sucesores" through its popup; refuses on the popup's error. */
export const addSuccessor = async (
  session: M036Session,
  successor: Successor,
): Promise<void> => {
  await clickUuid(session, findSuccessorNewButton(session.html))
  await typeIntoDeclared(session, 'SUCESORES_NIF', successor.nif)
  await typeIntoDeclared(session, 'SUCESORES_NOMBRE', successor.nombre)
  await typeIntoDeclared(
    session,
    'SUCESORES_PORCENTAJE_LPH',
    successor.porcentaje,
  )
  await typeIntoDeclared(session, 'SUCESORES_CUOTA_LPH', successor.cuota)
  const saved = await clickUuid(
    session,
    findDeclaredUuid(session.blobs, 'botonGuardarSucesor'),
  )
  const error = readSuccessorError(saved)
  if (error)
    throw new Error(
      `AEAT: the 036 refused sucesor ${successor.nif} (${error}); nothing was filed`,
    )
}
