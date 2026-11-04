import type { RelecForm } from '../types/RelecForm'

/** Refuse a stale or redirected form before preparing an own-name filing. */
export const assertRelecTramiteForm = (
  form: RelecForm,
  dboid: string,
): void => {
  if (form.fields['dboidRequest'] !== dboid)
    throw new Error(
      'the sede opened a different procedure; nothing was prepared',
    )
  if (!/^\d+$/.test(form.fields['DBOIDPERS'] ?? ''))
    throw new Error('the form carries no certificate holder person id')
}
