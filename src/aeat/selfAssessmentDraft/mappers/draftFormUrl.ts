import { draftSimulatorBaseUrl } from '../draftSimulatorBaseUrl'
import { draftAppPath } from './draftAppPath'

/** The open simulator page of one model and exercise: no certificate, no Cl@ve, nothing to present. */
export const draftFormUrl = (modelo: string, ejercicio: string): string =>
  `${draftSimulatorBaseUrl}${draftAppPath(modelo)}/E${ejercicio}/OPEN/index.zul`
