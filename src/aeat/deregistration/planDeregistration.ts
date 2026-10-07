import type { DeregistrationRequest } from './types/DeregistrationRequest'

/** The steps `aeat baja` would run; plan mode sends no request at all. */
export const planDeregistration = (
  request: DeregistrationRequest,
): readonly string[] => [
  `GET BU36-M036/MOD036/index.zul: a fresh 036 for ${request.nif} (refused unless the form names it).`,
  `Tick casilla 150 (baja en el censo), casilla 151 cause "${request.causa}", casilla 152 fecha efectiva ${request.fecha}.`,
  ...request.sucesores.map(
    (successor) =>
      `Page 13 sucesor: ${successor.nif} ${successor.nombre}, ${successor.porcentaje} %, cuota ${successor.cuota}.`,
  ),
  `Sign in ${request.lugar} as ${request.firmado} (${request.calidad}).`,
  'Validar declaración: any AEAT error stops here, before the signature.',
  'Firmar y Enviar, accept the submission and echo onPresenvali: the 036 is filed and the entity is deregistered from the censo with that date.',
]
