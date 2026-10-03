import { normalizeLabel } from '../mappers/normalizeLabel'
import type { SelectOption } from '../types/SelectOption'

/** The option whose label or value equals `wanted`, ignoring case and accents, or undefined. */
export const selectOptionByLabel = (
  options: readonly SelectOption[],
  wanted: string,
): SelectOption | undefined => {
  const key = normalizeLabel(wanted)
  return options.find(
    (option) =>
      normalizeLabel(option.label) === key ||
      normalizeLabel(option.value) === key,
  )
}
