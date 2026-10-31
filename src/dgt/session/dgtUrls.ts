/** The DGT sede addresses the Mi DGT commands use. */
export const dgtUrls = {
  origin: 'https://sede.dgt.gob.es',
  /** "Mis datos de contacto y suscripciones": protected, answers 401 with the Cl@ve SAML form until logged in. */
  subscriptionsPage: 'https://sede.dgt.gob.es/es/mi_dgt/mis-suscripciones/',
  /** The contact data (SAVI subscription) the page fills itself with. */
  saviSubscription:
    'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/functions/mi_dgt/componentes/service_savi_suscripcion.jsp',
  /** "Cambio de domicilio" (CDI): protected like the other Mi DGT pages. */
  addressChangePage:
    'https://sede.dgt.gob.es/es/servicios-sede/cambio-de-direccion/',
  /** The lookups the CDI page fills its address selects with (street types, streets, provinces, municipalities, localities). */
  addressLookup:
    'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/functions/mi_dgt/componentes/service_sadd.jsp',
  /** The CDI act: `{nifTitular, domicilioNuevo, tramite: 'CDI', token}`. */
  addressChangeAct:
    'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/functions/mi_dgt/componentes/service_cond.jsp',
  /** The registry entry (asunto `SCDCB`) that yields the CDI justificante. */
  addressChangeRegistry:
    'https://sede.dgt.gob.es/system/modules/es.trafico.dgt.sedeV5/functions/mi_dgt/componentes/service_rele.jsp',
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
