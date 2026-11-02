import type { ActivitiesRequest } from '../types/ActivitiesRequest'
import { activityProblems } from './activityProblems'

/** Every reason the activity options cannot be filed as given; empty means valid. */
export const activitiesProblems = (
  request: ActivitiesRequest,
): readonly string[] => {
  const checks: readonly (readonly [boolean, string])[] = [
    [/^[0-9A-Z]{9}$/.test(request.nif), '--nif must be 9 characters.'],
    [request.actividades.length > 0, '--actividades is required.'],
    [
      /^\d{2}\/\d{2}\/\d{4}$/.test(request.fecha),
      '--fecha must be DD/MM/YYYY (fecha de alta, casilla 406).',
    ],
    [request.provincia.trim() !== '', '--provincia is required.'],
    [request.municipio.trim() !== '', '--municipio is required.'],
    [request.lugar.trim() !== '', '--lugar is required.'],
    [request.firmado.trim() !== '', '--firmado is required.'],
    [request.calidad.trim() !== '', '--calidad is required.'],
  ]
  return [
    ...checks.filter(([ok]) => !ok).map(([, message]) => message),
    ...request.actividades.flatMap(activityProblems),
  ]
}
