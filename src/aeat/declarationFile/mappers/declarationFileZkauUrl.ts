import { presentationBaseUrl } from '../../selfAssessmentDraft/presentationBaseUrl'
import { declarationFileAppPath } from './declarationFileAppPath'

/** The ZK update endpoint of the "Envío Fichero" page, under `iwda` rather than the forms' `pwda`. */
export const declarationFileZkauUrl = (modelo: string): string =>
  `${presentationBaseUrl}${declarationFileAppPath(modelo)}/iwda/zkau`
