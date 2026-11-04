import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Owner-only files; exclusive creation preserves an earlier certificate. */
export const writeYouthGuaranteePdf = async (
  out: string,
  index: number,
  pdf: Buffer,
): Promise<string> => {
  if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-')))
    throw new Error(
      'Garantía Juvenil: the offered document is not a PDF; nothing was saved',
    )
  // The directory is the holder's explicit --out choice.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(out, { recursive: true, mode: 0o700 })
  const path = join(out, `sepe-garantia-juvenil-${String(index)}.pdf`)
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, pdf, { mode: 0o600, flag: 'wx' })
  return path
}
