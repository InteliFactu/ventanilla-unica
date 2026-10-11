import type { DgtAddress } from './DgtAddress'

/** Who the DGT says the holder is, and where it notifies them by post. */
export type DgtAtexHolder = {
  readonly nif: string
  readonly nombre: string
  readonly direccionNotificaciones?: DgtAddress | undefined
}
