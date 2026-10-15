/** The Carpeta Justicia addresses the `justicia` commands use. */
export const justiciaUrls = {
  origin: 'https://carpeta.justicia.es',
  /** Liferay's login, which bounces through `selfservice-ext` to the Cl@ve SAML request. */
  login: 'https://carpeta.justicia.es/c/portal/login',
  expedientes: 'https://carpeta.justicia.es/group/guest/expedientes',
  visorAjax:
    'https://eje.justicia.es/visor-webapp/plantillaMatriz/AjaxResolver?tipo=accesoExternoEje',
  visorDocument:
    'https://eje.justicia.es/visor-webapp/externoEjeControllerDocument',
  certificateIdp: 'AFIRMA',
  claveOrigin: 'https://pasarela.clave.gob.es',
} as const
