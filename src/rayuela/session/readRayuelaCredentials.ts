import type { RayuelaCredentials } from './types/RayuelaCredentials'
/** Passwords never come from CLI arguments. */
export const readRayuelaCredentials = (): RayuelaCredentials => {
  const usuario = process.env['VENTANILLA_UNICA_RAYUELA_USUARIO']
  const clave = process.env['VENTANILLA_UNICA_RAYUELA_CLAVE']
  if (!usuario || !clave)
    throw new Error(
      'Rayuela requires VENTANILLA_UNICA_RAYUELA_USUARIO and VENTANILLA_UNICA_RAYUELA_CLAVE',
    )
  return { usuario, clave }
}
