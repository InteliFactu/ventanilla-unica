import type { ImportassPersonalData } from './ImportassPersonalData'

/** What the page shows after saving, read again, so the change is proven rather than assumed. */
export type ContactReceipt = {
  readonly after: Pick<ImportassPersonalData, 'landline' | 'mobile' | 'email'>
}
