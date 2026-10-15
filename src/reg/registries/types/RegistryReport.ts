import type { RegistryDetail } from './RegistryDetail'
import type { RegistryTrace } from './RegistryTrace'

/** One entry: its data and documents, its exchange trace, and the paths saved under `--out`. */
export type RegistryReport = {
  readonly registry: RegistryDetail['registryData']
  readonly documents: RegistryDetail['document']
  readonly trace: RegistryTrace['annotations']
  readonly saved: readonly string[]
}
