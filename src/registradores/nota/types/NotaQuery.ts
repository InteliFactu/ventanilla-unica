import type { NotaSegment } from './NotaSegment'

/** What `registradores nota` needs beyond what the sede and the certificate give. */
export type NotaQuery = {
  readonly nif: string
  /** Every e-mail field of the form; the nota is sent there. */
  readonly email: string
  readonly telefono: string
  /** The billing address; required only to order. */
  readonly direccion?: string | undefined
  readonly codigoPostal?: string | undefined
  /** The billing town; the registry's city when absent. */
  readonly municipio?: string | undefined
  readonly segments: readonly NotaSegment[]
  readonly irpfRetention: boolean
  readonly outDir?: string | undefined
}
