import { certificateNifs } from '../../../certificate/certificateNifs'
import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { nifKindOf } from '../../../tools/nif/mappers/nifKindOf'

/** Validate the requested holder or prefer the entity named by a representative certificate. */
export const selectDehuListingNif = (
  requested: string | undefined,
  identity: CertificateIdentity | undefined,
): string | undefined => {
  if (requested !== undefined) {
    const normalized = requested.trim().toUpperCase()
    if (nifKindOf(normalized) === 'desconocido')
      throw new Error('--nif must be a Spanish personal or entity tax ID')
    return normalized
  }
  if (identity === undefined) return undefined
  const nifs = certificateNifs(identity)
  return nifs.find((nif) => nifKindOf(nif) === 'persona-juridica') ?? nifs[0]
}
