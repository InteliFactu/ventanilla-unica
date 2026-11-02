import type { ActivitiesRequest } from './types/ActivitiesRequest'

/** The steps `aeat actividades` would run; plan mode sends no request at all. */
export const planActivities = (
  request: ActivitiesRequest,
): readonly string[] => [
  `GET BU36-M036/MOD036/index.zul: a fresh 036 for ${request.nif} (refused unless the form names it).`,
  'Tick casilla 127 (modificación de actividades económicas).',
  ...request.actividades.map(
    (activity) =>
      `Page 4 alta: ${activity.tipo} sección ${activity.seccion} epígrafe ${activity.epigrafe} "${activity.descripcion}", outside a fixed premises in ${request.municipio} (${request.provincia}) from ${request.fecha}.`,
  ),
  `Sign in ${request.lugar} as ${request.firmado} (${request.calidad}).`,
  'Validar declaración: any AEAT error stops here, before the signature.',
  'Firmar y Enviar, accept the submission and echo onPresenvali: the 036 is filed and the activities are registered in the censo from that date.',
]
