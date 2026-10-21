import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** Preserve the portal response privately before interpreting reservation success. */
export const writeAppointmentReceipt = async (
  directory: string,
  html: string,
): Promise<string> => {
  // The output directory is the holder's explicit choice.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await mkdir(directory, { recursive: true })
  const path = join(directory, `aeat-appointment-${String(Date.now())}.html`)
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(path, html, { mode: 0o600, flag: 'wx' })
  return path
}
