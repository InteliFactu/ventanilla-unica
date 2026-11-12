import { isYouthGuaranteeRowField } from './isYouthGuaranteeRowField'

/** Posting the select alone does not add the row the portal expects. */
export const validateYouthGuaranteeRowAnswer = (
  step: number,
  name: string,
): void => {
  if (isYouthGuaranteeRowField(step, name))
    throw new Error(
      `Garantía Juvenil: ${name} on step ${String(step)} only fills an add-row sub-flow this command does not drive; posting it would not add the row. Add the row in the portal first.`,
    )
}
