/** The caveats `rolece estado` attaches to its answer. */
export const mapRoleceStatusNotes = (
  registered: boolean,
  outDir: string | undefined,
): readonly string[] => [
  'ROLECE lists no applications: the state of a filed one arrives by e-mail (a notification link) and in its justificante.',
  ...(registered
    ? []
    : [
        'Not inscribed: `rolece solicitud` plans the initial application (Solicitud Simplificada for a Spanish sociedad mercantil).',
      ]),
  ...(outDir === undefined
    ? []
    : [
        registered
          ? 'Not downloaded: the portal asks a captcha (`/rolece/public/captcha.action`) before viewing or downloading a certificate; download it in the browser.'
          : 'Nothing to download: there is no certificate for an operator that is not inscribed.',
      ]),
]
