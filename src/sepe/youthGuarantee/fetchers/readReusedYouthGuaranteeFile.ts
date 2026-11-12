import { validateYouthGuaranteeHandoffValue } from '../validators/validateYouthGuaranteeHandoffValue'
import { readYouthGuaranteeVerificationFile } from './readYouthGuaranteeVerificationFile'

export const readReusedYouthGuaranteeFile = async (
  path: string,
  kind: 'pin' | 'link',
): Promise<string> => {
  const value = await readYouthGuaranteeVerificationFile(path)
  if (!value)
    throw new Error(
      `Garantía Juvenil: reutilizar needs the still-valid ${kind} in its file; it is absent or empty. Nothing was sent.`,
    )
  return validateYouthGuaranteeHandoffValue(value, kind)
}
