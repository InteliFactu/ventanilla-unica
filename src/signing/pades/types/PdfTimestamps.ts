import type { TimestampAuthority } from '../../tsp/types/TimestampAuthority'

/** The timestamps a PAdES signature gets: inside its CMS (AutoFirma `tsType` 1), over the document before it (2), or both (3). */
export type PdfTimestamps = {
  readonly timestamp?: TimestampAuthority | undefined
  readonly documentTimestamp?: TimestampAuthority | undefined
}
