import { afterEach, expect, it, vi } from 'vitest'
import { parseCliOptions } from './parseCliOptions'
import { rayuelaCommands } from './rayuelaCommands'
import { runCli } from './runCli'

afterEach(() => {
  vi.unstubAllEnvs()
})
it('registers the password commands and accepts no credential arguments', async () => {
  expect(rayuelaCommands.map((command) => command.action)).toEqual([
    'hijos',
    'mensajes',
    'horario',
    'faltas',
    'profesorado',
    'responder',
  ])
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_USUARIO', '')
  vi.stubEnv('VENTANILLA_UNICA_RAYUELA_CLAVE', '')
  for (const command of rayuelaCommands) {
    expect(command.login).toBe('password')
    expect(command.effect).toBe(
      command.action === 'responder' ? 'write' : undefined,
    )
    expect(() =>
      parseCliOptions(['--clave', 'secret'], command.options),
    ).toThrow()
    await expect(
      runCli(
        [
          'rayuela',
          command.action,
          ...(command.action === 'responder'
            ? ['--id', '1', '--texto', 'x']
            : []),
        ],
        rayuelaCommands,
        () => {},
      ),
    ).rejects.toThrow('VENTANILLA_UNICA_RAYUELA_USUARIO')
  }
})
