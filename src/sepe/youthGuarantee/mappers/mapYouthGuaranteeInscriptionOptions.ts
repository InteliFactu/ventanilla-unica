import type { YouthGuaranteeInscriptionOptions } from '../types/YouthGuaranteeInscriptionOptions'

/** Preserve the public API's positional output-directory argument. */
export const mapYouthGuaranteeInscriptionOptions = (
  options: string | YouthGuaranteeInscriptionOptions,
): YouthGuaranteeInscriptionOptions =>
  typeof options === 'string' ? { out: options } : options
