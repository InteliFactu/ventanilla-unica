import type { Model303Envelope } from '../types/Model303Envelope'
import type { Model303Page } from '../types/Model303Page'
import { validateModel303FuelCode } from './validateModel303FuelCode'
import { validateModel303Identification } from './validateModel303Identification'
import { validateModel303OptionalPage } from './validateModel303OptionalPage'
import { validateModel303PeriodCodes } from './validateModel303PeriodCodes'
import { validateModel303ProrataPercentages } from './validateModel303ProrataPercentages'
import { validateModel303ResultPeriod } from './validateModel303ResultPeriod'
import { validateModel303Surcharge } from './validateModel303Surcharge'

/** Checks declared by the individual workbook tabs beyond field widths. */
export const validateModel303PageContent = (
  page: Model303Page,
  envelope: Model303Envelope,
): readonly string[] => {
  const {
    layout: { tag },
    text,
  } = page
  switch (tag) {
    case '01000':
      return [
        ...validateModel303Identification(text, envelope),
        ...validateModel303PeriodCodes(text, envelope),
        ...validateModel303FuelCode(text, envelope),
        ...validateModel303Surcharge(text, envelope.ejercicio),
      ]
    case '03000':
      return validateModel303ResultPeriod(text, envelope)
    case '04000':
      return validateModel303OptionalPage(page)
    case '05000':
      return [
        ...validateModel303OptionalPage(page),
        ...validateModel303ProrataPercentages(text, envelope.ejercicio),
      ]
    default:
      return []
  }
}
