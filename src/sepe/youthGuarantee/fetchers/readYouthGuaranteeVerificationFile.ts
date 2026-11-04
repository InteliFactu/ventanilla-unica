import { readFile } from 'node:fs/promises'

export const readYouthGuaranteeVerificationFile = async (
  path: string,
): Promise<string> => {
  try {
    // The owner supplies the local handoff path; never include its contents in errors.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return (await readFile(path, 'utf8')).trim()
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return ''
    // Raw filesystem errors may disclose a sensitive handoff path.
    // eslint-disable-next-line preserve-caught-error
    throw new Error(
      'Garantía Juvenil: cannot read verification file; no automatic retry',
    )
  }
}
