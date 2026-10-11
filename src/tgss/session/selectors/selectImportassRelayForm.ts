import type { HtmlForm } from '../../../html/types/HtmlForm'

/**
 * The form the Importass login posts next: the portal's own `loginFormSubmit`
 * form or a SAML hop. The PGIS chooser page also carries language and "volver"
 * forms, which must never be posted.
 */
export const selectImportassRelayForm = (
  forms: readonly HtmlForm[],
): HtmlForm | undefined =>
  forms.find((form) =>
    Object.keys(form.fields).some((name) =>
      ['SAMLRequest', 'SAMLResponse', 'loginFormSubmit'].includes(name),
    ),
  )
