import type { CadesSignedDataOptions } from './CadesSignedDataOptions'

/** The knobs of a CAdES cosignature: those of a first signature but the mode, which the existing CMS fixes. */
export type CadesCosignOptions = Omit<CadesSignedDataOptions, 'mode'> & {
  /** The signed content, required when the CMS is detached; checked against it when implicit. */
  readonly content?: Buffer | undefined
}
