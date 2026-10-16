/**
 * sede.registradores.org entry points. The sede runs two SAML service
 * providers behind one IdP (`sso.registradores.org`): the F5 front
 * (`api-sede-pub-auth`), where the certificate is presented, and the legacy
 * `site` application that sells the notas. The relative paths resolve
 * against `site`.
 */
export const registradoresUrls = {
  certificateLogin:
    'https://api-sede-pub-auth.registradores.org/sede-corpme-core/api/v1/ui-link/login-certificado',
  notaEntry: 'https://sede.registradores.org/site/sede/secure/mercantil/nota',
  site: 'https://sede.registradores.org/site/',
} as const
