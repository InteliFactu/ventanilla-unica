import type { FormPair } from '../../../http/types/FormPair'
import type { RelecForm } from '../types/RelecForm'

/**
 * The form's own hidden inputs, in the order the browser posted them on
 * 2026-10-09, with `SELECTED_PERSON` set to the represented entity as
 * `changeRepresentado()` does; `OriginConsent` is `false` once the script ran.
 */
export const buildHeadPairs = (
  form: RelecForm,
  person: string,
): readonly FormPair[] => {
  const field = (name: string): FormPair => [name, form.fields[name] ?? '']
  return [
    ...[
      'solicitudname',
      'solicituddesc',
      'DBOIDPERS',
      'dboidRequest',
      'book',
      'regOrg',
      'subject',
      'ssubject',
      'pattern',
      'regUO',
      'regRole',
      'institucion',
      'shibbolet',
    ].map(field),
    ['OriginConsent', form.fields['OriginConsent'] || 'false'],
    field('url'),
    field('urlBack'),
    field('procDboid'),
    ['SELECTED_PERSON', person],
    field('showApplet'),
    field('navigatorMode'),
  ]
}
