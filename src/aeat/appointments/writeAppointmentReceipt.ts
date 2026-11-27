import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { appointmentManagementUrl } from './appointmentManagementUrl'

/** Preserve the portal response privately before interpreting reservation success. */
export const writeAppointmentReceipt = async (
  directory: string,
  html: string,
): Promise<string> => {
  const path = join(directory, `aeat-appointment-${String(Date.now())}.html`)
  try {
    // The output directory is the holder's explicit choice.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await mkdir(directory, { recursive: true })
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await writeFile(path, html, { mode: 0o600, flag: 'wx' })
  } catch (cause) {
    throw new Error(
      `The appointment request was sent, but its receipt could not be saved. Check the appointment status before retrying: ${appointmentManagementUrl}`,
      { cause },
    )
  }
  return path
}
