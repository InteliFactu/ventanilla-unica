import { readYouthGuaranteeInputDefaults } from './readYouthGuaranteeInputDefaults'
import { readYouthGuaranteeSelectDefaults } from './readYouthGuaranteeSelectDefaults'

/**
 * What a browser sends for the wizard's controls left untouched. The portal
 * answers "Error en la aplicación" when optional selects are missing entirely.
 */
export const readYouthGuaranteeDefaults = (
  block: string,
): Record<string, string> => ({
  ...readYouthGuaranteeInputDefaults(block),
  ...readYouthGuaranteeSelectDefaults(block),
})
