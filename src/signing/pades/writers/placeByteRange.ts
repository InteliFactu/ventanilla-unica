import { byteRangePlaceholder } from '../byteRangePlaceholder'
import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'

/** Find the placeholders of the signature written at or after `from` and fill its /ByteRange around /Contents. */
export const placeByteRange = (
  file: Buffer,
  from: number,
): PreparedPdfSignature => {
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
  return { file: out, contentsAt, contentsEnd }
}
