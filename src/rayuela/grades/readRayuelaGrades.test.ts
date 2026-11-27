import { afterEach, expect, it, vi } from 'vitest'

import { scriptedRayuelaSession } from '../session/fixtures/scriptedRayuelaSession'
import { readRayuelaGrades } from './readRayuelaGrades'

afterEach(() => {
  vi.unstubAllEnvs()
})

it('selects a past academic year the way the portal year selector does', async () => {
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', 'synthetic-user')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', 'synthetic-password')
  const client = scriptedRayuelaSession(
    "var c_RegNotCurAct= 456; <div accion=\"('RegNotCurAct','789','x')\">",
    '<select name="C_ANNO"><option value="2025" selected>2025-2026</option></select>No existen datos',
  )
  await expect(
    readRayuelaGrades(client, undefined, '2025-2026'),
  ).resolves.toMatchObject({ academicYear: '2025-2026' })
  expect(client.request.mock.calls[5]?.[0]).toMatch(
    /COD_PAGINA=456.*&C_ANNO=2025$/,
  )
  await expect(
    readRayuelaGrades(client, undefined, '2025-2027'),
  ).rejects.toThrow('--curso')
})
