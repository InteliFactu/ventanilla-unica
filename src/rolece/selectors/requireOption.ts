import { readSelectOptions } from '../../html/parsers/readSelectOptions'
import { selectOptionByLabel } from '../../html/selectors/selectOptionByLabel'
import type { SelectOption } from '../../html/types/SelectOption'

/**
 * The option of the page's `<select name>` that `wanted` names, taken from
 * what the portal offers today rather than a copied list; an unknown name is
 * an error that lists the choices.
 */
export const requireOption = (
  html: string,
  select: string,
  wanted: string,
): SelectOption => {
  const options = readSelectOptions(html, select).filter(
    (option) => option.value !== '00',
  )
  const option = selectOptionByLabel(options, wanted)
  if (!option)
    throw new Error(
      `ROLECE: "${wanted}" is not one of the ${select} choices: ${options.map((choice) => choice.label).join(', ') || 'none on the page'}`,
    )
  return option
}
