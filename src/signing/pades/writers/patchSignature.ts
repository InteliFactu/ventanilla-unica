import { createHash } from 'node:crypto'

import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { buildSignedData } from '../../cms/buildSignedData'
import type { DetachedSignedDataOptions } from '../../cms/types/DetachedSignedDataOptions'
import { byteRangePlaceholder } from '../byteRangePlaceholder'

/**
 * Fill the placeholders of the signature written at or after `from`: the
 * /ByteRange around /Contents, then the CMS over those two ranges.
 */
export const patchSignature = (
  file: Buffer,
  identity: CertificateIdentity,
  from: number,
  cms: DetachedSignedDataOptions,
): Buffer => {
  const rangeAt = file.indexOf(
    `/ByteRange ${byteRangePlaceholder}`,
    from,
    'latin1',
  )
  const contentsAt =
    file.indexOf('/Contents <', rangeAt, 'latin1') + '/Contents '.length
  const contentsEnd = file.indexOf('>', contentsAt, 'latin1') + 1
  if (rangeAt === -1 || contentsEnd <= contentsAt)
    throw new Error('signature placeholders not found')
  const pad = (value: number): string => String(value).padStart(10, '0')
  const ranges = `[0 ${pad(contentsAt)} ${pad(contentsEnd)} ${pad(file.length - contentsEnd)}]`
  const out = Buffer.from(file)
  out.write(ranges, rangeAt + '/ByteRange '.length, 'latin1')
  const digest = createHash(cms.digest)
    .update(out.subarray(0, contentsAt))
    .update(out.subarray(contentsEnd))
    .digest()
  const hex = buildSignedData(identity, digest, cms)
    .toString('hex')
    .toUpperCase()
  if (hex.length > contentsEnd - contentsAt - 2)
    throw new Error('CMS larger than the /Contents placeholder')
  out.write(hex, contentsAt + 1, 'latin1')
  return out
}
