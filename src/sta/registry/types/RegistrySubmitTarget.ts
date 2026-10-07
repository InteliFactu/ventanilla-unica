import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import type { RegistrySession } from './RegistrySession'
import type { RegistrySlot } from './RegistrySlot'

/** What a submission acts on: the draft session, the attachment slot and the signing identity. */
export type RegistrySubmitTarget = {
  readonly session: RegistrySession
  readonly slot: RegistrySlot
  readonly identity: CertificateIdentity
}
