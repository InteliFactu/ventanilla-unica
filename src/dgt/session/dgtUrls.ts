/** The DGT sede addresses the Mi DGT commands use. */
export const dgtUrls = {
  origin: 'https://sede.dgt.gob.es',
  /** "Mis datos de contacto y suscripciones": protected, answers 401 with the Cl@ve SAML form until logged in. */
  subscriptionsPage: 'https://sede.dgt.gob.es/es/mi_dgt/mis-suscripciones/',
  /** The contact data (SAVI subscription) the page fills itself with. */
  saviSubscription:
    'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/functions/mi_dgt/componentes/service_savi_suscripcion.jsp',
  /** Holder identity and notification address (ATEX), as the address-change service reads them. */
  atex: 'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/functions/mi_dgt/componentes/service_atex.jsp',
  /** The Mi DGT home; its counters answer only once the session has loaded it. */
  miDgtHome: 'https://sede.dgt.gob.es/es/mi_dgt/',
  /** The counters the Mi DGT home fills itself with, one `?<name>=true` call each. */
  miDgtCounters:
    'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/elements/mi_dgt/ajaxCalls.jsp',
  /** "Mis vehiculos": the vehicles registered to the holder, server-rendered in `table.tabla-vehiculos`. */
  vehiclesPage: 'https://sede.dgt.gob.es/es/mi_dgt/mis-vehiculos/',
  /** "Mis sanciones": the holder's fines, server-rendered in `#datatable_sanciones`. */
  sanctionsPage: 'https://sede.dgt.gob.es/es/mi_dgt/mis-sanciones/',
  /** One fine's detail page, `?numExpediente=<n>&a=`. */
  sanctionDetail:
    'https://sede.dgt.gob.es/es/mi_dgt/mis-sanciones/detalle-sancion/',
  certificateIdp: 'AFIRMA',
  claveOrigin: 'https://pasarela.clave.gob.es',
} as const
