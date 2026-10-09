import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { signPdf } from '../../../signing/pades/signPdf'

/**
 * Sign a local PDF in memory and throw the result away: a file the PAdES
 * writer cannot parse is refused in plan mode rather than half-way through a
 * confirmed filing. The sede returns its own copy for signing, so a
 * confirmed run signs that one.
 */
export const assertPdfSignable = async (
  identity: CertificateIdentity,
  path: string,
): Promise<void> => {
  // path is the holder's own --documentos choice, not attacker input.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const pdf = await readFile(path)
  try {
    signPdf(identity, pdf)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(
      `${basename(path)} cannot be PAdES-signed here: ${reason}`,
      {
        cause: error,
      },
    )
  }
}
