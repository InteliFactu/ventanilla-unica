/**
 * PLACSP (Plataforma de Contratación del Sector Público) entry points. The
 * portal answers on both hosts; `contrataciondelsectorpublico.gob.es` only
 * redirects to `contrataciondelestado.es/wps/portal/plataforma`.
 */
export const placspUrls = {
  registration: 'https://contrataciondelestado.es/wps/portal/registrarse',
  companies: 'https://contrataciondelestado.es/wps/portal/plataforma/empresas',
  tenderDeeplink:
    'https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&idEvl=',
  hosts: ['contrataciondelestado.es', 'contrataciondelsectorpublico.gob.es'],
} as const
