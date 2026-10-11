/**
 * Read why a SEPE service page is not the service. After a successful Cl@ve
 * relay the sede can still land on `GesUsuariosSEDE/.../error.jsp` with an
 * `errorcode=[TSEG_...]` (seen with TSEG_4003011, "error en el sistema", for
 * every holder at once), or serve the service URL itself with the notice "EL
 * SITIO AL QUE INTENTA ACCEDER NO SE ENCUENTRA DISPONIBLE": both are the
 * sede's maintenance answers, not a login fault.
 */
export const readSepeOutage = (
  url: string,
  text: string,
): string | undefined => {
  const code = /errorcode=\[?([A-Z]+_\d+)\]?/.exec(url)?.[1]
  if (code) return code
  return text.toUpperCase().includes('NO SE ENCUENTRA DISPONIBLE')
    ? 'sitio no disponible'
    : undefined
}
