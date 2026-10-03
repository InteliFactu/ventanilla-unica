/** The caveats `rolece estado` attaches to its answer. */
export const mapRoleceStatusNotes = (
  registered: boolean,
  pending: boolean,
  outDir: string | undefined,
): readonly string[] => [
  'ROLECE lists no applications: the state of a filed one arrives by e-mail (a notification link) and in its justificante.',
  ...(registered || pending
    ? []
    : [
        'Not inscribed: `rolece solicitud` files the initial application (Solicitud Simplificada for a Spanish sociedad mercantil).',
      ]),
  ...(pending
    ? [
        'An application is pending: ROLECE waits for the Registro Mercantil to e-mail the nota registral to notasregistrales@patrimoniodelestado.es (ask registradores.org within 10 days of filing). Do not file again.',
      ]
    : []),
  ...(outDir === undefined
    ? []
    : [
        registered
          ? 'Not downloaded: the portal asks a captcha (`/rolece/public/captcha.action`) before viewing or downloading a certificate; download it in the browser.'
          : 'Nothing to download: there is no certificate for an operator that is not inscribed.',
      ]),
]
