import type { DgsfpAttachment } from './DgsfpAttachment'
import type { DgsfpPlace } from './DgsfpPlace'

/** The place, attachments and telematic number a complaint plan describes. */
export type DgsfpComplaintFacts = {
  readonly place: DgsfpPlace
  readonly files: readonly DgsfpAttachment[]
  readonly numTelematico: string
}
