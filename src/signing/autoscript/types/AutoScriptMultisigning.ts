import type { DigestName } from '../../types/DigestName'
import type { AutoScriptSigning } from './AutoScriptSigning'

/** A `coSign` or `counterSign` call decoded: `data` is the existing signature, `content` the detached data a cosignature may need. */
export type AutoScriptMultisigning = AutoScriptSigning & {
  readonly operation: 'cosign' | 'countersign'
  readonly content: Buffer
  readonly digest: DigestName
}
