/**
 * Tu Seguridad Social, the INSS citizen portal (IBM WebSphere Portal, same
 * PGIS/IPCE login as Importass). `entry` is the "Entrar como Interesado" link;
 * `personalData` the "Tus datos" page, whose contact block renders the mobile
 * and the e-mail in read-only inputs.
 */
export const tussUrls = {
  entry: 'https://sede-tu.seg-social.gob.es/wps/myportal/tussR/tuss/Inicio/',
  personalData:
    'https://sede-tu.seg-social.gob.es/wps/myportal/tussR/tuss/DatosPersonales/Datos/',
  host: 'sede-tu.seg-social.gob.es',
} as const
