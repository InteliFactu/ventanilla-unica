import { readCount } from '../parsers/readCount'
import type { DgtCounters } from '../types/DgtCounters'

/** The merged counter answers mapped to their field names. */
export const mapMiDgtCounters = (
  answer: Readonly<Record<string, unknown>>,
): DgtCounters => ({
  vehiculos: readCount(answer['NumeroVehiculos']),
  sanciones: readCount(answer['NumeroSanciones']),
  registros: readCount(answer['NumeroRegistros']),
  puntos: readCount(answer['NumeroPuntos']),
  permisos: readCount(answer['NumeroPermisos']),
  citas: readCount(answer['NumeroCitas']),
  representantes: readCount(answer['NumeroRepresentantes']),
  representados: readCount(answer['NumeroRepresentados']),
  avisosVehiculos: readCount(answer['AlertaVehiculos']),
  avisosSanciones: readCount(answer['AlertaSanciones']),
})
