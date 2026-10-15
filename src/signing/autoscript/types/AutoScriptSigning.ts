import type { ExtraParams } from './ExtraParams'

/** An AutoScript call's decoded inputs. */
export type AutoScriptSigning = {
  data: Buffer
  format: string
  params: ExtraParams
}
