import { validateYouthGuaranteeHandoffValue } from '../validators/validateYouthGuaranteeHandoffValue'
import { readYouthGuaranteeVerificationFile } from './readYouthGuaranteeVerificationFile'

/** Missing or empty files are pending; malformed input is never submitted.
 * Callers must prove the file empty before the request so any value is fresh. */
export const waitForYouthGuaranteeFile = async (
  path: string,
  kind: 'pin' | 'link',
): Promise<string> => {
  const deadline = Date.now() + 30 * 60 * 1000
  while (Date.now() <= deadline) {
    const value = await readYouthGuaranteeVerificationFile(path)
    if (value) return validateYouthGuaranteeHandoffValue(value, kind)
    if (Date.now() >= deadline) break
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 5000)
    })
  }
  throw new Error(
    `Garantía Juvenil: timed out after 30 minutes waiting for the ${kind} file; inspect the portal before retrying`,
  )
}
