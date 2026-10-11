import type { HtmlForm } from '../../../html/types/HtmlForm'
import type { ImportassPersonalData } from './ImportassPersonalData'

/** The parsed page together with the two edit forms a change would post. */
export type PersonalDataPage = {
  readonly data: ImportassPersonalData
  readonly contactForm: HtmlForm
  readonly addressForm: HtmlForm
}
