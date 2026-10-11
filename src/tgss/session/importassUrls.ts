/**
 * Importass, the Seguridad Social's citizen portal (IBM WebSphere Portal).
 * `entry` is the certificate redirector its own login uses; `personalData` the
 * "Tus datos personales" page, server-rendered with its edit forms.
 */
export const importassUrls = {
  entry:
    'https://portal.seg-social.gob.es/wps/portal/importass/Seguridad/PortalRedirectorN1P?idApp=2806&N1&P',
  personalData:
    'https://portal.seg-social.gob.es/wps/myportal/importass/importass/tramites/datospersonales',
  host: 'portal.seg-social.gob.es',
} as const
