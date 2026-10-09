import type { StaGateButton } from '../types/StaGateButton'

/**
 * The confirming step the gate offers next: save the contact data
 * (`PERSCONTACT_ADD`, "Guardar"), say they are right (`PERSCONTACT_YES`,
 * "SÍ"), or accept the identification data ("Aceptar"). Never "NO" or
 * "Modificar"; `undefined` when none is on the page.
 */
export const selectGateStep = (
  buttons: readonly StaGateButton[],
): StaGateButton | undefined =>
  buttons.find((button) => button.action === 'PERSCONTACT_ADD') ??
  buttons.find((button) => button.action === 'PERSCONTACT_YES') ??
  buttons.find((button) => /^aceptar$/i.test(button.label))
