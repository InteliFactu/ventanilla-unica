/**
 * Whether a host belongs to one of the administrations this client talks to.
 * The certificate is presented on every handshake, so a redirect must never
 * take it to a host outside this list.
 */
export const isAdministrationHost = (host: string): boolean => {
  const domains = [
    'gob.es',
    'agenciatributaria.es',
    'seg-social.es',
    'redsara.es',
    'oargt.es',
    'bde.es',
    'juntaex.es',
    'caceres.es',
    'gobex.es',
    'contrataciondelestado.es',
  ]
  const name = host.toLowerCase()
  return domains.some(
    (domain) => name === domain || name.endsWith(`.${domain}`),
  )
}
