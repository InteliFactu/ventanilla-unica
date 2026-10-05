import type { DgsfpAttachment } from './DgsfpAttachment'
import type { DgsfpFormValues } from './DgsfpFormValues'
import type { DgsfpPlace } from './DgsfpPlace'
import type { DgsfpSession } from './DgsfpSession'

/** Everything the read-only preparation produced: the session, the files, the filled form and its unsigned request document. */
export type DgsfpPreparedComplaint = {
  readonly session: DgsfpSession
  readonly numTelematico: string
  readonly place: DgsfpPlace
  readonly files: readonly DgsfpAttachment[]
  readonly values: DgsfpFormValues
  readonly datosFormulario: string
  readonly document: Buffer
}
