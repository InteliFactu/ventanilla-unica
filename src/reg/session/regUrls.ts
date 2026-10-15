/**
 * The Registro Electrónico General (REG, formerly REC) of the AGE: an Angular
 * front at `reg.redsara.es` over a JSON API at `reg-api.redsara.es`, whose
 * endpoints are listed in the public `/config/config.json`. Login and the
 * page's certificate signature both go through Cl@ve.
 */
export const regUrls = {
  origin: 'https://reg.redsara.es',
  api: 'https://reg-api.redsara.es/',
  front: 'reg.redsara.es',
  clave: 'https://pasarela.clave.gob.es/Proxy2/ServiceProvider',
  claveOrigin: 'https://pasarela.clave.gob.es',
  certificateIdp: 'AFIRMA',
} as const
