/**
 * Centro de Salud Online, the Servicio Extremeño de Salud citizen portal (JSF
 * and PrimeFaces). `certificateLogin` asks for the client certificate and
 * answers 302 with the session cookie, redirecting to the plain-HTTP home, so
 * the login stops at that 302; `personalData` is "Mis datos", whose contact
 * tab renders e-mail and phones in spans with fixed ids.
 */
export const sesUrls = {
  certificateLogin: 'https://saludextremadura.ses.es/csonline/cert/inicio',
  personalData:
    'https://saludextremadura.ses.es/csonline/auf/datosPersonales/datosPersonales.xhtml',
} as const
