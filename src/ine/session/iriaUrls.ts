/**
 * IRIA, the INE's survey portal. The Cl@ve button answers a JSF partial
 * redirect to the INE's own authentication front (`servicios.ine.es`), which
 * relays to the Cl@ve pasarela and back to the portal.
 */
export const iriaUrls = {
  home: 'https://iria.ine.es/iriaPortal/contents/index.jsf',
  questionnaires: 'https://iria.ine.es/iriaPortal/contents/cuestionarios.jsf',
  claveOrigin: 'https://pasarela.clave.gob.es',
  certificateIdp: 'AFIRMA',
} as const
