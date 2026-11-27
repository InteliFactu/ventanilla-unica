/** Parse a published SRAF amount as exact cents before checking the components. */
export const parseAgreementAmountCents = (value: string): number => {
  if (!/^(?:\d{1,13}|\d{1,3}(?:\.\d{3}){1,3}),\d{2}$/.test(value))
    throw new Error('Unexpected amount on an AEAT instalment calendar row')
  return Number(value.replaceAll(/[.,]/g, ''))
}
