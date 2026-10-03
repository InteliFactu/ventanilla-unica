/**
 * ROLECE (Registro Oficial de Licitadores y Empresas Clasificadas del Sector
 * Público) entry points. The certificate names only the bare host:
 * `www.registrodelicitadores.gob.es` fails the TLS name check.
 */
export const roleceUrls = {
  login: 'https://registrodelicitadores.gob.es/rolece/public/login.action',
  home: 'https://registrodelicitadores.gob.es/rolece/public/iniciologin.action',
  legalEntityForm:
    'https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaJ.action',
  applicationForm:
    'https://registrodelicitadores.gob.es/rolece/comun/inscripcionPersonaF.action',
  certificateSearch:
    'https://registrodelicitadores.gob.es/rolece/public/visualizarCertificados.action',
  claveOrigin: 'https://pasarela.clave.gob.es',
  certificateIdp: 'AFIRMA',
} as const
