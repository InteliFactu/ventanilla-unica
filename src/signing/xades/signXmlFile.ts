import { basename } from 'node:path'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { facturaeProfile } from './facturaeProfile'
import { readContentFile } from './fetchers/readContentFile'
import { signXmlFileNotes } from './mappers/signXmlFileNotes'
import { parseOptionalXml } from './parsers/parseOptionalXml'
import { signXml } from './signXml'
import type { SignXmlFileRequest } from './types/SignXmlFileRequest'
import type { SignXmlFileResult } from './types/SignXmlFileResult'
import { writeSignedFile } from './writeSignedFile'

/** Sign `--in` with the holder's certificate and write the result to `--out`. */
export const signXmlFile = async (
  request: SignXmlFileRequest,
  identity: CertificateIdentity,
): Promise<SignXmlFileResult> => {
  const content = await readContentFile(request.input)
  const result = signXml(identity, content, {
    mode: request.mode,
    ...(request.policy === 'facturae' ? facturaeProfile : {}),
    ...(request.mode === 'detached'
      ? { detachedUri: basename(request.input) }
      : {}),
  })
  await writeSignedFile(request.output, result.xml)
  return {
    out: request.output,
    mode: result.mode,
    policy: request.policy,
    signatureId: result.signatureId,
    bytes: result.xml.length,
    signer: result.signer,
    notes: signXmlFileNotes(request, parseOptionalXml(content) !== undefined),
  }
}
