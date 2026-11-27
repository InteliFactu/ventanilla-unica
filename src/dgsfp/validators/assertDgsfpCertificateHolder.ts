import { certificateNifs } from '../../certificate/certificateNifs'
import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { DgsfpHolder } from '../types/DgsfpHolder'

/** Bind private DGSFP lookups to the certificate used to log in. */
export const assertDgsfpCertificateHolder = (
  identity: CertificateIdentity,
  holder: DgsfpHolder,
): void => {
  const holderNif = holder.identificador.trim().toUpperCase()
  if (!certificateNifs(identity).includes(holderNif)) {
    throw new Error(
      'DGSFP: the authenticated holder does not match the certificate',
    )
  }
}
