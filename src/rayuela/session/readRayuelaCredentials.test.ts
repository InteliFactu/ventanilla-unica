import { afterEach, expect, it, vi } from 'vitest'
import { readRayuelaCredentials } from './readRayuelaCredentials'

afterEach(() => {
  vi.unstubAllEnvs()
})
it('requires both environment variables without disclosing a password', () => {
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', '')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
  expect(readRayuelaCredentials).toThrow(
    'VENTANILLA_UNICA_RAYUELA_USUARIO and VENTANILLA_UNICA_RAYUELA_CLAVE',
  )
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
  expect(readRayuelaCredentials()).toEqual({
    usuario: 'synthetic-user',
    clave: 'synthetic-password',
  })
})
