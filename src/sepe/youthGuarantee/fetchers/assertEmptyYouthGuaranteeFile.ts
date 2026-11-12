import { readYouthGuaranteeVerificationFile } from './readYouthGuaranteeVerificationFile'

/** A value already present predates the new request and would be submitted as stale. */
export const assertEmptyYouthGuaranteeFile = async (
  path: string,
  kind: 'pin' | 'link',
): Promise<void> => {
  if (await readYouthGuaranteeVerificationFile(path))
    throw new Error(
      `Garantía Juvenil: the ${kind} file must be absent or empty before a new request; empty it, or pass reutilizar to submit the still-valid value it holds. Nothing was sent.`,
    )
}
