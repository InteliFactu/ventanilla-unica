/** The `hashToken` of a confirmation link (`.../verificarCorreo?hashToken=...`), or the bare token itself. */
export const readHashToken = (link: string): string => {
  const token = link.startsWith('https://')
    ? new URL(link).searchParams.get('hashToken')
    : link
  if (!token) throw new Error('--enlace carries no hashToken')
  return token
}
