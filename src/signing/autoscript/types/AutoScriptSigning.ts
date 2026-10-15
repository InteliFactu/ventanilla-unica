import type { TimestampPost } from '../../tsp/types/TimestampPost'
import type { ExtraParams } from './ExtraParams'

/** An AutoScript call's decoded inputs, and how to reach a TSA when it asks for a timestamp. */
export type AutoScriptSigning = {
  readonly data: Buffer
  readonly format: string
  readonly params: ExtraParams
  readonly post: TimestampPost
}
