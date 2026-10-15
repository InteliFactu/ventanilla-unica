import { afterEach, expect, it, vi } from 'vitest'
import { parseCliOptions } from './parseCliOptions'
import { rayuelaCommands } from './rayuelaCommands'
import { runCli } from './runCli'

afterEach(() => {
  vi.unstubAllEnvs()
})
it('registers all five read-only password commands and accepts no credential arguments', async () => {
  expect(rayuelaCommands.map((command) => command.action)).toEqual([
    'hijos',
    'mensajes',
    'horario',
    'faltas',
    'profesorado',
  ])
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', '')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', '')
  for (const command of rayuelaCommands) {
    expect(command.login).toBe('password')
    expect(command.effect).toBeUndefined()
    expect(() =>
      parseCliOptions(['--clave', 'secret'], command.options),
    ).toThrow()
    await expect(
      runCli(['rayuela', command.action], rayuelaCommands, () => {}),
    ).rejects.toThrow('VENTANILLA_UNICA_RAYUELA_USUARIO')
  }
})
