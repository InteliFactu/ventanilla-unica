import type { PresentationCheck } from '../types/PresentationCheck'

/** The lines a holder reads before confirming: what the form will settle, and who signs for whom. */
export const presentationPlan = (check: PresentationCheck): string[] => [
  `resultado ${check.resultado}, forma de pago ${check.formaDePago}`,
  `signed by ${check.signer} on behalf of ${check.onBehalfOf}`,
]
